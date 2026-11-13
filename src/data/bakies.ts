export interface BakieVariant {
  num: string;
  file: string;
  path: string;
  flavor: string;
}

export interface BakieSpecies {
  id: string;
  name: string;
  icon: string;
  pastelBg: string;
  pastelAccent: string;
  variants: BakieVariant[];
}

export interface FlatSticker {
  uid: string;
  speciesId: string;
  speciesName: string;
  speciesIcon: string;
  pastelBg: string;
  pastelAccent: string;
  variantNum: string;
  flavor: string;
  imagePath: string;
}

export const PACK_FRAMES: string[] = [
  '/assets/sobres/frame00.png',
  '/assets/sobres/frame01.png',
  '/assets/sobres/frame02.png',
  '/assets/sobres/frame03.png',
  '/assets/sobres/frame04.png',
  '/assets/sobres/frame05.png',
];

export const LOADING_MESSAGES: { text: string; icon: string }[] = [
  { text: 'Batiendo la crema pastelera fresca...', icon: '🍓' },
  { text: 'Horneando galletas de mantequilla dorada...', icon: '🍪' },
  { text: 'Preparando los sobres sellados Serie 1...', icon: '✨' },
  { text: 'Cortando frutas dulces y frambuesas...', icon: '🍒' },
  { text: 'Atemperando el chocolate más suave...', icon: '🍫' },
  { text: 'Poniendo las chispas de arcoíris...', icon: '🧁' },
  { text: 'Glaseando los pasteles de la vitrina...', icon: '🍰' },
  { text: 'Sintonizando a tus Bakies favoritos...', icon: '🌟' },
  { text: '¡Pastelería lista para abrir!', icon: '🎉' },
];

export const BAKIES_DATABASE: BakieSpecies[] = [
  {
    id: 'puppcake',
    name: 'Puppcake',
    icon: '🧁',
    pastelBg: 'bg-rose-50/90',
    pastelAccent: 'border-rose-200',
    variants: [
      {
        num: '#001',
        file: 'puppcake_001.png',
        path: '/assets/bakies/puppcake/puppcake_001.png',
        flavor: 'Fresa & Crema Batida Clásica',
      },
      {
        num: '#002',
        file: 'puppcake_002.png',
        path: '/assets/bakies/puppcake/puppcake_002.png',
        flavor: 'Vainilla & Chispas de Colores',
      },
    ],
  },
  {
    id: 'cinnashell',
    name: 'Cinnashell',
    icon: '🐌',
    pastelBg: 'bg-amber-50/90',
    pastelAccent: 'border-amber-200',
    variants: [
      {
        num: '#001',
        file: 'cinnashell_001.png',
        path: '/assets/bakies/cinnashell/cinnashell_001.png',
        flavor: 'Canela Clásica & Glaseado de Vainilla',
      },
      {
        num: '#002',
        file: 'cinnashell_002.png',
        path: '/assets/bakies/cinnashell/cinnashell_002.png',
        flavor: 'Toffee & Azúcar Moreno Horneado',
      },
    ],
  },
  {
    id: 'donubear',
    name: 'Donubear',
    icon: '🐻',
    pastelBg: 'bg-pink-50/90',
    pastelAccent: 'border-pink-200',
    variants: [
      {
        num: '#001',
        file: 'donubear_001.png',
        path: '/assets/bakies/donubear/donubear_001.png',
        flavor: 'Glaseado Rosa de Fresa & Chispas',
      },
      {
        num: '#002',
        file: 'donubear_002.png',
        path: '/assets/bakies/donubear/donubear_002.png',
        flavor: 'Chocolate Fudge & Lluvia de Azúcar',
      },
      {
        num: '#003',
        file: 'donubear_003.png',
        path: '/assets/bakies/donubear/donubear_003.png',
        flavor: 'Azúcar Glacial Ártico',
      },
      {
        num: '#004',
        file: 'donubear_004.png',
        path: '/assets/bakies/donubear/donubear_004.png',
        flavor: 'Cacao Nocturno & Confeti',
      },
    ],
  },
  {
    id: 'cataroon',
    name: 'Cataroon',
    icon: '🐱',
    pastelBg: 'bg-emerald-50/90',
    pastelAccent: 'border-emerald-200',
    variants: [
      {
        num: '#001',
        file: 'cataroon_001.png',
        path: '/assets/bakies/cataroon/cataroon_001.png',
        flavor: 'Frambuesa & Ganache de Vainilla',
      },
      {
        num: '#002',
        file: 'cataroon_002.png',
        path: '/assets/bakies/cataroon/cataroon_002.png',
        flavor: 'Pistacho Suave & Crema Blanca',
      },
    ],
  },
  {
    id: 'tartle',
    name: 'Tartle',
    icon: '🐢',
    pastelBg: 'bg-violet-50/90',
    pastelAccent: 'border-violet-200',
    variants: [
      {
        num: '#001',
        file: 'tartle_001.png',
        path: '/assets/bakies/tartle/tartle_001.png',
        flavor: 'Higos Negros & Crema Mascarpone',
      },
      {
        num: '#002',
        file: 'tartle_002.png',
        path: '/assets/bakies/tartle/tartle_002.png',
        flavor: 'Frutas del Bosque & Masa Quebrada',
      },
    ],
  },
  {
    id: 'croisfox',
    name: 'Croisfox',
    icon: '🦊',
    pastelBg: 'bg-orange-50/90',
    pastelAccent: 'border-orange-200',
    variants: [
      {
        num: '#001',
        file: 'croisfox_001.png',
        path: '/assets/bakies/croisfox/croisfox_001.png',
        flavor: 'Mantequilla Dorada & Almendras Tostadas',
      },
      {
        num: '#002',
        file: 'croisfox_002.png',
        path: '/assets/bakies/croisfox/croisfox_002.png',
        flavor: 'Hojaldre Nevado & Azúcar Glass',
      },
    ],
  },
  {
    id: 'candylamb',
    name: 'Candylamb',
    icon: '🐑',
    pastelBg: 'bg-teal-50/90',
    pastelAccent: 'border-teal-200',
    variants: [
      {
        num: '#001',
        file: 'candylamb_001.png',
        path: '/assets/bakies/candylamb/candylamb_001.png',
        flavor: 'Algodón de Azúcar Menta & Limón',
      },
      {
        num: '#002',
        file: 'candylamb_002.png',
        path: '/assets/bakies/candylamb/candylamb_002.png',
        flavor: 'Fantasía Arcoíris & Chispas Pastel',
      },
    ],
  },
  {
    id: 'truffico',
    name: 'Truffico',
    icon: '🦔',
    pastelBg: 'bg-stone-50/90',
    pastelAccent: 'border-stone-200',
    variants: [
      {
        num: '#001',
        file: 'truffico_001.png',
        path: '/assets/bakies/truffico/truffico_001.png',
        flavor: 'Trufa Blanca & Frambuesa Crujiente',
      },
      {
        num: '#002',
        file: 'truffico_002.png',
        path: '/assets/bakies/truffico/truffico_002.png',
        flavor: 'Chocolate Intenso & Virutas de Cacao',
      },
    ],
  },
  {
    id: 'popsipeng',
    name: 'Popsipeng',
    icon: '🐧',
    pastelBg: 'bg-sky-50/90',
    pastelAccent: 'border-sky-200',
    variants: [
      {
        num: '#001',
        file: 'popsipeng_001.png',
        path: '/assets/bakies/popsipeng/popsipeng_001.png',
        flavor: 'Sandía Tropical & Pepitas Dulces',
      },
      {
        num: '#002',
        file: 'popsipeng_002.png',
        path: '/assets/bakies/popsipeng/popsipeng_002.png',
        flavor: 'Creamsicle de Naranja & Nata Batida',
      },
    ],
  },
  {
    id: 'mochibun',
    name: 'Mochibun',
    icon: '🐇',
    pastelBg: 'bg-fuchsia-50/90',
    pastelAccent: 'border-fuchsia-200',
    variants: [
      {
        num: '#001',
        file: 'mochibun_001.png',
        path: '/assets/bakies/mochibun/mochibun_001.png',
        flavor: 'Mango Dorado & Polvo Dulce',
      },
      {
        num: '#002',
        file: 'mochibun_002.png',
        path: '/assets/bakies/mochibun/mochibun_002.png',
        flavor: 'Flor de Sakura & Melocotón Suave',
      },
    ],
  },
  {
    id: 'jellytopus',
    name: 'Jellytopus',
    icon: '🐙',
    pastelBg: 'bg-cyan-50/90',
    pastelAccent: 'border-cyan-200',
    variants: [
      {
        num: '#001',
        file: 'jellytopus_001.png',
        path: '/assets/bakies/jellytopus/jellytopus_001.png',
        flavor: 'Gelatina Glacial de Menta & Mora Azul',
      },
      {
        num: '#002',
        file: 'jellytopus_002.png',
        path: '/assets/bakies/jellytopus/jellytopus_002.png',
        flavor: 'Frambuesa Roja & Cristales de Azúcar',
      },
    ],
  },
  {
    id: 'merinchick',
    name: 'Merinchick',
    icon: '🐦',
    pastelBg: 'bg-yellow-50/90',
    pastelAccent: 'border-yellow-200',
    variants: [
      {
        num: '#001',
        file: 'merinchick_001.png',
        path: '/assets/bakies/merinchick/merinchick_001.png',
        flavor: 'Merengue de Fresa Tostado al Soplete',
      },
      {
        num: '#002',
        file: 'merinchick_002.png',
        path: '/assets/bakies/merinchick/merinchick_002.png',
        flavor: 'Limón Amarillo & Picos Flameados',
      },
    ],
  },
  {
    id: 'chocobat',
    name: 'Chocobat',
    icon: '🦇',
    pastelBg: 'bg-purple-50/90',
    pastelAccent: 'border-purple-200',
    variants: [
      {
        num: '#001',
        file: 'chocobat_001.png',
        path: '/assets/bakies/chocobat/chocobat_001.png',
        flavor: 'Galleta de Vainilla & Chispas de Confeti',
      },
      {
        num: '#002',
        file: 'chocobat_002.png',
        path: '/assets/bakies/chocobat/chocobat_002.png',
        flavor: 'Cacao Negro & Doble Crema',
      },
    ],
  },
];

export const ALL_STICKERS_FLAT: FlatSticker[] = BAKIES_DATABASE.flatMap((sp) =>
  sp.variants.map((v) => ({
    uid: `${sp.id}_${v.num.replace('#', '')}`,
    speciesId: sp.id,
    speciesName: sp.name,
    speciesIcon: sp.icon,
    pastelBg: sp.pastelBg,
    pastelAccent: sp.pastelAccent,
    variantNum: v.num,
    flavor: v.flavor,
    imagePath: v.path,
  }))
);

export const TOTAL_STICKERS = ALL_STICKERS_FLAT.length;

export const PRELOAD_ASSETS: string[] = Array.from(
  new Set([
    '/assets/logo/bakies_logo.png',
    ...PACK_FRAMES,
    ...ALL_STICKERS_FLAT.map((sticker) => sticker.imagePath),
  ])
);
