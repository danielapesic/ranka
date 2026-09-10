# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing website for **Salon Ranka**, a massage salon in Zagreb, Croatia. Astro 5 + Tailwind CSS v3, output is a fully static site (`output: 'static'`). All content is in Croatian (`<html lang="hr">`). No JS frameworks — every component is a pure `.astro` file, and interactivity uses either CSS-only patterns or small inline vanilla-JS scripts.

## Commands

```bash
npm run dev      # dev server → http://localhost:4321
npm run build    # static build → ./dist/
npm run preview  # preview the built ./dist/ locally
```

There is no test suite, linter, or formatter configured — `dev`, `build`, and `preview` are the only scripts.

## Architecture

- **Two pages**: `src/pages/index.astro` (homepage, composes ~13 section components in order) and `src/pages/kontakt.astro` (contact). To add a section, build a component in `src/components/` and drop it into the page.
- **`src/layouts/Layout.astro`** is the single HTML shell for both pages. It owns: `<head>` SEO/OG/Twitter tags (driven by `title`/`description`/`ogImage` props), the Bricolage Grotesque Google Fonts link, the `LocalBusiness` JSON-LD block (rendered only when the `isHomepage` prop is set), and the global scroll-fade `IntersectionObserver` inline script. The `siteUrl` constant here is the base for canonical + OG URLs — update it when the domain changes.
- **`src/styles/global.css`** is the design-system source of truth. It defines the `@layer components` utility classes used everywhere (`.container-wide`, `.section-py`, `.eyebrow`, `.heading-xl/lg/md`, the four `.btn-*` pill variants, `.service-card`) plus all animation CSS. Prefer these classes over ad-hoc Tailwind for headings, buttons, and section spacing so the design stays consistent.
- **`tailwind.config.mjs`** defines the color tokens (`cream`, `sage.{50..700}`, `charcoal`, `stone`, `pebble`) and `Bricolage Grotesque` as the `font-sans` family. `applyBaseStyles: false` is set in `astro.config.mjs`, so base styles come only from `global.css`.

### Interactivity patterns (no framework)

- **Scroll fade-in**: add class `fade-up` (optionally `fade-up-delay-1..5`) to any element; the observer in `Layout.astro` adds `.visible` when it scrolls into view.
- **Header scroll-spy / color inversion**: `#site-header` starts transparent over the hero with white text (`.header-text`, `.header-cta`); an inline script in `Header.astro` toggles `.header-scrolled` to swap to the cream/charcoal treatment. Styling for both states lives in `global.css`.
- **FAQ accordion**: native `<details>`/`<summary>` — no JS. `.summary-icon` rotates via `details[open]`.
- **Mobile call button**: `StickyCallButton.astro`, fixed and mobile-only, with a `.pulse-btn` keyframe ring.

## Content & business details

All copy, images, and contact info are **hardcoded inline in components** — there is no CMS or content collection.

- **Images** are Unsplash placeholder URLs in plain lazy-loaded `<img>` tags (no Astro image pipeline). Replace by swapping `src` URLs.
- **Business info is duplicated across components.** Phone number appears in `Header`, `Footer`, `CtaBanner`, `Faq`, `HowItWorks`, `StickyCallButton`, and `kontakt.astro`. Address/hours also live in `Layout.astro`'s JSON-LD. When changing contact details, grep the whole `src/` tree — a single edit will miss instances.

## Deployment

Static build to `./dist/`. The repo is linked to a Vercel project (`salon-ranka`, see `.vercel/project.json`); output works on any static host with no server runtime.
