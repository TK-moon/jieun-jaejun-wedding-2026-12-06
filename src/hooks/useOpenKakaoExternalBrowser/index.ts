import { useEffect } from 'react';
import { openKakaoExternalBrowser } from './_utils';

const useOpenKakaoExternalBrowser = () => {
  useEffect(() => {
    openKakaoExternalBrowser();
  }, []);
};

export { useOpenKakaoExternalBrowser };
