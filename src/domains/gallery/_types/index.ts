export interface GalleryImageSource {
  webp: string;
  jpg: string;
}

export interface GalleryPhoto {
  id: string;
  thumbnailSrc: GalleryImageSource;
  displaySrc: {
    src: string;
    srcSet: string;
    sizes: string;
    width: number;
    height: number;
  };
  alt: string;
}
