import previewImage from '../../BannerSection/main.jpg';

// 실제 갤러리 사진 전달 전까지 기존 사진으로 여섯 칸의 배치를 확인한다.
const GALLERY_PHOTOS = Array.from({ length: 6 }, (_, index) => ({
  id: `gallery-preview-${index + 1}`,
  src: previewImage,
  alt: `갤러리 배치 확인용 사진 ${index + 1}`,
}));

export { GALLERY_PHOTOS };
