const isKakaoTalkInApp = (userAgent: string) => /KAKAOTALK/i.test(userAgent);

const isAppleMobile = (userAgent: string) => /iPad|iPhone|iPod/i.test(userAgent);

const getKakaoExternalBrowserHref = (url: string) =>
  `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;

const getKakaoInAppCloseHref = (userAgent: string) =>
  isAppleMobile(userAgent) ? 'kakaoweb://closeBrowser' : 'kakaotalk://inappbrowser/close';

const openKakaoExternalBrowser = () => {
  const { userAgent } = navigator;

  if (!isKakaoTalkInApp(userAgent)) {
    return false;
  }

  window.location.href = getKakaoExternalBrowserHref(window.location.href);

  window.setTimeout(() => {
    window.location.href = getKakaoInAppCloseHref(userAgent);
  }, 100);

  return true;
};

export {
  getKakaoExternalBrowserHref,
  getKakaoInAppCloseHref,
  isKakaoTalkInApp,
  openKakaoExternalBrowser,
};
