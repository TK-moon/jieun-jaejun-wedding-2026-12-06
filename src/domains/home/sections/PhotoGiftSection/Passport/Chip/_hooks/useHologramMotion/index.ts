import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  createHologramRenderer,
  createDetailRenderer,
  type HologramDetail,
} from '../../../Hologram/_utils';

// Safari exposes this method in addition to the standard DOM constructor type.
interface MotionPermission {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

type Status = 'idle' | 'pointer' | 'permission' | 'requesting' | 'active' | 'fallback' | 'reduced';

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

const useHologramMotion = (
  chipRef: RefObject<HTMLDivElement | null>,
  hologramRef: RefObject<HTMLSpanElement | null>,
) => {
  const [status, setStatus] = useState<Status>('idle');
  const activateRef = useRef<() => void>(() => {});

  useEffect(() => {
    const chip = chipRef.current;
    const foil = hologramRef.current;
    if (!chip || !foil) return;

    const createPart = (part: 'background' | HologramDetail, direction: 1 | -1) => {
      const element = foil.querySelector<HTMLElement>(`[data-hologram-part="${part}"]`);
      const surface = element?.querySelector<HTMLCanvasElement>('[data-hologram-layer="surface"]');
      const reflection = element?.querySelector<HTMLCanvasElement>(
        '[data-hologram-layer="reflection"]',
      );
      if (!surface || !reflection) return;
      const renderFoil = createHologramRenderer(surface, reflection);
      const renderDetail =
        part === 'background' ? undefined : createDetailRenderer(reflection, part);
      return (x: number, y: number, angle: number) => {
        const reflectionX = x * direction;
        const reflectionY = y * direction;
        renderFoil?.(x, y, reflectionX, reflectionY);
        // Reversing both input axes rotates the reflection direction by 180 degrees.
        const reflectionAngle = angle + (direction === -1 ? 180 : 0);
        renderDetail?.(reflectionX, reflectionY, reflectionAngle);
      };
    };
    // Reverse X and Y only for the ring and flash reflection layers.
    const renderBackground = createPart('background', 1);
    const renderLensRing = createPart('lens-ring', -1);
    const renderLens = createPart('lens', 1);
    const renderFlash = createPart('flash', -1);
    const motion = window.DeviceMotionEvent as unknown as MotionPermission | undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const supported = window.isSecureContext && Boolean(motion);
    const needsPermission = typeof motion?.requestPermission === 'function';
    let permissionGranted = false;
    let pointerListening = false;
    let disposed = false;
    let visible = false;
    let listening = false;
    let requesting = false;
    let receivedMotion = false;
    let denied = false;
    let frame = 0;
    let reflectionAngle = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let baseline: { x: number; y: number; angle: number } | undefined;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const canAnimate = () => visible && !document.hidden && !reducedMotion.matches;

    const rotationDelta = () => {
      // Keep the last direction near the centre, where atan2 becomes unstable.
      if (Math.hypot(target.x, target.y) < 0.06) return 0;
      const angle = (Math.atan2(target.y, target.x) * 180) / Math.PI + 135;
      return ((((angle - reflectionAngle) % 360) + 540) % 360) - 180;
    };
    const paint = () => {
      renderBackground?.(current.x, current.y, reflectionAngle);
      renderLensRing?.(current.x, current.y, reflectionAngle);
      renderLens?.(current.x, current.y, reflectionAngle);
      renderFlash?.(current.x, current.y, reflectionAngle);
    };
    const animate = () => {
      frame = 0;
      if (!canAnimate()) return;
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      reflectionAngle += rotationDelta() * 0.16;
      paint();
      if (
        Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.002 ||
        Math.abs(rotationDelta()) > 0.1
      ) {
        frame = requestAnimationFrame(animate);
      }
    };
    const move = (x: number, y: number) => {
      if (!canAnimate()) return;
      target.x = clamp(x);
      target.y = clamp(y);
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const onMotion = (event: DeviceMotionEvent) => {
      const gravity = event.accelerationIncludingGravity;
      if (!gravity || typeof gravity.x !== 'number' || typeof gravity.y !== 'number') return;
      if (!Number.isFinite(gravity.x) || !Number.isFinite(gravity.y)) return;
      if (!receivedMotion) {
        receivedMotion = true;
        clearTimeout(timeout);
        setStatus('active');
      }
      const angle = window.screen.orientation?.angle ?? window.orientation ?? 0;
      const radians = (angle * Math.PI) / 180;
      const x = gravity.x * Math.cos(radians) + gravity.y * Math.sin(radians);
      const y = -gravity.x * Math.sin(radians) + gravity.y * Math.cos(radians);
      // Calibrate to the way the guest holds the phone, including landscape rotation.
      if (!baseline || baseline.angle !== angle) baseline = { x, y, angle };
      move((x - baseline.x) / 4.5, (y - baseline.y) / 4.5);
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      move(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    const stopMotion = () => {
      window.removeEventListener('devicemotion', onMotion);
      listening = false;
      receivedMotion = false;
      clearTimeout(timeout);
    };
    const sync = () => {
      const shouldTrackPointer = desktopPointer.matches && canAnimate();
      if (shouldTrackPointer && !pointerListening) {
        window.addEventListener('pointermove', onPointer, { passive: true });
        pointerListening = true;
      } else if (!shouldTrackPointer && pointerListening) {
        window.removeEventListener('pointermove', onPointer);
        pointerListening = false;
      }
      // Listening is passive: existing permission can deliver data without another tap.
      const shouldListen = !desktopPointer.matches && supported && !denied && canAnimate();
      if (shouldListen && !listening) {
        baseline = undefined;
        receivedMotion = false;
        window.addEventListener('devicemotion', onMotion, { passive: true });
        listening = true;
        timeout = setTimeout(() => {
          if (!receivedMotion) {
            setStatus(needsPermission && !permissionGranted ? 'permission' : 'fallback');
          }
        }, 1800);
      } else if (!shouldListen && listening) {
        stopMotion();
      }
      if (!canAnimate()) {
        cancelAnimationFrame(frame);
        frame = 0;
        current.x = current.y = target.x = target.y = 0;
        reflectionAngle = 0;
        paint();
      }
      if (reducedMotion.matches) setStatus('reduced');
      else if (desktopPointer.matches) setStatus('pointer');
      else if (!supported || denied) setStatus('fallback');
      else if (receivedMotion) setStatus('active');
      else if (!requesting) setStatus('idle');
    };
    activateRef.current = async () => {
      if (requesting || !canAnimate() || desktopPointer.matches) return;
      if (!supported || receivedMotion || denied || !motion?.requestPermission) return;
      requesting = true;
      setStatus('requesting');
      try {
        // Keep this call directly in the user gesture for iOS Safari.
        const permission = await motion.requestPermission();
        if (disposed) return;
        permissionGranted = permission === 'granted';
        denied = !permissionGranted;
      } catch {
        if (disposed) return;
        denied = true;
      }
      requesting = false;
      if (!disposed) {
        stopMotion();
        sync();
      }
    };

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? undefined
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
          });
    if (observer) observer.observe(chip.closest('section') ?? chip);
    else visible = true;
    desktopPointer.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    sync();

    return () => {
      disposed = true;
      activateRef.current = () => {};
      observer?.disconnect();
      window.removeEventListener('devicemotion', onMotion);
      window.removeEventListener('pointermove', onPointer);
      desktopPointer.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', sync);
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [chipRef, hologramRef]);

  return { status, activate: () => activateRef.current() };
};

export { useHologramMotion };
