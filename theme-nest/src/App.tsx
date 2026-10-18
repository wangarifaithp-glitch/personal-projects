import { useEffect, useId, useMemo, useState } from 'react'
import { categories, galleryCategories, wallpapers, type Wallpaper } from './data/catalog'
import './App.css'

type View =
  | 'home'
  | 'explore'
  | 'search'
  | 'category'
  | 'detail'
  | 'create'
  | 'favorites'
  | 'downloads'
  | 'profile'
  | 'settings'
  | 'membership'
  | 'admin'
  | 'control'
  | 'widgets'
  | 'icons'
  | 'wallpapers'

type ThemeMode = 'light' | 'dark'
type ScreenTarget = 'home' | 'lock'

type DownloadRecord = {
  id: string
  title: string
  category: string
  preview: string
  savedAt: string
  savedLabel?: string
  blob?: Blob
  localUrl?: string
}

const appName = 'Theme Nest'

const appIcons = [
  { name: 'WhatsApp', id: 'whatsapp' },
  { name: 'TikTok', id: 'tiktok' },
  { name: 'Instagram', id: 'instagram' },
  { name: 'Gmail', id: 'gmail' },
  { name: 'Chrome', id: 'chrome' },
  { name: 'Google Maps', id: 'maps' },
  { name: 'YouTube', id: 'youtube' },
  { name: 'Google Photos', id: 'photos' },
  { name: 'Google Drive', id: 'drive' },
  { name: 'Spotify', id: 'spotify' },
  { name: 'Telegram', id: 'telegram' },
  { name: 'Files', id: 'files' },
] as const

const dockApps = ['whatsapp', 'instagram', 'chrome', 'spotify'] as const

function AppIcon({ id, name }: { id: string; name: string }) {
  const iconId = useId().replaceAll(':', '')

  return (
    <span className={`brand-app-icon brand-app-icon--${id}`} role="img" aria-label={name}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        {id === 'whatsapp' && (
          <>
            <circle cx="24" cy="24" r="21" fill="#25D366" />
            <path d="m13 35 2-7a13 13 0 1 1 5 5l-7 2Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2.6" />
            <path d="M19 17c-.6 0-1.2.3-1.5 1-.5.9-.7 2-.2 3.3 1.3 3.6 4.2 6.4 7.8 7.7 1.3.5 2.3.3 3.2-.3.6-.4 1-1.1.9-1.7l-3.2-1.6-1.3 1.4c-1.7-.7-3.1-2-3.9-3.7l1.3-1.4-1.5-3.1Z" fill="#fff" />
          </>
        )}
        {id === 'tiktok' && (
          <>
            <rect width="48" height="48" rx="12" fill="#111" />
            <path d="M29 8h6c.4 4.4 2.7 7 7 7v6c-2.8 0-5.2-.9-7-2.4v12.2A10.7 10.7 0 1 1 24.3 20c.8 0 1.5.1 2.2.3v6.2a4.6 4.6 0 1 0 2.5 4.1V8Z" fill="#25F4EE" transform="translate(-2 1)" />
            <path d="M27 8h6c.4 4.4 2.7 7 7 7v6c-2.8 0-5.2-.9-7-2.4v12.2A10.7 10.7 0 1 1 22.3 20c.8 0 1.5.1 2.2.3v6.2a4.6 4.6 0 1 0 2.5 4.1V8Z" fill="#FE2C55" transform="translate(1 1)" />
            <path d="M28 8h6c.4 4.4 2.7 7 7 7v6c-2.8 0-5.2-.9-7-2.4v12.2A10.7 10.7 0 1 1 23.3 20c.8 0 1.5.1 2.2.3v6.2a4.6 4.6 0 1 0 2.5 4.1V8Z" fill="#fff" />
          </>
        )}
        {id === 'instagram' && (
          <>
            <defs>
              <linearGradient id={`${iconId}-instagram-gradient`} x1="5" y1="44" x2="43" y2="4" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFDC80" /><stop offset=".35" stopColor="#F77737" /><stop offset=".65" stopColor="#E1306C" /><stop offset="1" stopColor="#833AB4" />
              </linearGradient>
            </defs>
            <rect width="48" height="48" rx="14" fill={`url(#${iconId}-instagram-gradient)`} />
            <rect x="9" y="9" width="30" height="30" rx="9" fill="none" stroke="#fff" strokeWidth="3" />
            <circle cx="24" cy="24" r="7" fill="none" stroke="#fff" strokeWidth="3" />
            <circle cx="33.5" cy="14.8" r="2" fill="#fff" />
          </>
        )}
        {id === 'gmail' && (
          <>
            <rect x="4" y="9" width="40" height="30" rx="6" fill="#fff" />
            <path d="M7 14v20" stroke="#4285F4" strokeWidth="5" />
            <path d="m7 13 17 13 17-13" fill="none" stroke="#EA4335" strokeLinejoin="round" strokeWidth="5" />
            <path d="M41 14v20" stroke="#34A853" strokeWidth="5" />
            <path d="M41 14v20" stroke="#FBBC04" strokeDasharray="10 20" strokeWidth="5" />
          </>
        )}
        {id === 'chrome' && (
          <>
            <circle cx="24" cy="24" r="22" fill="#EA4335" />
            <path d="M24 24 13 43A22 22 0 0 1 4.9 13h21.9Z" fill="#34A853" />
            <path d="M24 24h22a22 22 0 0 1-33 19l11-19Z" fill="#FBBC04" />
            <circle cx="24" cy="24" r="10" fill="#fff" />
            <circle cx="24" cy="24" r="8" fill="#4285F4" />
          </>
        )}
        {id === 'maps' && (
          <>
            <path d="M24 45S8 28.6 8 19a16 16 0 1 1 32 0c0 9.6-16 26-16 26Z" fill="#34A853" />
            <path d="M8 19a16 16 0 0 1 27-11L22 25 11 30a20 20 0 0 1-3-11Z" fill="#4285F4" />
            <path d="M35 8a16 16 0 0 1 5 11c0 2-.7 4.4-1.8 6.8L24 20l-2-8Z" fill="#FBBC04" />
            <circle cx="24" cy="19" r="6" fill="#EA4335" />
            <circle cx="24" cy="19" r="2.5" fill="#fff" />
          </>
        )}
        {id === 'youtube' && (
          <>
            <rect x="3" y="9" width="42" height="30" rx="9" fill="#FF0033" />
            <path d="M20 16.5 32 24l-12 7.5v-15Z" fill="#fff" />
          </>
        )}
        {id === 'photos' && (
          <>
            <path d="M24 23C16 22 13 17 13 12c0-4 3-7 7-7 5 0 7 6 6 17h-2Z" fill="#EA4335" />
            <path d="M25 24c1-8 6-11 11-11 4 0 7 3 7 7 0 5-6 7-17 6v-2Z" fill="#4285F4" />
            <path d="M24 25c8 1 11 6 11 11 0 4-3 7-7 7-5 0-7-6-6-17h2Z" fill="#34A853" />
            <path d="M23 24c-1 8-6 11-11 11-4 0-7-3-7-7 0-5 6-7 17-6v2Z" fill="#FBBC04" />
            <circle cx="24" cy="24" r="4" fill="#fff" />
          </>
        )}
        {id === 'drive' && (
          <>
            <path d="M17 6h12l17 29H34L17 6Z" fill="#FFBA00" />
            <path d="M17 6h12L12 35H0L17 6Z" fill="#00875A" transform="translate(4)" />
            <path d="M10 31h32l-6 11H4l6-11Z" fill="#2684FC" />
          </>
        )}
        {id === 'spotify' && (
          <>
            <circle cx="24" cy="24" r="22" fill="#1DB954" />
            <path d="M11 18c8-2.5 18-1.5 26 3" fill="none" stroke="#111" strokeLinecap="round" strokeWidth="3" />
            <path d="M13 24c7-2 15-1 22 2.8" fill="none" stroke="#111" strokeLinecap="round" strokeWidth="2.6" />
            <path d="M15 30c6-1.5 12-.5 18 2.5" fill="none" stroke="#111" strokeLinecap="round" strokeWidth="2.3" />
          </>
        )}
        {id === 'telegram' && (
          <>
            <circle cx="24" cy="24" r="22" fill="#27A7E7" />
            <path d="m10 23 27-10-7 26-8-7-5 4 1-8 15-11-19 9-4-3Z" fill="#fff" />
          </>
        )}
        {id === 'files' && (
          <>
            <defs>
              <linearGradient id={`${iconId}-files-gradient`} x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse">
                <stop stopColor="#55C5FF" /><stop offset="1" stopColor="#0878F9" />
              </linearGradient>
            </defs>
            <rect width="44" height="44" x="2" y="2" rx="11" fill={`url(#${iconId}-files-gradient)`} />
            <path d="M8 15a4 4 0 0 1 4-4h9l4 4h11a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V15Z" fill="#fff" />
            <path d="M8 20a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V20Z" fill="#D9F0FF" />
          </>
        )}
      </svg>
    </span>
  )
}

function AppIconGrid({ className, apps }: { className: string; apps: readonly string[] }) {
  return (
    <div className={className}>
      {apps.map((id) => {
        const app = appIcons.find((item) => item.id === id)
        return app ? <AppIcon key={app.id} id={app.id} name={app.name} /> : null
      })}
    </div>
  )
}

const primaryNavigation: Array<{ id: View; label: string; emoji: string }> = [
  { id: 'home', label: 'Home', emoji: '⌂' },
  { id: 'explore', label: 'Explore', emoji: '◌' },
  { id: 'search', label: 'Search', emoji: '⌕' },
  { id: 'create', label: 'Create', emoji: '✦' },
  { id: 'favorites', label: 'Favorites', emoji: '♥' },
  { id: 'downloads', label: 'Downloads', emoji: '▤' },
]

const prompts = [
  'Cinematic desert horizon at golden hour',
  'Minimalist dark mode city skyline',
  'Luxury botanical pattern with soft gold trim',
  'Futuristic neon forest with glowing moss',
]

const footerLinks = ['About', 'Contact', 'Help', 'Privacy Policy', 'Terms']

const formatSavedDate = (value: string): string => new Date(value).toLocaleDateString()

const createDownloadRecord = (wallpaper: Wallpaper, blob: Blob): DownloadRecord => {
  const savedAt = new Date().toISOString()

  return {
    id: wallpaper.id,
    title: wallpaper.title,
    category: wallpaper.category,
    preview: wallpaper.image,
    savedAt,
    savedLabel: formatSavedDate(savedAt),
    blob,
  }
}

const openDownloadDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = window.indexedDB.open('themeapp-downloads-db', 1)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('downloads')) {
        db.createObjectStore('downloads', { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const loadDownloads = async (): Promise<DownloadRecord[]> => {
  const db = await openDownloadDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('downloads', 'readonly')
    const store = transaction.objectStore('downloads')
    const request = store.getAll()

    request.onsuccess = () => {
      const records = request.result as DownloadRecord[]
      resolve(
        records.map((record) => ({
          ...record,
          savedLabel: record.savedLabel ?? formatSavedDate(record.savedAt),
          localUrl: record.blob ? URL.createObjectURL(record.blob) : record.preview,
        })),
      )
    }

    request.onerror = () => reject(request.error)
  })
}

const saveDownload = async (record: DownloadRecord): Promise<void> => {
  const db = await openDownloadDatabase()

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('downloads', 'readwrite')
    const store = transaction.objectStore('downloads')
    const request = store.put(record)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

const deleteDownload = async (id: string): Promise<void> => {
  const db = await openDownloadDatabase()

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('downloads', 'readwrite')
    const store = transaction.objectStore('downloads')
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

function ThemeCard({
  wallpaper,
  onOpen,
  onPreviewHomeScreen,
  onDownload,
  onToggleFavorite,
  isFavorite,
}: {
  wallpaper: Wallpaper
  onOpen: () => void
  onPreviewHomeScreen: () => void
  onDownload: () => void
  onToggleFavorite: () => void
  isFavorite: boolean
}) {
  return (
    <article className="theme-card wallpaper-tile">
      <div className="theme-card-artwork">
        <button type="button" className="theme-card-open" onClick={onOpen} aria-label={`Preview ${wallpaper.title}`}>
          <div className="screen-preview theme-card-screen" aria-hidden="true">
            <img
              className="screen-wallpaper"
              src={wallpaper.image}
              alt=""
              loading="lazy"
              onError={(event) => { event.currentTarget.style.opacity = '0' }}
            />
            <span className="preview-status"><span>9:41</span><span>● ● ▰</span></span>
            <span className="preview-date">MON, OCT 13<strong>9:41</strong></span>
            <span className="preview-widget"><span className="widget-sun">☀</span><strong>18°</strong><small>Clear skies</small></span>
            <AppIconGrid className="preview-icons" apps={appIcons.map((app) => app.id)} />
            <AppIconGrid className="preview-dock" apps={dockApps} />
          </div>
        </button>
        <button type="button" className={`icon-button favorite-button ${isFavorite ? 'active' : ''}`} onClick={onToggleFavorite} aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          {isFavorite ? '♥' : '♡'}
        </button>
        <button type="button" className="theme-preview-button" onClick={onPreviewHomeScreen}>Home screen preview</button>
      </div>
      <div className="theme-card-caption">
        <div>
          <strong>{wallpaper.title}</strong>
          <span>{wallpaper.category} · {wallpaper.orientation}</span>
        </div>
        <button type="button" className="theme-download-button" onClick={onDownload} aria-label={`Download ${wallpaper.title}`}>
          ↓
        </button>
      </div>
    </article>
  )
}

function App() {
  const [view, setView] = useState<View>('home')
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(wallpapers[0]?.id ?? null)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = window.localStorage.getItem('themeapp-favorites')
    return stored ? (JSON.parse(stored) as string[]) : []
  })
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [online, setOnline] = useState<boolean>(navigator.onLine)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    window.localStorage.getItem('themeapp-mode') === 'dark' ? 'dark' : 'light',
  )
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const stored = window.localStorage.getItem('themeapp-recent')
    return stored ? (JSON.parse(stored) as string[]) : []
  })
  const [sortOrder, setSortOrder] = useState<'Trending' | 'Newest' | 'Popular'>('Trending')
  const [visibleCount, setVisibleCount] = useState(30)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [screenWallpapers, setScreenWallpapers] = useState<Partial<Record<ScreenTarget, string>>>(() => {
    try {
      const saved = window.localStorage.getItem('themeapp-screen-wallpapers')
      return saved ? JSON.parse(saved) as Partial<Record<ScreenTarget, string>> : {}
    } catch {
      return {}
    }
  })
  const [screenPreviewTarget, setScreenPreviewTarget] = useState<ScreenTarget | null>(null)
  const [aiPrompt, setAiPrompt] = useState('Minimalist sunset in a glassy city with violet accents')
  const [aiStyle, setAiStyle] = useState('Minimalist')
  const [aiMode, setAiMode] = useState<'Landscape' | 'Portrait'>('Landscape')
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [coinBalance] = useState(115)
  const [notice, setNotice] = useState('')
  const [enabledControls, setEnabledControls] = useState<string[]>(['Lock screen widgets'])
  const [addedWidget, setAddedWidget] = useState('')
  const [selectedIconSet, setSelectedIconSet] = useState('Petal')
  const [galleryLoading, setGalleryLoading] = useState(true)

  useEffect(() => {
    window.localStorage.setItem('themeapp-favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    window.localStorage.setItem('themeapp-mode', themeMode)
  }, [themeMode])

  useEffect(() => {
    window.localStorage.setItem('themeapp-recent', JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  useEffect(() => {
    window.localStorage.setItem('themeapp-screen-wallpapers', JSON.stringify(screenWallpapers))
  }, [screenWallpapers])

  useEffect(() => {
    loadDownloads().then(setDownloads).catch(() => setDownloads([]))
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setGalleryLoading(false), 180)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleOnline = () => setOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOnline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOnline)
    }
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.warn('Service worker registration failed', error)
      })
    }
  }, [])

  const currentCategory =
    categories.find((category) => category.name === selectedCategory) ?? categories[0]

  const filteredWallpapers = useMemo(() => {
    const matches = wallpapers.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || selectedCategory === item.category
      const searchText = query.trim().toLowerCase()
      const matchesQuery =
        searchText.length === 0 ||
        item.title.toLowerCase().includes(searchText) ||
        item.category.toLowerCase().includes(searchText)

      return matchesCategory && matchesQuery
    })
    if (sortOrder === 'Newest') return matches.reverse()
    if (sortOrder === 'Popular') {
      return matches.sort((left, right) => Number(favorites.includes(right.id)) - Number(favorites.includes(left.id)))
    }
    return matches
  }, [favorites, query, selectedCategory, sortOrder])

  const favoriteItems = wallpapers.filter((item) => favorites.includes(item.id))
  const selectedTheme = wallpapers.find((item) => item.id === selectedThemeId) ?? wallpapers[0]
  const categoryResults =
    selectedCategory === 'All'
      ? wallpapers
      : wallpapers.filter((item) => item.category === selectedCategory)
  const recentItems = recentlyViewed
    .map((id) => wallpapers.find((item) => item.id === id))
    .filter((item): item is Wallpaper => Boolean(item))

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const changeCategory = (categoryName: string) => {
    setSelectedCategory(categoryName)
    setVisibleCount(30)
  }

  const changeQuery = (search: string) => {
    setQuery(search)
    setVisibleCount(30)
  }

  const changeSortOrder = (order: typeof sortOrder) => {
    setSortOrder(order)
    setVisibleCount(30)
  }

  const handleDownload = async (wallpaper: Wallpaper) => {
    if (!online) {
      setNotice('You are offline. Connect to save this wallpaper to your library.')
      return
    }

    try {
      const response = await fetch(wallpaper.image)
      if (!response.ok) {
        throw new Error(`Image request failed with status ${response.status}`)
      }
      const blob = await response.blob()
      const record = createDownloadRecord(wallpaper, blob)

      await saveDownload(record)
      const nextRecords = await loadDownloads()
      setDownloads(nextRecords)
      const downloadUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      const extensions: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/avif': 'avif',
      }
      const extension = extensions[blob.type] ?? 'jpg'
      anchor.download = `${wallpaper.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-wallpaper.${extension}`
      document.body.append(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)
      setNotice('Wallpaper saved. Applying app icons and widgets requires native device access.')
    } catch (error) {
      console.error('Download failed', error)
      setNotice('This wallpaper could not be downloaded right now. Please try again.')
    }
  }

  const handleDeleteDownload = async (id: string) => {
    await deleteDownload(id)
    setDownloads((current) => current.filter((item) => item.id !== id))
  }

  const handleSetScreenWallpaper = (wallpaper: Wallpaper, target: ScreenTarget) => {
    setScreenWallpapers((current) => ({ ...current, [target]: wallpaper.id }))
    setScreenPreviewTarget(target)
  }

  const getScreenWallpaper = (target: ScreenTarget) =>
    wallpapers.find((wallpaper) => wallpaper.id === screenWallpapers[target])

  const handleGeneratePreview = () => {
    if (!online) {
      setGeneratedPreview(null)
      return
    }

    const base = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
    const seed = `${aiStyle.toLowerCase()}-${aiMode.toLowerCase()}`
    setGeneratedPreview(
      `${base}?auto=format&fit=crop&w=1200&q=80&sig=${seed.length + aiPrompt.length}`,
    )
  }

  const goToCategory = (categoryName: string) => {
    changeCategory(categoryName)
    setView('category')
  }

  const goToDetail = (item: Wallpaper) => {
    setSelectedThemeId(item.id)
    setRecentlyViewed((current) => [item.id, ...current.filter((id) => id !== item.id)].slice(0, 12))
    setView('detail')
  }

  const renderWallpaperCard = (item: Wallpaper) => {
    return (
      <ThemeCard
        key={item.id}
        wallpaper={item}
        onOpen={() => goToDetail(item)}
        onPreviewHomeScreen={() => handleSetScreenWallpaper(item, 'home')}
        onDownload={() => handleDownload(item)}
        onToggleFavorite={() => toggleFavorite(item.id)}
        isFavorite={favorites.includes(item.id)}
      />
    )
  }

  const renderHomePage = () => {
    const featured = wallpapers[featuredIndex % wallpapers.length]
    const trendingItems = wallpapers.slice(0, 8)
    const newestItems = categories.flatMap((category) =>
      wallpapers.filter((item) => item.category === category.name).slice(-1),
    ).reverse()
    const galleryItems = filteredWallpapers.slice(0, visibleCount)

    return (
      <section className="theme-page" aria-label="Theme gallery">
        {!query.trim() && selectedCategory === 'All' && (
          <>
            <section className="featured-wallpaper" style={{ backgroundImage: `linear-gradient(90deg, rgba(28, 18, 41, .76), rgba(28, 18, 41, .08)), url("${featured.image}")` }}>
              <div className="featured-copy">
                <span className="eyebrow">THEME NEST EDIT</span>
                <h1>A softer kind<br />of screen time.</h1>
                <strong>{featured.title}</strong>
                <button type="button" className="featured-action" onClick={() => goToDetail(featured)}>View wallpaper</button>
              </div>
              <div className="featured-controls">
                <button type="button" aria-label="Previous featured wallpaper" onClick={() => setFeaturedIndex((index) => (index - 1 + wallpapers.length) % wallpapers.length)}>Previous</button>
                <button type="button" aria-label="Next featured wallpaper" onClick={() => setFeaturedIndex((index) => (index + 1) % wallpapers.length)}>Next</button>
              </div>
            </section>

            <section className="home-section category-discovery">
              <div className="section-heading"><div><span>FIND YOUR FEEL</span><h2>Popular categories</h2></div><button type="button" onClick={() => setView('explore')}>See all</button></div>
              <div className="popular-category-grid">
                {categories.map((category) => (
                  <button type="button" className="popular-category" key={category.name} onClick={() => { changeCategory(category.name); setView('home') }} style={{ '--category-color': category.accent } as React.CSSProperties}>
                    <span>{category.emoji}</span><strong>{category.name}</strong><small>{category.count} wallpapers</small>
                  </button>
                ))}
              </div>
            </section>

            <section className="home-section">
              <div className="section-heading"><div><span>LOVED BY THE NEST</span><h2>Trending now</h2></div><button type="button" onClick={() => { changeSortOrder('Trending'); changeCategory('All') }}>Browse all</button></div>
              <div className="wallpaper-grid theme-grid shelf-grid">{trendingItems.map(renderWallpaperCard)}</div>
            </section>

            <section className="home-section">
              <div className="section-heading"><div><span>FRESH FROM THE STUDIO</span><h2>New arrivals</h2></div><button type="button" onClick={() => { changeSortOrder('Newest'); changeCategory('All') }}>Browse all</button></div>
              <div className="wallpaper-grid theme-grid shelf-grid">{newestItems.map(renderWallpaperCard)}</div>
            </section>

            {recentItems.length > 0 && (
              <section className="home-section">
                <div className="section-heading"><div><span>PICK UP WHERE YOU LEFT OFF</span><h2>Recently viewed</h2></div></div>
                <div className="wallpaper-grid theme-grid shelf-grid">{recentItems.slice(0, 4).map(renderWallpaperCard)}</div>
              </section>
            )}
          </>
        )}

        <section className="home-section all-wallpapers">
          <div className="section-heading gallery-heading">
            <div><span>{selectedCategory === 'All' ? 'THE WHOLE COLLECTION' : 'BROWSE CATEGORY'}</span><h2>{query.trim() ? 'Search results' : selectedCategory === 'All' ? 'Explore wallpapers' : selectedCategory}</h2></div>
            <label className="sort-select-label"><span>Sort</span><select value={sortOrder} onChange={(event) => changeSortOrder(event.target.value as typeof sortOrder)}><option>Trending</option><option>Newest</option><option>Popular</option></select></label>
          </div>
          {query.trim() && <div className="gallery-result-count">{filteredWallpapers.length} wallpapers found</div>}
          {galleryLoading ? (
            <div className="theme-skeleton-grid" aria-label="Loading wallpapers">{Array.from({ length: 8 }, (_, index) => <div className="theme-skeleton" key={index} />)}</div>
          ) : galleryItems.length ? (
            <>
              <div className="wallpaper-grid theme-grid">{galleryItems.map(renderWallpaperCard)}</div>
              {galleryItems.length < filteredWallpapers.length && <button type="button" className="load-more-button" onClick={() => setVisibleCount((count) => count + 30)}>Load more wallpapers</button>}
            </>
          ) : (
            <div className="gallery-empty"><span>♡</span><strong>No wallpapers found</strong><p>Try another name or choose a different category.</p><button type="button" className="soft-button" onClick={() => { changeQuery(''); changeCategory('All') }}>Clear filters</button></div>
          )}
        </section>
      </section>
    )
  }

  const renderTabPage = () => {
    if (view === 'control') {
      const controls = ['Lock screen widgets', 'Soft notification glow', 'Always-on clock']
      return (
        <section className="tool-page">
          <h2>Control</h2>
          <p>Fine-tune the little details on your screen.</p>
          <div className="tool-list">
            {controls.map((control) => (
              <label className="tool-row" key={control}>
                <span>{control}</span>
                <input
                  type="checkbox"
                  checked={enabledControls.includes(control)}
                  onChange={() => setEnabledControls((current) => current.includes(control)
                    ? current.filter((item) => item !== control)
                    : [...current, control])}
                />
              </label>
            ))}
          </div>
        </section>
      )
    }

    if (view === 'widgets') {
      return (
        <section className="tool-page">
          <h2>Widgets</h2>
          <p>Small moments for your home screen.</p>
          <div className="widget-options">
            {['Daily weather', 'Photo memories', 'Soft calendar'].map((widget) => (
              <article className="widget-option" key={widget}>
                <span>{widget === 'Daily weather' ? '☀' : widget === 'Photo memories' ? '▧' : '▦'}</span>
                <strong>{widget}</strong>
                <button type="button" className="soft-button" onClick={() => setAddedWidget(widget === addedWidget ? '' : widget)}>
                  {addedWidget === widget ? 'Added' : 'Add widget'}
                </button>
              </article>
            ))}
          </div>
        </section>
      )
    }

    if (view === 'icons') {
      return (
        <section className="tool-page">
          <h2>App icons</h2>
          <p>Choose a matching icon set for your theme.</p>
          <div className="icon-set-options">
            {['Petal', 'Cloud', 'Berry'].map((setName, index) => (
              <button
                type="button"
                className={`icon-set-option ${selectedIconSet === setName ? 'selected' : ''}`}
                key={setName}
                onClick={() => setSelectedIconSet(setName)}
              >
                <span>{['🌷', '☁️', '🍓'][index]}</span>
                <strong>{setName}</strong>
              </button>
            ))}
          </div>
          <p className="native-note">Icon installation needs native device access. Your selection is previewed here.</p>
        </section>
      )
    }

    return null
  }

  const renderExplorePage = () => (
    <section className="page">
      <div className="section-header">
        <h2>Explore all categories</h2>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            className="category-card"
            onClick={() => goToCategory(category.name)}
            style={{ background: `linear-gradient(135deg, ${category.accent}38, rgba(15,23,42,0.88))` }}
          >
            <span className="category-glow" style={{ background: category.accent }} />
            <strong>{category.name}</strong>
            <small>Browse collection</small>
          </button>
        ))}
      </div>
    </section>
  )

  const renderSearchPage = () => (
    <section className="page">
      <div className="section-header">
        <h2>Search results</h2>
      </div>
      <div className="filter-row">
        <select value={selectedCategory} onChange={(event) => changeCategory(event.target.value)}>
          <option value="All">All categories</option>
          {categories.map((category) => (
            <option value={category.name} key={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select defaultValue="Trending">
          <option value="Trending">Trending</option>
          <option value="Newest">Newest</option>
          <option value="Popular">Popular</option>
        </select>
      </div>
      <div className="results-summary">
        {filteredWallpapers.length} results for “{query || 'all themes'}”
      </div>
      <div className="wallpaper-grid">
        {filteredWallpapers.length ? (
          filteredWallpapers.map((item) => renderWallpaperCard(item))
        ) : (
          <div className="empty-panel">No results matched your filters.</div>
        )}
      </div>
    </section>
  )

  const renderCategoryPage = () => (
    <section className="page">
      <div className="breadcrumbs">
        <button type="button" className="breadcrumb-link" onClick={() => setView('home')}>
          Home
        </button>
        <span>/</span>
        <button type="button" className="breadcrumb-link" onClick={() => setView('explore')}>
          Explore
        </button>
        <span>/</span>
        <strong>{currentCategory.name}</strong>
      </div>

      <div className="category-hero" style={{ background: `linear-gradient(135deg, ${currentCategory.accent}38, rgba(255,255,255,0.15))` }}>
        <div>
          <span className="eyebrow">Wallpaper collection</span>
          <h1>{currentCategory.name}</h1>
          <p>{currentCategory.description}</p>
        </div>
      </div>

      <div className="subcategory-row">
        {currentCategory.subcategories.map((subcat) => (
          <button key={subcat} type="button" className="subcategory-chip" onClick={() => changeQuery(subcat)}>
            {subcat}
          </button>
        ))}
      </div>

      <div className="filter-row">
        <select value={selectedCategory} onChange={(event) => changeCategory(event.target.value)}>
          <option value="All">All categories</option>
          {categories.map((category) => (
            <option value={category.name} key={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select defaultValue="Popular">
          <option value="Popular">Popular</option>
          <option value="Newest">Newest</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      <div className="wallpaper-grid">
        {categoryResults.map((item) => renderWallpaperCard(item))}
      </div>
    </section>
  )

  const renderDetailPage = () => (
    <section className="page detail-page">
      <div className="breadcrumbs">
        <button type="button" className="breadcrumb-link" onClick={() => setView('home')}>
          Home
        </button>
        <span>/</span>
        <button type="button" className="breadcrumb-link" onClick={() => setView('category')}>
          {selectedTheme.category}
        </button>
        <span>/</span>
        <strong>{selectedTheme.title}</strong>
      </div>

      <div className="detail-layout">
        <img className="detail-image" src={selectedTheme.image} alt={`${selectedTheme.title} wallpaper preview`} />

        <div className="detail-panel">
          <div className="detail-labels">
            <span className="badge muted">{selectedTheme.orientation}</span>
            <span className="badge muted">Free download</span>
          </div>
          <h1>{selectedTheme.title}</h1>
          <div className="detail-meta">
            <span>“{selectedTheme.sourceTitle}” by {selectedTheme.creator}</span>
            <span>Licensed under <a href={selectedTheme.licenseUrl} target="_blank" rel="noreferrer">{selectedTheme.license}</a>.</span>
            <a href={selectedTheme.sourceUrl} target="_blank" rel="noreferrer">
              {selectedTheme.creator === 'Theme Nest Studio' ? 'About this original artwork' : 'View original on Wikimedia Commons'}
            </a>
          </div>
          <div className="detail-actions">
            <button type="button" className="secondary-button" onClick={() => setLightboxOpen(true)}>Full-screen preview</button>
            <button type="button" className="secondary-button" onClick={() => handleSetScreenWallpaper(selectedTheme, 'home')}>Set as Home Screen</button>
            <button type="button" className="secondary-button" onClick={() => handleSetScreenWallpaper(selectedTheme, 'lock')}>Set as Lock Screen</button>
            <button type="button" className="primary-button" onClick={() => handleDownload(selectedTheme)}>
              Download wallpaper
            </button>
            <button type="button" className="secondary-button" onClick={() => toggleFavorite(selectedTheme.id)}>
              {favorites.includes(selectedTheme.id) ? 'Saved to favorites' : 'Save to favorites'}
            </button>
            <button type="button" className="text-button" onClick={() => setView('search')}>
              Back to results
            </button>
          </div>
        </div>
      </div>

      <div className="related-block">
        <div className="section-header">
          <h2>Related themes</h2>
        </div>
        <div className="wallpaper-grid">
          {wallpapers
            .filter((item) => item.category === selectedTheme.category && item.id !== selectedTheme.id)
            .slice(0, 4)
            .map((item) => renderWallpaperCard(item))}
        </div>
      </div>
    </section>
  )

  const renderCreatePage = () => (
    <section className="page ai-panel">
      <div className="panel-header">
        <h2>AI wallpaper studio</h2>
        <span className="status-pill">Integration-ready</span>
      </div>
      <div className="builder-grid">
        <div className="studio-card large">
          <label>
            Prompt
            <textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} />
          </label>
          <div className="prompt-row">
            {prompts.map((prompt) => (
              <button key={prompt} type="button" className="chip" onClick={() => setAiPrompt(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
          <div className="options-row">
            <select value={aiStyle} onChange={(event) => setAiStyle(event.target.value)}>
              <option value="Minimalist">Minimalist</option>
              <option value="Cinematic">Cinematic</option>
              <option value="Nature">Nature</option>
              <option value="Futuristic">Futuristic</option>
              <option value="Luxury">Luxury</option>
            </select>
            <select value={aiMode} onChange={(event) => setAiMode(event.target.value as 'Landscape' | 'Portrait')}>
              <option value="Landscape">Landscape</option>
              <option value="Portrait">Portrait</option>
            </select>
          </div>
          <button type="button" className="primary-button generate-button" onClick={handleGeneratePreview}>
            Generate concept
          </button>
        </div>

        <div className="studio-card preview-card">
          {generatedPreview ? (
            <>
              <div
                className="generated-image"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(8,15,26,0.08), rgba(8,15,26,0.55)), url(${generatedPreview})` }}
              />
              <div className="preview-meta">
                <strong>{aiStyle} concept</strong>
                <span>{aiMode} output</span>
              </div>
              <div className="card-actions">
                <button type="button" className="secondary-button">Save to gallery</button>
                <button type="button" className="primary-button">Download</button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <strong>AI service not configured</strong>
              <p>Connect your image-generation provider in the environment settings to enable live prompt generation.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )

  const renderFavoritesPage = () => (
    <section className="page">
      <div className="section-header">
        <h2>Your favorites</h2>
      </div>
      <div className="wallpaper-grid theme-grid">
        {favoriteItems.length ? (
          favoriteItems.map((item) => renderWallpaperCard(item))
        ) : (
          <div className="empty-panel">No favorites saved yet.</div>
        )}
      </div>
    </section>
  )

  const renderDownloadsPage = () => (
    <section className="page">
      <div className="section-header">
        <h2>Downloads and offline library</h2>
      </div>
      <div className="offline-banner">
        <strong>{online ? 'Connected' : 'Offline access active'}</strong>
        <span>
          {online
            ? 'Your downloaded content is synchronized and ready when needed.'
            : 'Previously saved themes remain available locally.'}
        </span>
      </div>
      <div className="wallpaper-grid">
        {downloads.length ? (
          downloads.map((item) => (
            <article className="wallpaper-card" key={item.id}>
              <div
                className="wallpaper-image"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(10,14,28,0.1), rgba(10,14,28,0.45)), url(${item.localUrl ?? item.preview})` }}
              />
              <div className="card-content">
                <div className="title-row">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.category}</p>
                  </div>
                </div>
                <div className="meta-row">
                  <span>Saved {item.savedLabel ?? item.savedAt}</span>
                </div>
                <div className="card-actions">
                  <button type="button" className="primary-button" onClick={() => {
                    const wallpaper = wallpapers.find((entry) => entry.id === item.id)
                    if (wallpaper) goToDetail(wallpaper)
                    else setNotice('This saved wallpaper remains available in your offline library.')
                  }}>
                    {online ? 'Open preview' : 'Open offline'}
                  </button>
                  <button type="button" className="secondary-button" onClick={() => handleDeleteDownload(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-panel">No themes have been downloaded yet.</div>
        )}
      </div>
    </section>
  )

  const renderProfilePage = () => (
    <section className="page profile-grid">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar large">AY</div>
          <div>
            <h2>Ariana Yates</h2>
            <p>Creator & premium member</p>
          </div>
        </div>
        <div className="profile-stats">
          <div>
            <strong>138</strong>
            <span>Favorites</span>
          </div>
          <div>
            <strong>27</strong>
            <span>Collections</span>
          </div>
          <div>
            <strong>12</strong>
            <span>Downloads</span>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <h3>Account settings</h3>
        <ul className="settings-list">
          <li>
            <button type="button" className="text-button" onClick={() => setView('settings')}>
              Personalization preferences
            </button>
          </li>
          <li>Privacy controls</li>
          <li>Saved payment methods</li>
          <li>Support & help center</li>
        </ul>
      </div>

      <div className="profile-card featured">
        <h3>Premium plan</h3>
        <strong>Theme App Plus</strong>
        <p>Unlimited downloads, premium collections, and AI boosts.</p>
        <button type="button" className="primary-button" onClick={() => setView('membership')}>
          Manage plan
        </button>
      </div>
    </section>
  )

  const renderSettingsPage = () => (
    <section className="page settings-page">
      <div className="section-header">
        <h2>Settings and authentication</h2>
      </div>
      <div className="settings-card-grid">
        <div className="profile-card">
          <h3>Appearance</h3>
          <div className="toggle-row">
            <span>Light / dark mode</span>
            <button type="button" className="secondary-button" onClick={() => setThemeMode((current) => (current === 'light' ? 'dark' : 'light'))}>
              {themeMode === 'light' ? 'Switch to dark' : 'Switch to light'}
            </button>
          </div>
        </div>

        <div className="profile-card">
          <h3>Account</h3>
          <ul className="settings-list">
            <li>Sign in securely</li>
            <li>Two-factor authentication</li>
            <li>Manage email notifications</li>
          </ul>
        </div>

        <div className="profile-card">
          <h3>Security</h3>
          <ul className="settings-list">
            <li>Active sessions</li>
            <li>Privacy dashboard</li>
            <li>Connected devices</li>
          </ul>
        </div>
      </div>
    </section>
  )

  const renderMembershipPage = () => (
    <section className="page">
      <div className="section-header">
        <h2>Premium membership</h2>
      </div>
      <div className="plan-grid">
        <div className="profile-card">
          <h3>Free</h3>
          <strong>$0</strong>
          <ul className="settings-list">
            <li>Access to free themes</li>
            <li>Limited favorites</li>
            <li>Basic AI prompts</li>
          </ul>
          <button type="button" className="secondary-button">Current plan</button>
        </div>

        <div className="profile-card featured">
          <h3>Premium</h3>
          <strong>$12/mo</strong>
          <ul className="settings-list">
            <li>Unlimited premium downloads</li>
            <li>Priority creator access</li>
            <li>Advanced AI studio</li>
            <li>Exclusive packs</li>
          </ul>
          <button type="button" className="primary-button">Upgrade now</button>
        </div>
      </div>

      <div className="bottom-card purchase-card">
        <h3>Purchase history</h3>
        <div className="mini-row"><span className="mini-dot" style={{ background: '#7c3aed' }} /> Aurora Heights pack • $12 • Mar 12</div>
        <div className="mini-row"><span className="mini-dot" style={{ background: '#47b5ff' }} /> AI Dreamscape • $9 • Feb 28</div>
      </div>
    </section>
  )

  const renderAdminPage = () => (
    <section className="page">
      <div className="section-header">
        <h2>Secure admin dashboard</h2>
      </div>
      <div className="stats-row">
        <div className="stat-card">
          <strong>1,284</strong>
          <span>published themes</span>
        </div>
        <div className="stat-card">
          <strong>87</strong>
          <span>active creators</span>
        </div>
        <div className="stat-card">
          <strong>92%</strong>
          <span>approval rate</span>
        </div>
      </div>
      <div className="admin-grid">
        <div className="bottom-card">
          <h3>Category manager</h3>
          {categories.slice(0, 5).map((category) => (
            <div key={category.name} className="mini-row">
              <span className="mini-dot" style={{ background: category.accent }} />
              {category.name}
            </div>
          ))}
        </div>
        <div className="bottom-card">
          <h3>Moderation queue</h3>
          <div className="mini-row"><span className="mini-dot" style={{ background: '#10b981' }} /> 24 new submissions</div>
          <div className="mini-row"><span className="mini-dot" style={{ background: '#f59e0b' }} /> 6 pending reviews</div>
          <div className="mini-row"><span className="mini-dot" style={{ background: '#ef4444' }} /> 2 flagged reports</div>
        </div>
      </div>
    </section>
  )

  return (
    <div className={`app-shell ${themeMode}`}>
      <main className="content-panel">
        <header className="theme-header">
          <button type="button" className="brand-lockup" onClick={() => setView('home')} aria-label="Theme Nest home">
            <svg className="nest-logo" viewBox="0 0 52 52" role="img" aria-label="Theme Nest logo">
              <defs><linearGradient id="nest-gradient" x1="5" y1="5" x2="46" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="#ff4b8d"/><stop offset="1" stopColor="#e62570"/></linearGradient></defs>
              <rect x="4" y="4" width="44" height="44" rx="16" fill="url(#nest-gradient)"/>
              <rect x="17" y="11" width="18" height="27" rx="5" fill="#fff" fillOpacity=".95"/>
              <rect x="20" y="15" width="12" height="17" rx="2" fill="#e9c4df"/>
              <path d="M12 36c7 7 21 7 28 0M15 40c6 4 16 4 22 0M19 44c4 2 10 2 14 0" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="2"/>
              <path d="m38 11 1.4 3.6L43 16l-3.6 1.4L38 21l-1.4-3.6L33 16l3.6-1.4L38 11Z" fill="#ffe6a8"/>
            </svg>
            <span className="brand-copy"><strong>Theme Nest</strong><small>Make your screen feel like yours</small></span>
          </button>
          <nav className="primary-navigation" aria-label="Main navigation">
            {primaryNavigation.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`primary-nav-link ${view === item.id ? 'active' : ''}`}
                onClick={() => setView(item.id)}
              >
                <span aria-hidden="true">{item.emoji}</span>{item.label}
              </button>
            ))}
          </nav>
          <label className="header-search">
            <span aria-hidden="true">⌕</span>
            <input aria-label="Search themes by name or category" value={query} onChange={(event) => { changeQuery(event.target.value); setView('home') }} placeholder="Search wallpapers, moods, colors..." />
            {query && <button type="button" aria-label="Clear search" onClick={() => { changeQuery(''); setView('home') }}>×</button>}
          </label>
          <div className="header-controls">
            <button type="button" className="round-control theme-mode-control" aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`} onClick={() => setThemeMode((current) => current === 'light' ? 'dark' : 'light')}>{themeMode === 'light' ? '☾' : '☼'}</button>
            <button type="button" className="round-control premium-control" aria-label="Premium themes" onClick={() => setView('membership')}>♛</button>
            <button type="button" className={`account-control ${view === 'profile' ? 'active' : ''}`} onClick={() => setView('profile')}><span>◎</span>Profile</button>
            <button type="button" className={`account-control ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}><span>▣</span>Admin</button>
            <button type="button" className="coin-balance" onClick={() => setNotice(`You have ${coinBalance} preview coins.`)}>🪙 <strong>{coinBalance}</strong></button>
            <button type="button" className="round-control add-coin" aria-label="Get more coins" onClick={() => setNotice('Coin top-ups are not available in this web preview.')}>+</button>
          </div>
        </header>

        {(view === 'home' || view === 'wallpapers') && (
          <div className="category-bar">
            <div className="category-scroll" aria-label="Theme categories">
              <button type="button" className={`category-chip ${selectedCategory === 'All' ? 'selected' : ''}`} onClick={() => { changeCategory('All'); setView('home') }}>All</button>
              {galleryCategories.map((category) => (
                <button
                  type="button"
                  className={`category-chip ${selectedCategory === category.name ? 'selected' : ''}`}
                  key={category.name}
                  onClick={() => { changeCategory(category.name); setView('home') }}
                >
                  <span>{category.emoji}</span>{category.name}
                </button>
              ))}
            </div>
            <button type="button" className="filter-control" aria-label="Filter categories" onClick={() => setFilterOpen(true)}>☷</button>
          </div>
        )}

        {(view === 'home' || view === 'wallpapers') && renderHomePage()}
        {renderTabPage()}
        {view === 'explore' && renderExplorePage()}
        {view === 'search' && renderSearchPage()}
        {view === 'category' && renderCategoryPage()}
        {view === 'detail' && renderDetailPage()}
        {view === 'create' && renderCreatePage()}
        {view === 'favorites' && renderFavoritesPage()}
        {view === 'downloads' && renderDownloadsPage()}
        {view === 'profile' && renderProfilePage()}
        {view === 'settings' && renderSettingsPage()}
        {view === 'membership' && renderMembershipPage()}
        {view === 'admin' && renderAdminPage()}

        {notice && <button type="button" className="notice-toast" onClick={() => setNotice('')} aria-label="Dismiss message">{notice}<span>×</span></button>}

        {lightboxOpen && (
          <div className="wallpaper-lightbox" role="dialog" aria-modal="true" aria-label={`${selectedTheme.title} full-screen preview`} onClick={() => setLightboxOpen(false)}>
            <button type="button" className="lightbox-close" aria-label="Close preview" onClick={() => setLightboxOpen(false)}>×</button>
            <img src={selectedTheme.image} alt={`${selectedTheme.title} wallpaper`} onClick={(event) => event.stopPropagation()} />
            <div className="lightbox-caption"><strong>{selectedTheme.title}</strong><button type="button" className="featured-action" onClick={(event) => { event.stopPropagation(); void handleDownload(selectedTheme) }}>Download wallpaper ↓</button></div>
          </div>
        )}

        {screenPreviewTarget && (() => {
          const wallpaper = getScreenWallpaper(screenPreviewTarget) ?? selectedTheme
          return (
            <div className="screen-preview-backdrop" role="dialog" aria-modal="true" aria-label={`${screenPreviewTarget === 'home' ? 'Home' : 'Lock'} screen preview`} onClick={() => setScreenPreviewTarget(null)}>
              <section className="screen-preview-dialog" onClick={(event) => event.stopPropagation()}>
                <div className="screen-preview-heading">
                  <div><span>THEME NEST PREVIEW</span><h2>{screenPreviewTarget === 'home' ? 'Home Screen' : 'Lock Screen'}</h2></div>
                  <button type="button" className="screen-preview-close" aria-label="Close screen preview" onClick={() => setScreenPreviewTarget(null)}>×</button>
                </div>
                <div className={`device-screen ${screenPreviewTarget}`}>
                  <img src={wallpaper.image} alt={`${wallpaper.title} applied wallpaper preview`} />
                  <span className="device-status">9:41 <span>● ● ▰</span></span>
                  {screenPreviewTarget === 'lock' ? (
                    <div className="device-lock-clock"><span>MONDAY, OCTOBER 13</span><strong>9:41</strong></div>
                  ) : (
                    <>
                      <div className="device-home-widget"><span>MONDAY · OCT 13</span><strong>Good morning</strong><small>18° · Clear skies</small></div>
                      <AppIconGrid className="device-app-grid" apps={appIcons.map((app) => app.id)} />
                      <AppIconGrid className="device-dock" apps={dockApps} />
                    </>
                  )}
                </div>
                <div className="screen-preview-footer">
                  <p><strong>{wallpaper.title}</strong><span>This changes the Theme Nest preview only. Use your device wallpaper settings to apply it system-wide.</span></p>
                  <button type="button" className="primary-button" onClick={() => setScreenPreviewTarget(null)}>Done</button>
                </div>
              </section>
            </div>
          )
        })()}

        {filterOpen && (
          <div className="filter-backdrop" onClick={() => setFilterOpen(false)}>
            <section className="filter-dialog" role="dialog" aria-modal="true" aria-label="Choose a category" onClick={(event) => event.stopPropagation()}>
              <div className="filter-dialog-heading">
                <h2>Categories</h2>
                <button type="button" aria-label="Close categories" onClick={() => setFilterOpen(false)}>×</button>
              </div>
              <div className="filter-chip-grid">
                {galleryCategories.map((category) => (
                  <button
                    type="button"
                    className={`category-chip ${selectedCategory === category.name ? 'selected' : ''}`}
                    key={category.name}
                    onClick={() => { changeCategory(category.name); setView('home'); setFilterOpen(false) }}
                  >
                    <span>{category.emoji}</span>{category.name}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        <footer className="site-footer">
          <div className="footer-brand">
            <div className="brand-mark small">T</div>
            <div>
              <strong>{appName}</strong>
              <small>Premium themes for every device</small>
            </div>
          </div>
          <div className="footer-links">
            {footerLinks.map((label) => (
              <button key={label} type="button" className="footer-link" onClick={() => setView('home')}>
                {label}
              </button>
            ))}
            <a className="footer-link" href="/wallpaper-credits.html">Image credits</a>
          </div>
        </footer>

      </main>
    </div>
  )
}

export default App
