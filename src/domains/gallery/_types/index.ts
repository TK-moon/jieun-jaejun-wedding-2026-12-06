export interface GalleryImageSource {
  webp: string;
  jpg: string;
}

export interface GalleryPhoto {
  id: string;
  thumbnailSrc: GalleryImageSource;
  originalSrc: GalleryImageSource;
  alt: string;
}
