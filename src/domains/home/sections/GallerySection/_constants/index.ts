import previewImage from '../../BannerSection/main.jpg';

// 실제 갤러리 사진 전달 전까지 기존 사진으로 30장의 자리를 임시 구성한다.
const GALLERY_PHOTOS = Array.from({ length: 30 }, (_, index) => ({
  id: `gallery-preview-${index + 1}`,
  src: previewImage,
  alt: `갤러리 배치 확인용 사진 ${index + 1}`,
}));

const GALLERY_PREVIEW_PHOTOS = GALLERY_PHOTOS.slice(0, 5);

export { GALLERY_PHOTOS, GALLERY_PREVIEW_PHOTOS };
