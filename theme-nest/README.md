# Theme Nest

Theme Nest is a wallpaper and personalization app built with React and TypeScript. It includes category browsing, favorites, local downloads with offline persistence, and an AI studio interface prepared for backend integration.

The collection includes locally bundled, downloadable images sourced from Wikimedia Commons. The Animals, Love & Romance, and Football categories each include 40 distinct wallpapers; Cartoon includes 30 openly licensed illustrations. Copyrighted cartoon franchise artwork is excluded unless its reuse rights are clear. Image creators, source pages, and license terms are shown on wallpaper details and listed in [the image credits page](./public/wallpaper-credits.html).

Flowers contains 25 flower-focused wallpapers, and every wallpaper card shows a home-screen preview with widgets and app icons before download.

## Local setup

1. Install dependencies:
   npm install
2. Start the development server:
   npm run dev -- --host 0.0.0.0
3. Build for production:
   npm run build

## Optional production integrations

Authentication, cloud storage, AI image generation, premium checkout, and advertising require separately configured production services. The current frontend includes demo interfaces for those integrations; it does not provide their backend services.

## App behavior

- Favorites persist in `localStorage`.
- Downloaded items are stored in IndexedDB so they remain available when the browser is offline.
- Bundled wallpaper images load without a third-party image API; source and license credits are available in the app and on the credits page.
- PWA caching is enabled through the service worker in `public/sw.js`.
- `VITE_APP_NAME` controls the app branding and can be changed without rewriting the UI.
