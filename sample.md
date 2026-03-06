# 프로젝트 명세서: 브랜드 이미지 이상형 월드컵 (Brand Image World Cup)

## 1. 프로젝트 개요 (Overview)
* **목적:** 고객사 미팅 중 실시간으로 브랜드의 톤앤매너(분위기, 질감, 조형, 색감)를 도출하기 위한 1:1 이상형 월드컵 형태의 웹 애플리케이션 개발.
* **최종 결과물:** 4개의 라운드에서 각각 우승한 총 4장의 이미지가 2x2 그리드 형태로 조합된 '무드보드(Moodboard)'.
* **개발 환경:** 데모 시연을 위해 로컬 환경의 정적 이미지 파일을 활용하며, 클라이언트 전용이므로 직관적이고 깔끔한 UI/UX 및 부드러운 화면 전환이 필수적임.

## 2. 디렉토리 구조 및 에셋 (Directory & Assets)
모든 이미지 에셋은 로컬의 `public/images/` 경로에 저장되어 있다. 임의의 외부 URL을 생성하지 말고, 반드시 아래 명시된 로컬 경로를 사용해야 한다.

## 3. 데이터 구조 설계 (Data Structure)
1라운드 우승 결과에 따라 2~4라운드 데이터가 달라질 수 있도록 확장성을 고려한 매핑 구조를 사용한다. (단, 현재 데모 버전에서는 1라운드의 어떤 테마를 선택하든 2~4라운드에 동일한 `defaultRoundData`를 렌더링하도록 처리한다.)

```javascript
// 1. Round 1 (분위기) - 12개 테마 데이터
const round1_themes = [
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
const defaultRoundData = {
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

// '내추럴(natural)' 전용 데이터
const naturalRoundData = {
  round2_texture: [
    { id: 'rough', name: '거칠고 매트한', imageSrc: '/images/natural_rough.jpg' },
    { id: 'smooth', name: '부드럽고 매끄러운', imageSrc: '/images/natural_smooth.jpg' }
  ],
  round3_shape: [
    { id: 'curved', name: '곡선적/유기적', imageSrc: '/images/natural_curved.jpg' },
    { id: 'straight', name: '직선적/기하학적', imageSrc: '/images/natural_straight.jpg' },
    { id: 'symmetrical', name: '대칭적/균형잡힌', imageSrc: '/images/natural_symmetrical.jpg' },
    { id: 'asymmetrical', name: '비대칭적/자유로운', imageSrc: '/images/natural_asymmetrical.jpg' }
  ],
  round4_light: [
    { id: 'warm', name: '따뜻하고 부드러운', imageSrc: '/images/natural_warm.jpg' },
    { id: 'cool', name: '차갑고 선명한', imageSrc: '/images/natural_cool.jpg' }
  ]
};

// 3. 테마 매핑 (업데이트됨: natural 분기 처리)
const theme_data = round1_themes.reduce((acc, theme) => {
  if (theme.id === 'natural') {
    acc[theme.id] = naturalRoundData; // 내추럴을 선택하면 내추럴 전용 데이터 연결
  } else {
    acc[theme.id] = defaultRoundData; // 나머지는 기본 데이터 연결
  }
  return acc;
}, {});

## 4. 핵심 상태 관리 (State Management)
애플리케이션은 다음과 같은 핵심 상태(State)를 관리해야 한다.
* `currentRound`: 현재 진행 중인 라운드 번호 (1~4)
* `selectedThemeId`: 1라운드에서 최종 우승한 테마의 ID (이 값을 키로 사용하여 2~4라운드 데이터를 `theme_data`에서 불러옴)
* `currentMatchUp`: 현재 화면에 렌더링되는 2개의 이미지 객체 배열
* `nextTierPool`: 사용자가 선택하여 승리한 이미지들이 다음 토너먼트 티어를 위해 임시로 담기는 배열
* `finalImages`: 각 라운드가 종료될 때마다 해당 라운드의 최종 우승 이미지 객체가 순서대로 추가되는 배열 (총 4개)

## 5. 단계별 워킹 로직 (Flow & Logic)
1. **Round 1 (분위기 - 12개 중 1개 직접 선택):** `round1_themes` 배열의 12개 요소를 랜덤으로 셔플한 뒤, 한 화면(그리드 뷰)에 보여준다. 사용자가 1개의 이미지를 직접 선택하면 해당 객체를 `finalImages`에 추가하고, `id`를 `selectedThemeId`에 저장한 뒤 라운드를 전환한다.
2. **Round 2 (질감 - 2강 진행):** `theme_data[selectedThemeId].round2_texture` 배열(2개)을 불러와 결승전을 진행한다. 우승자를 `finalImages`에 추가한다.
3. **Round 3 (조형 - 4강 진행):** `theme_data[selectedThemeId].round3_shape` 배열(4개)을 불러와 4강 토너먼트를 진행한다. 최종 우승자를 `finalImages`에 추가한다.
4. **Round 4 (빛과 컬러 - 2강 진행):** `theme_data[selectedThemeId].round4_light` 배열(2개)을 불러와 결승전을 진행한다. 우승자를 `finalImages`에 추가한다.
5. **최종 결과 화면 (Moodboard):** 4라운드가 종료되어 `finalImages` 배열의 길이가 4가 되면, 월드컵 진행 화면을 언마운트하고 4장의 이미지를 2x2 Grid(격자) 형태의 단일 컴포넌트로 렌더링한다.

## 6. UI/UX 요구사항
* 이미지는 1:1 대결 구도가 명확히 보이도록 화면을 양분하여 가득 채우는 형태로 구성한다.
* 이미지 선택 시 즉각적이고 부드러운 트랜지션(Transition) 애니메이션을 적용한다.
* 이미지 하단 혹은 중앙에 각 이미지의 `name`(예: '모던', '거칠고 매트한')을 가독성 있게 표시한다.