import { type RefObject, useEffect, useRef } from 'react';

let didWarnMissingIntersectionObserver = false;

const useIntersectionObserver = (
  ref: RefObject<HTMLElement | null>,
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit,
) => {
  const isSupported = typeof IntersectionObserver !== 'undefined';
  const storedCallback = useRef(callback);

  useEffect(() => {
    storedCallback.current = callback;
  });

  useEffect(() => {
    if (isSupported) {
      return;
    }

    if (!didWarnMissingIntersectionObserver) {
      console.warn(
        '[useIntersectionObserver] IntersectionObserver API를 지원하지 않아 교차 상태를 감지하지 않습니다. IntersectionObserver polyfill 설치를 권장합니다.',
      );
      didWarnMissingIntersectionObserver = true;
    }
  }, [isSupported]);

  useEffect(() => {
    const target = ref.current;
    if (!isSupported || !target) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries.at(0);
      if (entry) {
        storedCallback.current(entry);
      }
    }, options);

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
    // options 객체 identity가 아닌 실제 관측 설정만 의존한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- root/rootMargin/threshold
  }, [ref, isSupported, options?.root, options?.rootMargin, options?.threshold]);

  return { isSupported };
};

export { useIntersectionObserver };
