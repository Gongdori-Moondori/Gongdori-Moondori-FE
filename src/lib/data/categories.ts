export interface CategoryItem {
  id: string;
  name: string;
  unit: string;
  emoji?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  items: CategoryItem[];
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  totalItems: number;
  subcategories: SubCategory[];
}

export const categoryData: Category[] = [
  {
    id: 'beverages',
    name: '음료류',
    emoji: '🥤',
    totalItems: 6,
    subcategories: [
      {
        id: 'beverages-all',
        name: '전체',
        items: [
          { id: 'soda-1-5l', name: '사이다', unit: '1.5L' },
          { id: 'cola-1-5l', name: '콜라', unit: '1.5L' },
          { id: 'beer-500ml', name: '맥주', unit: '500ml' },
          { id: 'soju-360ml', name: '소주', unit: '360ml' },
          { id: 'milk-1l', name: '우유', unit: '1L' },
          { id: 'water-500ml', name: '생수', unit: '500ml' },
        ],
      },
    ],
  },
  {
    id: 'meat-seafood',
    name: '육류 및 수산물',
    emoji: '🥩',
    totalItems: 16,
    subcategories: [
      {
        id: 'meat',
        name: '육류 (6개)',
        items: [
          { id: 'ham-300g', name: '햄', unit: '300g' },
          { id: 'chicken-1kg', name: '닭고기', unit: '1kg' },
          { id: 'pork-100g', name: '돼지고기', unit: '100g' },
          { id: 'beef-imported-100g', name: '소고기(수입)', unit: '100g' },
          { id: 'beef-domestic-100g', name: '소고기(국산)', unit: '100g' },
          { id: 'sausage-135g-2pack', name: '소시지', unit: '135g 2개입' },
        ],
      },
      {
        id: 'seafood',
        name: '수산물 (7개)',
        items: [
          { id: 'shrimp-1kg', name: '새우(흰다리새우)', unit: '1kg' },
          { id: 'clam-1kg', name: '조개(바지락)', unit: '1kg' },
          { id: 'cutlassfish-large', name: '갈치(생물)', unit: '1마리(대)' },
          { id: 'mackerel-large', name: '고등어(신선냉장)', unit: '1마리(대)' },
          { id: 'squid-frozen', name: '오징어(국산, 냉동)', unit: '1마리' },
          { id: 'pollack-1', name: '명태', unit: '1마리' },
          { id: 'croaker-1', name: '조기(참조기)', unit: '1마리' },
          { id: 'fishcake-200g', name: '어묵', unit: '200g' },
          { id: 'tuna-can-150g', name: '통조림(참치)', unit: '150g' },
        ],
      },
      {
        id: 'protein-other',
        name: '기타 단백질 (3개)',
        items: [
          { id: 'eggs-10', name: '계란', unit: '10개' },
          { id: 'tofu-380g', name: '두부', unit: '380g' },
          { id: 'beans-1kg', name: '콩', unit: '1kg' },
        ],
      },
    ],
  },
  {
    id: 'grains-noodles',
    name: '곡류 및 면류',
    emoji: '🌾',
    totalItems: 7,
    subcategories: [
      {
        id: 'grains-noodles-all',
        name: '전체',
        items: [
          { id: 'rice-icheon-20kg', name: '쌀(이천쌀)', unit: '20kg' },
          { id: 'flour-1kg', name: '밀가루', unit: '1kg' },
          { id: 'pancake-flour-1kg', name: '부침가루', unit: '1kg' },
          { id: 'instant-rice-200g-4pack', name: '즉석밥', unit: '200g 4개입' },
          { id: 'ramen-5pack', name: '라면', unit: '5개입 1봉' },
          { id: 'cup-ramen-1', name: '컵라면', unit: '1개' },
          { id: 'noodles-900g', name: '국수', unit: '900g' },
        ],
      },
    ],
  },
  {
    id: 'vegetables',
    name: '채소류',
    emoji: '🥕',
    totalItems: 18,
    subcategories: [
      {
        id: 'root-vegetables',
        name: '뿌리채소 (6개)',
        items: [
          { id: 'carrot-1kg', name: '당근', unit: '1kg' },
          { id: 'sweet-potato-1kg', name: '고구마(밤고구마)', unit: '1kg' },
          { id: 'potato-100g', name: '감자', unit: '100g' },
          { id: 'onion-net', name: '양파', unit: '1망' },
          { id: 'radish-spring-1', name: '무(봄)', unit: '1개' },
          { id: 'garlic-peeled-1kg', name: '깐마늘', unit: '1kg' },
        ],
      },
      {
        id: 'leaf-vegetables',
        name: '잎채소 (5개)',
        items: [
          { id: 'perilla-leaves-100g', name: '깻잎', unit: '100g' },
          { id: 'spinach-1bundle', name: '시금치', unit: '1단' },
          { id: 'lettuce-red-100g', name: '상추(적상추)', unit: '100g' },
          { id: 'cabbage-summer-1', name: '배추(여름)', unit: '1포기' },
          { id: 'green-onion-1bundle', name: '대파', unit: '1단' },
        ],
      },
      {
        id: 'other-vegetables',
        name: '기타 채소 (7개)',
        items: [
          { id: 'green-pepper-100g', name: '풋고추', unit: '100g' },
          { id: 'paprika-200g', name: '파프리카', unit: '200g' },
          { id: 'tomato-1kg', name: '토마토', unit: '1kg' },
          {
            id: 'mushroom-oyster-100g',
            name: '버섯(새송이버섯)',
            unit: '100g',
          },
          { id: 'bean-sprouts-340g', name: '콩나물', unit: '340g' },
          { id: 'zucchini-1', name: '애호박', unit: '1개' },
          { id: 'cucumber-1', name: '오이(다다기)', unit: '1개' },
        ],
      },
    ],
  },
  {
    id: 'fruits',
    name: '과일류',
    emoji: '🍎',
    totalItems: 11,
    subcategories: [
      {
        id: 'fruits-all',
        name: '전체',
        items: [
          { id: 'banana-1bunch', name: '바나나', unit: '1송이' },
          { id: 'strawberry-100g', name: '딸기', unit: '100g' },
          { id: 'watermelon-1', name: '수박', unit: '1통' },
          { id: 'melon-1', name: '참외', unit: '1개' },
          { id: 'orange-imported-1', name: '오렌지(수입산)', unit: '1개' },
          { id: 'tangerine-jeju-10', name: '귤(제주산)', unit: '10개' },
          { id: 'persimmon-1', name: '단감', unit: '1개' },
          { id: 'grape-shine-1kg', name: '포도(샤인머스켓)', unit: '1kg' },
          { id: 'peach-white-1', name: '복숭아(백도)', unit: '1개' },
          { id: 'pear-shingo-1', name: '배(신고)', unit: '1개' },
          { id: 'apple-busa-1', name: '사과(부사)', unit: '1개' },
        ],
      },
    ],
  },
  {
    id: 'processed-foods',
    name: '가공식품 및 간편식',
    emoji: '🍞',
    totalItems: 4,
    subcategories: [
      {
        id: 'processed-all',
        name: '전체',
        items: [
          { id: 'bread-3pack', name: '빵', unit: '3개입' },
          { id: 'dumplings-300g', name: '만두', unit: '300g' },
          { id: 'cheese-180g', name: '치즈', unit: '180g' },
          { id: 'seasoned-seaweed-16pack', name: '맛김', unit: '16팩' },
        ],
      },
    ],
  },
  {
    id: 'seasonings',
    name: '조미료 및 소스류',
    emoji: '🧂',
    totalItems: 12,
    subcategories: [
      {
        id: 'basic-seasonings',
        name: '기본 조미료 (3개)',
        items: [
          { id: 'sugar-1kg', name: '설탕', unit: '1kg' },
          { id: 'coarse-salt-1kg', name: '굵은소금(천일염)', unit: '1kg' },
          { id: 'vinegar-1-8l', name: '식초', unit: '1.8L' },
        ],
      },
      {
        id: 'korean-seasonings',
        name: '한식 조미료 (5개)',
        items: [
          { id: 'soy-sauce-1bottle', name: '간장', unit: '1통' },
          { id: 'soybean-paste-1kg', name: '된장', unit: '1kg' },
          { id: 'gochujang-1kg', name: '고추장', unit: '1kg' },
          { id: 'red-pepper-powder-1kg', name: '고춧가루(국산)', unit: '1kg' },
          { id: 'dried-anchovy-100g', name: '마른멸치', unit: '100g' },
        ],
      },
      {
        id: 'oils-sauces',
        name: '오일 및 소스 (4개)',
        items: [
          { id: 'sesame-oil-320ml', name: '참기름', unit: '320ml' },
          { id: 'cooking-oil-1-8l', name: '식용유', unit: '1.8L' },
          { id: 'mayonnaise-500g', name: '마요네즈', unit: '500g' },
          { id: 'ketchup-500g', name: '케찹', unit: '500g' },
        ],
      },
    ],
  },
  {
    id: 'household-items',
    name: '생활용품',
    emoji: '🧴',
    totalItems: 6,
    subcategories: [
      {
        id: 'cleaning-products',
        name: '세정용품 (3개)',
        items: [
          { id: 'detergent-3l', name: '세제', unit: '3L' },
          { id: 'body-wash-900ml', name: '바디워시', unit: '900ml' },
          { id: 'shampoo-600ml', name: '샴푸', unit: '600ml' },
        ],
      },
      {
        id: 'personal-care',
        name: '개인위생용품 (3개)',
        items: [
          { id: 'toothbrush-5-2bundle', name: '칫솔', unit: '5개 2묶음' },
          { id: 'toothpaste-160g', name: '치약', unit: '160g 1개' },
          { id: 'soap-4pack', name: '비누', unit: '4개입' },
        ],
      },
    ],
  },
];
