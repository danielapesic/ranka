# Salon Ranka

Website for Salon Ranka, a massage salon in Zagreb, Croatia. Built with Astro 5 and Tailwind CSS, outputs a fully static site.

**Live pages**
- `/` — Homepage with 11 sections
- `/kontakt` — Contact page with map, hours, and CTA

---

## Tech stack

| Tool | Version | Purpose |
|---|---|---|
| [Astro](https://astro.build) | v5 | Static site framework |
| [Tailwind CSS](https://tailwindcss.com) | v3 | Utility-first styling |
| [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) | — | Primary font (Google Fonts) |

No JS frameworks (React/Vue/Svelte). All components are pure `.astro` files.

---

## Getting started

```bash
# Install dependencies
npm install

# Start dev server → http://localhost:4321
npm run dev

# Production build → ./dist/
npm run build

# Preview production build locally
npm run preview
```

---

## Project structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro        # Base HTML shell — SEO, fonts, JSON-LD, scroll animations
│   ├── components/
│   │   ├── Header.astro        # Sticky nav with scroll-spy active states
│   │   ├── Footer.astro        # 4-column footer
│   │   ├── Hero.astro          # Full-viewport hero with background image
│   │   ├── StatsStrip.astro    # Star rating + trust stats strip
│   │   ├── About.astro         # Centered text + floating circular images
│   │   ├── WhyUs.astro         # 3 feature cards
│   │   ├── HowItWorks.astro    # 3-step process with icon badges
│   │   ├── Services.astro      # 6 full-image overlay service cards
│   │   ├── Gallery.astro       # 6-image grid
│   │   ├── Testimonials.astro  # 3 review cards with avatars
│   │   ├── CtaBanner.astro     # Full-height CTA section (reusable)
│   │   ├── Faq.astro           # Accordion FAQ (no JS, uses <details>)
│   │   ├── Hours.astro         # Opening hours table, highlights today
│   │   └── StickyCallButton.astro  # Mobile-only fixed call button
│   ├── pages/
│   │   ├── index.astro         # Homepage
│   │   └── kontakt.astro       # Contact page
│   └── styles/
│       └── global.css          # Tailwind imports + component classes + animations
├── astro.config.mjs
└── tailwind.config.mjs
```

---

## Design system

### Colors

| Token | Hex | Usage |
|---|---|---|
| `cream` | `#FAFAF8` | Page background |
| `sage-500` | `#3D5A40` | Primary accent — buttons, active states, icons |
| `sage-600` | `#2E4430` | Hover state for primary accent |
| `charcoal` | `#111311` | Primary text |
| `stone` | `#6B7280` | Muted / secondary text |
| `pebble` | `#E5E7EB` | Borders, dividers |

### Typography

Single font family throughout: **Bricolage Grotesque** (loaded from Google Fonts).

- Headings use `.heading-xl` / `.heading-lg` / `.heading-md` utility classes (defined in `global.css`) — fluid sizing via `clamp()`
- Eyebrow labels use `.eyebrow` — `text-xs tracking-widest uppercase text-stone`

### Buttons

All buttons are **pill-shaped** (`rounded-full`). Four variants defined in `global.css`:

| Class | Style |
|---|---|
| `.btn-primary` | Sage green background, white text |
| `.btn-outline` | Charcoal border, charcoal text |
| `.btn-outline-white` | White border, white text (for dark backgrounds) |
| `.btn-outline-sage` | Sage border, sage text |

---

## Replacing placeholder images

All images are Unsplash placeholders. Replace by swapping the `src` URLs in each component. No image processing pipeline — plain `<img>` tags with `loading="lazy"`.

Key files to update:

| Component | What to replace |
|---|---|
| `Hero.astro` | Hero background image |
| `About.astro` | 6 floating circle images |
| `Services.astro` | 6 service card images |
| `Gallery.astro` | 6 gallery images |
| `Testimonials.astro` | 3 avatar photos |
| `CtaBanner.astro` | CTA section background |

---

## Business details

All contact info is hardcoded in the components. To update:

| Detail | Location |
|---|---|
| Phone number | `Header.astro`, `Footer.astro`, `CtaBanner.astro`, `Faq.astro`, `kontakt.astro`, `StickyCallButton.astro`, `HowItWorks.astro` |
| Address | `Footer.astro`, `kontakt.astro`, `Layout.astro` (JSON-LD) |
| Email | `Footer.astro`, `kontakt.astro` |
| Opening hours | `Hours.astro` (also in `Layout.astro` JSON-LD schema) |
| Google Maps embed | `kontakt.astro` — replace the `src` on the `<iframe>` |

---

## Cjenik i strojno čitljivi cjenici (NN 101/26, 110/26)

Cijene se upisuju **samo** u `src/data/cjenik.json`. Iz te datoteke se generira i vidljivi cjenik (`/cjenik`, uz sidrenu cijenu) i CSV u `public/cjenici/` (popis svih objava na `/cjenici`).

Po usluzi: `naziv`, `trajanje`, `cijena` (EUR), `posebni_oblik_prodaje` (true/false), `naziv_posebnog_oblika` (npr. `"Akcija"`, inače `""`), `sidrena_cijena` (cijena na dan 10. 9. 2026.).

### Postupak promjene cijene

1. U `src/data/cjenik.json` promijeni cijene i postavi `objava` na datum i vrijeme kad nove cijene počinju vrijediti, najkasnije u 8:00 tog dana (npr. `"2026-12-01T07:00"`).
2. Pokreni `npm run cjenik` (ili `npm run build`). Skripta stvara **novu** datoteku s idućim brojem pohrane, npr. `salon_Miramarska-cesta-24-Zagreb_PJ1_0002_2026-12-01T07-00.csv`.
3. Commitaj `cjenik.json` i novi CSV te ih deployaj tako da budu online **najkasnije do 8:00** na dan kad nova cijena počinje vrijediti.

- Stare CSV datoteke se **nikad ne brišu**. Arhiva ostaje commitana u repou.
- Ako se cijene ne mijenjaju, ne radi se ništa. Skripta ne stvara novu datoteku ako je sadržaj isti, a dnevno ažuriranje za usluge nije potrebno.
- Na Vercelu build **pada** ako CSV za trenutni `cjenik.json` nije commitan. Tako se ne može dogoditi da web prikazuje cijene koje nisu objavljene u CSV-u.
- `/cjenici/` mora ostati dostupan botovima: bez prijave, CAPTCHA-e i challengea (Vercel Attack Challenge Mode / Deployment Protection na produkciji) te bez blokade u `robots.txt`. `vercel.json` postavlja `Content-Type: text/csv; charset=utf-8`.

---

## SEO

- Per-page `<title>` and `<meta name="description">` set via props on `Layout.astro`
- Open Graph tags with `og:locale="hr_HR"`
- JSON-LD `LocalBusiness` schema on the homepage (in `Layout.astro`)
- `<html lang="hr">` throughout

To update the site URL used in canonical and OG tags, change the `siteUrl` constant in `src/layouts/Layout.astro`.

---

## Deployment

The build output is a plain static folder (`./dist/`). Deploy to any static host:

```bash
npm run build
# then upload ./dist/ to your host
```

Works out of the box with Netlify, Vercel, Cloudflare Pages, or any web server. No server-side runtime required.
