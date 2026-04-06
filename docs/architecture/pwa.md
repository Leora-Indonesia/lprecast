# PWA Architecture

## Overview

LPrecast menggunakan **Serwist** untuk Progressive Web App (PWA) dengan Next.js App Router dan Turbopack.

## Technology Stack

- **Serwist**: PWA library (fork dari Workbox) untuk service worker dan caching
- **Mode**: Turbopack (Next.js 15+)
- **Service Worker**: TypeScript dengan precaching dan runtime caching
- **Manifest**: Dynamic generation via `app/manifest.ts`

## File Structure

```
app/
├── sw.ts                 # Service worker logic (Precaching + Runtime caching)
├── manifest.ts           # PWA manifest (dynamic from theme-config)
└── ~offline/
    └── page.tsx         # Offline fallback page

lib/
└── theme-config.ts      # ⭐ SOURCE OF TRUTH untuk semua warna

public/
├── icon.svg              # Source SVG icon
├── icon-192x192.png     # PWA icon (192x192)
├── icon-512x512.png     # PWA icon (512x512)
├── apple-touch-icon.png  # iOS icon (180x180)
└── sw.js                # Generated service worker
```

## Theme Configuration

### Single Source of Truth

**`lib/theme-config.ts`** adalah source of truth untuk semua warna dan konfigurasi tema.

### How to Change Colors

⚠️ **PENTING**: Ubah warna di **SATU TEMPAT SAJA**: `lib/theme-config.ts`

**Langkah:**

1. Buka `lib/theme-config.ts`
2. Ubah nilai di bagian `colors.light` atau `colors.dark`
3. **WAJIB**: Update juga `app/globals.css` (search & replace hex values yang sama)
4. Manifest, layout, dan offline page akan **OTOMATIS** update

**Contoh perubahan warna primary:**

```typescript
// lib/theme-config.ts
colors: {
  light: {
    primary: "#NEW_COLOR",  // ← Ubah di sini
    ...
  }
}

// app/globals.css - SEARCH & REPLACE hex yang sama
:root {
  --primary: "#NEW_COLOR";  // ← Update manual di sini
  ...
}
```

### Color Reference Table

| Purpose    | Light Mode | Dark Mode | Usage                   |
| ---------- | ---------- | --------- | ----------------------- |
| Primary    | `#16a34a`  | `#15803d` | Buttons, links, accents |
| Background | `#ffffff`  | `#171717` | Page background         |
| Foreground | `#0a0a0a`  | `#fafafa` | Text color              |
| Card       | `#ffffff`  | `#262626` | Card background         |
| Border     | `#e5e5e5`  | `#404040` | Borders, dividers       |

## PWA Features

### 1. Service Worker (sw.ts)

- **Precaching**: Auto-cache semua static assets saat install
- **Runtime Caching**: Strategi caching untuk API calls
- **Offline Support**: Fallback ke `/~offline` saat offline
- **Skip Waiting**: Langsung aktifkan SW baru

### 2. Manifest (manifest.ts)

- **Installable**: User bisa install ke home screen
- **Standalone Display**: Muncul tanpa browser chrome
- **Theme Color**: Match dengan app theme
- **Orientation**: Portrait only

### 3. Offline Page (~offline/page.tsx)

- **Fallback**: Ditampilkan saat page belum di-cache dan offline
- **Retry Button**: User bisa coba reload
- **Themed**: Warnanya match dengan app theme

## How to Modify

### Adding New Precached Routes

Edit `next.config.mjs` → `additionalPrecacheEntries`:

```javascript
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [
    { url: "/~offline", revision },
    { url: "/new-page", revision }, // ← Add new pages here
  ],
})
```

### Customizing Offline Page

Edit `app/~offline/page.tsx`:

```tsx
// Styles automatically use theme-config via CSS variables
// Just change the layout/structure as needed
```

### Changing PWA Metadata

Edit `lib/theme-config.ts` → bagian `pwa`:

```typescript
pwa: {
  name: "LPrecast",
  shortName: "LPrecast",
  description: "...",
  display: "standalone", // or "fullscreen", "minimal-ui"
  // ...
}
```

## Testing PWA

### Local Development

```bash
pnpm dev
```

1. Open Chrome DevTools → Application tab
2. Check **Manifest** - should show app name, icons, theme color
3. Check **Service Workers** - should show registered SW
4. Check **Cache Storage** - should show precached assets

### Offline Testing

1. Chrome DevTools → Network tab
2. Throttle to "Offline"
3. Navigate to any page
4. Should show offline fallback page

### Install to Home Screen

1. Open app in Chrome (desktop or mobile)
2. Click install icon in address bar (desktop)
3. Or via Chrome menu → "Install app" (mobile)
4. App should appear as standalone app

### Production Testing

```bash
pnpm build
pnpm start
```

Test all PWA features in production build.

## Icon Generation

### Source Icon

Icon source ada di `public/icon.svg` - Simple house icon dengan background hijau.

### Generate PNGs from SVG

**Option 1: Online Tools**

1. Buka https://favicon.io/
2. Upload `public/icon.svg`
3. Download semua ukuran yang dibutuhkan

**Option 2: RealFaviconGenerator**

1. Buka https://realfavicongenerator.net/
2. Upload `public/icon.svg`
3. Generate semua variant
4. Copy hasil ke folder `public/`

**Sizes yang dibutuhkan:**
| File | Size | Purpose |
|------|------|---------|
| `icon-192x192.png` | 192x192 | Standard PWA icon |
| `icon-512x512.png` | 512x512 | High-res PWA icon, splash screen |
| `apple-touch-icon.png` | 180x180 | iOS home screen icon |

## Troubleshooting

### Service Worker Not Registering

**Check:**

1. Apakah Turbopack sedang running? (`pnpm dev`)
2. Apakah ada error di `app/sw.ts`?
3. Apakah `next.config.mjs` sudah di-update dengan `withSerwist`?

**Solution:**

```bash
# Clear browser cache & service workers
# Chrome DevTools → Application → Clear storage

# Restart dev server
pnpm dev
```

### Theme Color Not Updating

**Cause:** Browser cache

**Solution:**

1. Clear browser cache
2. Re-install PWA (uninstall dari home screen, clear cache, reinstall)
3. Check `manifest.ts` menggunakan `themeConfig.pwa.themeColor`

### Icons Not Showing

**Check:**

1. Apakah file PNG ada di `/public/`?
2. Apakah path di `manifest.ts` sudah benar?
3. Apakah icon di-generate dengan ukuran yang benar?

**Solution:**

```bash
# Verify icon files exist
ls -la public/icon-*.png

# Check manifest paths
cat app/manifest.ts
```

### Offline Page Not Appearing

**Cause:** Page belum di-precache

**Solution:**

1. Kunjungi semua page yang ingin di-cache
2. Service worker akan auto-cache saat kunjungan pertama
3. Atau tambahkan ke `additionalPrecacheEntries` di `next.config.mjs`

### TypeScript Errors with Serwist

**Error:** `Cannot find module 'serwist'`

**Solution:**

```bash
pnpm add serwist
```

## Resources

- [Serwist Documentation](https://serwist.pages.dev/)
- [Next.js PWA Guide](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)
- [Workbox Caching Strategies](https://developer.chrome.com/docs/workbox/caching-strategies-overview)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## Notes for AI Agents

### Dos

✅ Check `lib/theme-config.ts` sebelum modify warna
✅ Update `globals.css` saat theme-config berubah
✅ Test PWA di light DAN dark mode
✅ Clear browser cache saat testing theme changes

### Don'ts

❌ Jangan hardcode warna di `manifest.ts` atau `layout.tsx`
❌ Jangan modify service worker tanpa paham Serwist
❌ Jangan skip testing offline functionality
❌ Jangan lupa generate ulang icons setelah ubah desain
