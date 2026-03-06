// 1. Round 1 (분위기) - 12개 테마 데이터
export const round1_themes = [
  { id: 'modern', name: '모던', imageSrc: '/images/modern.jpg' },
  { id: 'minimal', name: '미니멀', imageSrc: '/images/minimal.jpg' },
  { id: 'classic', name: '클래식', imageSrc: '/images/classic.jpg' },
  { id: 'luxury', name: '럭셔리', imageSrc: '/images/luxury.jpg' },
  { id: 'natural', name: '내추럴', imageSrc: '/images/natural.jpg' },
  { id: 'cozy', name: '코지', imageSrc: '/images/cozy.jpg' },
  { id: 'dynamic', name: '다이내믹', imageSrc: '/images/dynamic.jpg' },
  { id: 'chic', name: '시크', imageSrc: '/images/chic.jpg' },
  { id: 'vintage', name: '빈티지', imageSrc: '/images/vintage.jpg' },
  { id: 'kitsch', name: '키치', imageSrc: '/images/kitsch.jpg' },
  { id: 'futuristic', name: '퓨처리스틱', imageSrc: '/images/futuristic.jpg' },
  { id: 'formal', name: '포멀', imageSrc: '/images/formal.jpg' }
];

// 2. Round 2~4 데모용 기본 데이터 (종속 데이터)
export const defaultRoundData = {
  round2_texture: [
    { id: 'rough', name: '거칠고 매트한', imageSrc: '/images/rough.jpg' },
    { id: 'smooth', name: '부드럽고 매끄러운', imageSrc: '/images/smooth.jpg' }
  ],
  round3_shape: [
    { id: 'curved', name: '곡선적/유기적', imageSrc: '/images/curved.jpg' },
    { id: 'straight', name: '직선적/기하학적', imageSrc: '/images/straight.jpg' },
    { id: 'symmetrical', name: '대칭적/균형잡힌', imageSrc: '/images/symmetrical.jpg' },
    { id: 'asymmetrical', name: '비대칭적/자유로운', imageSrc: '/images/asymmetrical.jpg' }
  ],
  round4_light: [
    { id: 'warm', name: '따뜻하고 부드러운', imageSrc: '/images/warm.jpg' },
    { id: 'cool', name: '차갑고 선명한', imageSrc: '/images/cool.jpg' }
  ]
};

// 3. 테마 매핑 (데모용)
export const theme_data = round1_themes.reduce((acc, theme) => {
  acc[theme.id] = defaultRoundData;
  return acc;
}, {});
