import type { GalleryPhoto } from '../_types';

const originalWebpModules = import.meta.glob<string>('../_images/origin/*.webp', {
  eager: true,
  import: 'default',
});

const originalJpgModules = import.meta.glob<string>('../_images/resized/2880/*.jpg', {
  eager: true,
  import: 'default',
});

const thumbnailWebpModules = import.meta.glob<string>('../_images/thumbnail/*.webp', {
  eager: true,
  import: 'default',
});

const thumbnailJpgModules = import.meta.glob<string>('../_images/thumbnail/*.jpg', {
  eager: true,
  import: 'default',
});

const toJpgPath = (webpPath: string) => webpPath.replace(/\.webp$/, '.jpg');

const toThumbnailPath = (originPath: string) => originPath.replace('/origin/', '/thumbnail/');

const toOriginalJpgPath = (originWebpPath: string) =>
  toJpgPath(originWebpPath.replace('/origin/', '/resized/2880/'));

const requireImageSrc = (modules: Record<string, string>, path: string) => {
  const src = modules[path];

  if (!src) {
    throw new Error(`Missing gallery image: ${path}`);
  }

  return src;
};

const GALLERY_PHOTOS: GalleryPhoto[] = Object.entries(originalWebpModules)
  .toSorted(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath, 'en', { numeric: true }))
  .map(([path, originalWebpSrc], index) => {
    const thumbnailWebpPath = toThumbnailPath(path);

    return {
      id: `gallery-photo-${index + 1}`,
      thumbnailSrc: {
        webp: requireImageSrc(thumbnailWebpModules, thumbnailWebpPath),
        jpg: requireImageSrc(thumbnailJpgModules, toJpgPath(thumbnailWebpPath)),
      },
      originalSrc: {
        webp: originalWebpSrc,
        jpg: requireImageSrc(originalJpgModules, toOriginalJpgPath(path)),
      },
      alt: `우리의 사진 ${index + 1}`,
    };
  });

export { GALLERY_PHOTOS };
