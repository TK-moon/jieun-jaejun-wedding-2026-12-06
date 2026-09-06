const galleryImageModules = import.meta.glob<string>('../_images/*.jpg', {
  eager: true,
  import: 'default',
});

const GALLERY_PHOTOS = Object.entries(galleryImageModules)
  .toSorted(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath, 'en', { numeric: true }))
  .map(([, src], index) => ({
    id: `gallery-photo-${index + 1}`,
    src,
    alt: `우리의 사진 ${index + 1}`,
  }));

export { GALLERY_PHOTOS };
