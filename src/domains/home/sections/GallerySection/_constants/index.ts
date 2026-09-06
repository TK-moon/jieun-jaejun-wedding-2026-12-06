import sub1 from '../_images/sub1.jpg';
import sub2 from '../_images/sub2.jpg';
import sub3 from '../_images/sub3.jpg';
import sub4 from '../_images/sub4.jpg';
import sub5 from '../_images/sub5.jpg';

const GALLERY_PREVIEW_PHOTOS = [sub1, sub2, sub3, sub4, sub5].map((src, index) => ({
  id: `gallery-preview-${index + 1}`,
  src,
  alt: `우리의 순간 ${index + 1}`,
}));

export { GALLERY_PREVIEW_PHOTOS };
