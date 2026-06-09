# HeaVit — Marketing Website

A fast, zero-build, single-page marketing site for **HeaVit**, the AI nutrition coach
calibrated for South Asian metabolism. Plain HTML/CSS/JS — no framework, no build step,
nothing to break. Built to deploy free on Vercel in under a minute.

## Files

```
HeaVit-Website/
├── index.html      ← all page content / structure
├── styles.css      ← full design system (brand colours, layout, responsive)
├── script.js       ← nav, mobile menu, scroll reveals
├── favicon.svg     ← lime-bolt brand icon
├── vercel.json     ← security headers + caching (optional)
└── README.md       ← this file
```

## Deploy to Vercel (free)

Pick whichever is easiest for you:

### Option A — Drag & drop (no Git, fastest)
1. Go to **vercel.com → Add New → Project → Deploy** (or use the Vercel dashboard "Deploy" / drag-drop area).
2. Drag this whole `HeaVit-Website` folder in.
3. Vercel auto-detects a static site — just click **Deploy**. Done.

### Option B — Vercel CLI
```bash
npm i -g vercel
cd HeaVit-Website
vercel          # follow prompts (accept defaults)
vercel --prod   # promote to production
```

### Option C — GitHub + Vercel (best for ongoing edits)
1. Push this folder to its **own** GitHub repo (keep it separate from the Expo app so Vercel doesn't try to build React Native).
2. In Vercel: **Add New → Project → Import** that repo.
3. Framework Preset: **Other** · Build Command: *(leave empty)* · Output Directory: `./`
4. Deploy. Every push now auto-deploys.

> Tip: if you keep this inside the `NutrIQ` repo, set Vercel's **Root Directory** to the
> website subfolder so it doesn't try to build the React Native app.

## Before you launch — customise these

1. **Waitlist form** (`index.html`, near `id="waitlist"`): the form posts to Formspree.
   Create a free form at [formspree.io](https://formspree.io) and replace `YOUR_FORM_ID`
   in the `action="https://formspree.io/f/YOUR_FORM_ID"`. (Or point it at your own endpoint.)
2. **Testimonials**: the three quotes are **placeholders** (marked with a `TODO` comment).
   Replace them with real, consented testimonials before going live.
3. **Pricing**: the ₹0 / ₹499 tiers are illustrative — set your real plan.
4. **Social share image**: add an `og-image.png` (1200×630) to this folder for nice
   link previews (referenced in `index.html` `<meta property="og:image">`).
5. **Legal links** in the footer already point to your existing Notion Privacy Policy
   and Terms — update if those URLs change.
6. **Domain**: in Vercel → Project → Settings → Domains, add your custom domain
   (e.g. `heavit.in`) for free.

## Brand notes
- Colours: Electric Lime `#BBDD00` × Deep Forest Green `#506600` (matches the app theme).
- Font: Montserrat (loaded from Google Fonts).
- Accessible, responsive, respects `prefers-reduced-motion`.

## Honest disclaimers (kept on the page)
The site includes the same medical disclaimer as the app — HeaVit provides nutritional
guidance and is **not** a substitute for professional medical advice. Keep this language.
Avoid adding fabricated user counts or unverified health claims.
