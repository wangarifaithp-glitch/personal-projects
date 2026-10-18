import { commonsWallpaperSources } from './commons-wallpapers'
import { curatedWallpaperSources } from './curated-wallpapers'
import { flowerWallpaperSources } from './flower-wallpapers'

export type Wallpaper = {
  id: string
  title: string
  category: string
  description: string
  image: string
  accent: string
  premium: boolean
  creator: string
  sourceTitle: string
  sourceUrl: string
  license: string
  licenseUrl: string
  orientation: 'Landscape' | 'Portrait' | 'Square'
}

export type CategoryBlueprint = {
  name: string
  emoji: string
  accent: string
  description: string
  premiumCount: number
  subcategories: string[]
}

export const galleryCategories = [
  { name: 'Aesthetic', emoji: '✦' },
  { name: 'Pink & Purple', emoji: '🌸' },
  { name: 'Black & Dark', emoji: '◐' },
  { name: 'Nature', emoji: '❋' },
  { name: 'Flowers', emoji: '✿' },
  { name: 'Minimalist', emoji: '◌' },
  { name: 'Anime', emoji: '☆' },
  { name: 'Cute & Kawaii', emoji: '♡' },
  { name: 'Luxury', emoji: '✧' },
  { name: 'Abstract', emoji: '◈' },
  { name: 'Space & Galaxy', emoji: '☾' },
  { name: 'Love & Romance', emoji: '♥' },
  { name: 'Cars', emoji: '⌁' },
  { name: 'Motivational', emoji: '✧' },
  { name: 'Animals', emoji: '❀' },
  { name: 'Football', emoji: '⚽' },
  { name: 'Cartoon', emoji: '🎨' },
]

const categoryColors = [
  ['#f8c4cf', '#d7c3f5', '#8a5574'], ['#f5a8cf', '#a88cdb', '#673e78'],
  ['#1e233b', '#704d78', '#db89bb'], ['#99c7a2', '#d4dfae', '#416866'],
  ['#f5b3c2', '#d98ba8', '#815178'], ['#e9e5df', '#c5b8ce', '#77717f'],
  ['#8fa7e8', '#e5a8ce', '#55528c'], ['#ffc7d8', '#e4b9ef', '#bc6999'],
  ['#d7b985', '#9e7392', '#5d435e'], ['#f1a7a4', '#a395df', '#514568'],
  ['#24274f', '#635eb3', '#d58fbf'], ['#f4a6bf', '#b27cbb', '#6b497f'],
  ['#96b6c5', '#4e677a', '#c78e8f'], ['#f2bf92', '#c17693', '#67517e'],
  ['#b4cfad', '#e4b3a8', '#546d67'], ['#94b9ed', '#d4b8f2', '#425b91'],
  ['#ffcc8e', '#f0a5ba', '#78547d'],
]

const categoryBlueprints: CategoryBlueprint[] = galleryCategories.map(({ name, emoji }, index) => ({
  name,
  emoji,
  accent: categoryColors[index][0],
  description: `${name} wallpapers`,
  premiumCount: 0,
  subcategories: [name],
}))

type WallpaperSource = Omit<Wallpaper, 'accent' | 'sourceUrl'>

const wallpaperSources: WallpaperSource[] = [
  {
    id: 'aesthetic-sylvester-sunrise',
    title: 'Stillwater at Sunrise',
    category: 'Aesthetic',
    description: 'Sunrise over Lake Sylvester in Kahurangi, New Zealand.',
    image: '/wallpapers/aesthetic-sunrise.jpg',
    premium: false,
    creator: 'Michal Klajban',
    sourceTitle: 'Lake Sylvester during the sunrise, Kahurangi, New Zealand.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    orientation: 'Landscape',
  },
  {
    id: 'pink-west-virginia-blossom',
    title: 'Spring in Bloom',
    category: 'Pink & Purple',
    description: 'A canopy of pink blossoms in West Virginia.',
    image: '/wallpapers/pink-tree-blossom.jpg',
    premium: false,
    creator: 'ForestWander',
    sourceTitle: 'Pink-tree-blossom-flower - West Virginia - ForestWander.jpg',
    license: 'CC BY-SA 3.0 US',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/us/',
    orientation: 'Landscape',
  },
  {
    id: 'dark-chateau-frontenac',
    title: 'Quebec After Dark',
    category: 'Black & Dark',
    description: 'Chateau Frontenac illuminated after sunset.',
    image: '/wallpapers/dark-city.jpg',
    premium: false,
    creator: 'Wilfredor',
    sourceTitle: 'Chateau Frontenac illuminated at night in Quebec City.jpg',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    orientation: 'Landscape',
  },
  {
    id: 'chola-valley-mountain-lake',
    title: 'Chola Valley',
    category: 'Nature',
    description: 'A mountain lake beneath the snowy Himalayas in Nepal.',
    image: '/wallpapers/mountain-lake.jpg',
    premium: false,
    creator: 'Vyacheslav Argenberg',
    sourceTitle: 'Mountains in snow, Mountain lake, Chola Valley, Nepal, Himalayas.jpg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    orientation: 'Landscape',
  },
  {
    id: 'flowers-under-snow',
    title: 'Winter Wildflowers',
    category: 'Flowers',
    description: 'Wildflowers peeking through a fresh winter snowfall.',
    image: '/wallpapers/flowers-in-snow.jpg',
    premium: false,
    creator: 'George Chernilevsky',
    sourceTitle: 'Flowers in snow 2022 G4.jpg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    orientation: 'Landscape',
  },
  {
    id: 'minimalist-painting',
    title: 'Quiet Form',
    category: 'Minimalist',
    description: 'A restrained study in shape and color.',
    image: '/wallpapers/minimal-painting.jpg',
    premium: false,
    creator: 'Jessica Quijano Guzman',
    sourceTitle: 'Pintura minimalista.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    orientation: 'Portrait',
  },
  {
    id: 'cyan-anime-portrait',
    title: 'Cyan Daydream',
    category: 'Anime',
    description: 'A cyan-haired anime portrait by Ao hoshi 03.',
    image: '/wallpapers/anime-girl.png',
    premium: false,
    creator: 'Ao hoshi 03',
    sourceTitle: 'Gray cyan hair anime girl.png',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    orientation: 'Portrait',
  },
  {
    id: 'cute-kitten',
    title: 'Little Daydreamer',
    category: 'Cute & Kawaii',
    description: 'A curious kitten photographed by Zaid.irshaid.',
    image: '/wallpapers/cute-kitten.jpg',
    premium: false,
    creator: 'Zaid.irshaid',
    sourceTitle: 'Cute kitten!.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    orientation: 'Square',
  },
  {
    id: 'price-building-at-night',
    title: 'The Price Building',
    category: 'Luxury',
    description: 'The illuminated Price Building in Quebec City.',
    image: '/wallpapers/night-building.jpg',
    premium: false,
    creator: 'Wilfredor',
    sourceTitle: 'Price Building illuminated at night in Quebec City.jpg',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    orientation: 'Landscape',
  },
  {
    id: 'colored-proposal',
    title: 'Colored Proposal',
    category: 'Abstract',
    description: 'An abstract watercolor study by Fons Heijnsbroek.',
    image: '/wallpapers/abstract-art.jpg',
    premium: false,
    creator: 'Fons Heijnsbroek',
    sourceTitle: "'Colored Proposal' - abstract watercolor painting a mixture of colors and textures - contemporary abstract art, created by Dutch artist Fons Heijnsbroek in 2008 - abstract gouache art on paper. Free image in high TIFF resol.tif",
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    orientation: 'Square',
  },
  {
    id: 'andromeda-galaxy',
    title: 'Andromeda Mosaic',
    category: 'Space & Galaxy',
    description: 'A Hubble mosaic of the Andromeda Galaxy.',
    image: '/wallpapers/andromeda.jpg',
    premium: false,
    creator: 'NASA, ESA, and the PHAT team; image processing by Joseph DePasquale (STScI)',
    sourceTitle: 'Andromeda Galaxy Hubble M31Mosaic 2025 42208x9870.jpg',
    license: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
    orientation: 'Landscape',
  },
  {
    id: 'hepatica-blossoms',
    title: 'Hepatica in Bloom',
    category: 'Love & Romance',
    description: 'Pink and blue hepatica flowers photographed in Keila.',
    image: '/wallpapers/hepaticas.jpg',
    premium: false,
    creator: 'Ivar Leidus',
    sourceTitle: 'Hepatica nobilis flowers - blue and pink - Keila.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    orientation: 'Landscape',
  },
  {
    id: 'vintage-car-birkirkara',
    title: 'Vintage in Birkirkara',
    category: 'Cars',
    description: 'A classic car photographed in Birkirkara, Malta.',
    image: '/wallpapers/vintage-car.jpg',
    premium: false,
    creator: 'Continentaleurope',
    sourceTitle: 'Vintage car in Birkirkara 01.jpg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    orientation: 'Landscape',
  },
  {
    id: 'bryce-canyon-sunrise',
    title: 'First Light at Bryce Canyon',
    category: 'Motivational',
    description: 'Morning light breaking over Bryce Canyon.',
    image: '/wallpapers/bryce-canyon-sunrise.jpg',
    premium: false,
    creator: 'King of Hearts',
    sourceTitle: 'Sunrise Point Bryce Canyon November 2018 002.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    orientation: 'Landscape',
  },
  {
    id: 'brimstone-butterfly',
    title: 'Golden Brimstone',
    category: 'Animals',
    description: 'A brimstone butterfly photographed by Charles J. Sharp.',
    image: '/wallpapers/butterfly.jpg',
    premium: false,
    creator: 'Charles J. Sharp',
    sourceTitle: 'Common brimstone butterfly (Gonepteryx rhamni) male.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    orientation: 'Landscape',
  },
]

const commonsFileUrl = (title: string): string =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title.replaceAll(' ', '_'))}`

const legacyWallpaperSources = [
  ...wallpaperSources,
  ...commonsWallpaperSources,
].filter((wallpaper) =>
  wallpaper.category !== 'Love & Romance' &&
  wallpaper.category !== 'Animals',
)

export const wallpapers: Wallpaper[] = [
  ...legacyWallpaperSources,
  ...curatedWallpaperSources,
  ...flowerWallpaperSources,
]
  .filter((wallpaper) =>
    !(wallpaper.category === 'Flowers' && /apple blossom|blossom and peacock|blossom and the temperate|blossom in (castle|gordon|kew|st nicholas|a garden)|blossom in the children's garden/i.test(wallpaper.sourceTitle)),
  )
  .map((wallpaper) => {
    const category = categoryBlueprints.find((item) => item.name === wallpaper.category)
    if (!category) {
      throw new Error(`Wallpaper category "${wallpaper.category}" is not configured`)
    }

    return {
      ...wallpaper,
      accent: category.accent,
      sourceUrl: commonsFileUrl(wallpaper.sourceTitle),
    }
  })

export const categories = categoryBlueprints.map((category) => ({
  ...category,
  count: wallpapers.filter((wallpaper) => wallpaper.category === category.name).length,
}))
