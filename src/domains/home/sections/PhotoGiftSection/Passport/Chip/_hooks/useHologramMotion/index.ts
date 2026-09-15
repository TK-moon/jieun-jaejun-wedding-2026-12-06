import { useEffect, useState, type RefObject } from 'react';
import {
  createHologramRenderer,
  createDetailRenderer,
  type HologramDetail,
} from '../../../Hologram/_utils';

import {
  getScreenGravity,
  createTiltCalibration,
  followTiltCalibration,
  getTiltInput,
  type GravityVector,
  type TiltCalibration,
} from './_utils';

// Safari exposes this method in addition to the standard DOM constructor type.
interface MotionPermission {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

type Status = 'idle' | 'pointer' | 'active' | 'fallback' | 'reduced';

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

const SENSOR_SMOOTHING_MS = 24;
const RENDER_SMOOTHING_MS = 22;
const POSTURE_FOLLOW_MS = 450;

const useHologramMotion = (
  chipRef: RefObject<HTMLDivElement | null>,
  hologramRef: RefObject<HTMLSpanElement | null>,
  activationButtonRef: RefObject<HTMLButtonElement | null>,
) => {
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const chip = chipRef.current;
    const foil = hologramRef.current;
    const activationButton = activationButtonRef.current;
    if (!chip || !foil || !activationButton) return;

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
    let gestureListening = false;
    let disposed = false;
    let visible = false;
    let listening = false;
    let requesting = false;
    let receivedMotion = false;
    let denied = false;
    let frame = 0;
    let reflectionAngle = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let baseline: TiltCalibration | undefined;
    let filteredGravity: GravityVector | undefined;
    let lastMotionTime = 0;
    let lastFrameTime = 0;
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
    const animate = (now: number) => {
      frame = 0;
      if (!canAnimate()) return;
      // A short, time-based blend keeps the response consistent across refresh rates.
      const blend = 1 - Math.exp(-Math.max(0, now - lastFrameTime) / RENDER_SMOOTHING_MS);
      lastFrameTime = now;
      current.x += (target.x - current.x) * blend;
      current.y += (target.y - current.y) * blend;
      reflectionAngle += rotationDelta() * blend;
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
      if (!frame) {
        lastFrameTime = performance.now();
        frame = requestAnimationFrame(animate);
      }
    };
    const onMotion = (event: DeviceMotionEvent) => {
      const rawGravity = event.accelerationIncludingGravity;
      if (!rawGravity) return;
      const screenAngle = window.screen.orientation?.angle ?? window.orientation ?? 0;
      const gravity = getScreenGravity(rawGravity, event.acceleration, screenAngle);
      if (!gravity) return;
      if (!receivedMotion) {
        receivedMotion = true;
        clearTimeout(timeout);
        setStatus('active');
      }
      const now = performance.now();
      const elapsed = Math.max(0, Math.min(100, now - lastMotionTime));
      if (!baseline || baseline.screenAngle !== screenAngle) {
        filteredGravity = gravity;
        baseline = createTiltCalibration(gravity, screenAngle);
      } else if (filteredGravity) {
        // Time-based filtering feels the same on 30/60/120 Hz sensor streams.
        const blend = 1 - Math.exp(-Math.max(0, now - lastMotionTime) / SENSOR_SMOOTHING_MS);
        filteredGravity = {
          x: filteredGravity.x + (gravity.x - filteredGravity.x) * blend,
          y: filteredGravity.y + (gravity.y - filteredGravity.y) * blend,
          z: filteredGravity.z + (gravity.z - filteredGravity.z) * blend,
        };
      }
      lastMotionTime = now;
      const input = getTiltInput(filteredGravity ?? gravity, baseline);
      move(input.x, input.y);
      // Re-centre the neutral posture independently of the fast visual response.
      // A new seated/lying position must not leave subsequent movement saturated.
      baseline = followTiltCalibration(
        filteredGravity ?? gravity,
        baseline,
        1 - Math.exp(-elapsed / POSTURE_FOLLOW_MS),
      );
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
    const stopGesture = () => {
      activationButton.removeEventListener('click', onGesture, true);
      gestureListening = false;
    };
    const onGesture = () => {
      if (requesting || desktopPointer.matches || reducedMotion.matches) return;
      if (
        !supported ||
        receivedMotion ||
        denied ||
        permissionGranted ||
        !motion?.requestPermission
      ) {
        stopGesture();
        return;
      }
      requesting = true;
      // Keep this call directly in the user gesture for iOS Safari.
      void motion
        .requestPermission()
        .then((permission) => {
          if (disposed) return;
          permissionGranted = permission === 'granted';
          denied = !permissionGranted;
        })
        .catch(() => {
          if (disposed) return;
          denied = true;
        })
        .finally(() => {
          requesting = false;
          if (disposed) return;
          stopGesture();
          stopMotion();
          sync();
        });
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
      const shouldCaptureGesture =
        needsPermission &&
        supported &&
        !desktopPointer.matches &&
        !reducedMotion.matches &&
        !denied &&
        !permissionGranted &&
        !receivedMotion;
      if (shouldCaptureGesture && !gestureListening) {
        activationButton.addEventListener('click', onGesture, true);
        gestureListening = true;
      } else if (!shouldCaptureGesture && gestureListening) {
        stopGesture();
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
            setStatus(needsPermission && !permissionGranted ? 'idle' : 'fallback');
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
      else setStatus('idle');
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
      observer?.disconnect();
      stopGesture();
      window.removeEventListener('devicemotion', onMotion);
      window.removeEventListener('pointermove', onPointer);
      desktopPointer.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', sync);
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [chipRef, hologramRef, activationButtonRef]);

  return { status };
};

export { useHologramMotion };

export type { Status };
