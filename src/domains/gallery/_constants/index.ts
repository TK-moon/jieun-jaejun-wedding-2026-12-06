import type { GalleryPhoto } from '../_types';

const galleryOriginalModules = import.meta.glob<string>('../_images/origin/*.webp', {
  eager: true,
  import: 'default',
});

const galleryThumbnailModules = import.meta.glob<string>('../_images/thumbnail/*.jpg', {
  eager: true,
  import: 'default',
});

const GALLERY_PHOTOS: GalleryPhoto[] = Object.entries(galleryOriginalModules)
  .toSorted(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath, 'en', { numeric: true }))
  .map(([path, originalSrc], index) => ({
    id: `gallery-photo-${index + 1}`,
    thumbnailSrc:
      galleryThumbnailModules[path.replace('/origin/', '/thumbnail/').replace(/\.webp$/, '.jpg')],
    originalSrc,
    alt: `우리의 사진 ${index + 1}`,
  }));

export { GALLERY_PHOTOS };
