import sub1Jpg from '../_images/sub1.jpg';
import sub1Webp from '../_images/sub1.webp';
import sub2Jpg from '../_images/sub2.jpg';
import sub2Webp from '../_images/sub2.webp';
import sub3Jpg from '../_images/sub3.jpg';
import sub3Webp from '../_images/sub3.webp';
import sub4Jpg from '../_images/sub4.jpg';
import sub4Webp from '../_images/sub4.webp';
import sub5Jpg from '../_images/sub5.jpg';
import sub5Webp from '../_images/sub5.webp';

const GALLERY_PREVIEW_PHOTOS = [
  { webp: sub1Webp, jpg: sub1Jpg },
  { webp: sub2Webp, jpg: sub2Jpg },
  { webp: sub3Webp, jpg: sub3Jpg },
  { webp: sub4Webp, jpg: sub4Jpg },
  { webp: sub5Webp, jpg: sub5Jpg },
].map((src, index) => ({
  id: `gallery-preview-${index + 1}`,
  src,
  alt: `우리의 순간 ${index + 1}`,
}));

export { GALLERY_PREVIEW_PHOTOS };
