import previewImage from '../../BannerSection/main.jpg';
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

// 실제 갤러리 사진 전달 전까지 기존 사진으로 30장의 자리를 임시 구성한다.
const GALLERY_PHOTOS = Array.from({ length: 30 }, (_, index) => ({
  id: `gallery-preview-${index + 1}`,
  src: previewImage,
  alt: `갤러리 배치 확인용 사진 ${index + 1}`,
}));

export { GALLERY_PHOTOS, GALLERY_PREVIEW_PHOTOS };
