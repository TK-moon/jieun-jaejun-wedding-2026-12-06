import type { GalleryPhoto } from '../_types';
import imageDimensions from '../_images/resized/dimensions.json';

const resizedJpgModules = import.meta.glob<string>('../_images/resized/*/*.jpg', {
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

const IMAGE_SIZES = [960, 1920, 2880];

const requireImageSrc = (modules: Record<string, string>, path: string) => {
  const src = modules[path];

  if (!src) {
    throw new Error(`Missing gallery image: ${path}`);
  }

  return src;
};

const GALLERY_PHOTOS: GalleryPhoto[] = Object.entries(imageDimensions)
  .toSorted(([left], [right]) => left.localeCompare(right, 'en', { numeric: true }))
  .map(([filename, { width, height }], index) => {
    const thumbnailPath = `../_images/thumbnail/${filename}.webp`;
    const imageSrc = (size: number) =>
      requireImageSrc(resizedJpgModules, `../_images/resized/${size}/${filename}.jpg`);

    return {
      id: `gallery-photo-${index + 1}`,
      thumbnailSrc: {
        webp: requireImageSrc(thumbnailWebpModules, thumbnailPath),
        jpg: requireImageSrc(thumbnailJpgModules, toJpgPath(thumbnailPath)),
      },
      displaySrc: {
        src: imageSrc(2880),
        srcSet: IMAGE_SIZES.map(
          (size) => `${imageSrc(size)} ${Math.round((width * size) / 2880)}w`,
        ).join(', '),
        // Match object-fit: contain, including landscape viewports and high-density screens.
        sizes: `(min-aspect-ratio: ${width}/${height}) ${(100 * width) / height}vh, 100vw`,
        width,
        height,
      },
      alt: `우리의 사진 ${index + 1}`,
    };
  });

export { GALLERY_PHOTOS };
