import { useEffect, useState } from 'react';

const DESKTOP_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

const getDesktopPointerMatches = () =>
  typeof window !== 'undefined' && window.matchMedia(DESKTOP_POINTER_QUERY).matches;

const useDesktopPointer = () => {
  const [matches, setMatches] = useState(getDesktopPointerMatches);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_POINTER_QUERY);
    const sync = () => setMatches(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return matches;
};

export { useDesktopPointer };
