# Anastasiia Petrenko — Portfolio

Personal portfolio of Anastasiia Petrenko, Lead Product Designer specializing in complex product systems: ERP/CRM, fintech, e-commerce, mobile products, branding, and design systems.

## Project Structure

```text
/
├── index.html              # Main portfolio page
├── CNAME                   # Custom domain config
├── css/
│   ├── styles.css          # Global styles, main page, shared layout
│   ├── about-bento.css     # Current About section variant
│   └── case.css            # Shared case-study styles for several cases
├── js/
│   └── main.js             # Carousel, mobile menu, reveals, counters
├── cases/
│   ├── b2c-onboarding.html # B2C onboarding image-stack case (NDA)
│   ├── erp-core.html       # ERP core case
│   ├── erp-wave.html       # ERP/CRM payments flow case
│   ├── pap-pay.html        # Pap-Pay product case
│   ├── pap-pay-ds.html     # Pap-Pay design system case
│   ├── turbo.html          # Turbo.ua delivery app case
│   └── turbo-branding.html # Turbo.ua brand identity case
└── assets/
    ├── images/             # Shared images and case thumbnails
    ├── pap-pay/            # Pap-Pay motion assets and encoding notes
    └── pap-pay-ds/         # Pap-Pay design system assets
```

## Current Work Grid

The main page currently shows these case cards:

1. Pap-Pay payroll wallet
2. Enhancing the ERP core
3. Unified ERP & CRM payments flow
4. Turbo.ua delivery app
5. Packaging & brand identity
6. Design system
7. B2C onboarding & first-deposit funnel

## Styling Notes

- `css/styles.css` is the main global stylesheet.
- `css/about-bento.css` styles the current About section.
- `css/case.css` is shared by older structured case pages.
- Some large case pages include their own embedded CSS because they use custom layouts.
- `css/style.css` and `css/tokens.css` were removed during cleanup and are no longer part of the live site.

## B2C onboarding (NDA)

`cases/b2c-onboarding.html` is intentionally simple: it renders six full-width images one after another. The project is under NDA, so the product name and domain are kept out of the copy and the images.

The images live in `assets/images/`:

- `b2c-onboarding-01.webp` … `b2c-onboarding-06.webp`
- `case-b2c-onboarding.webp` (legacy thumbnail; the main-page card uses `assets/home/covers/b2c-onboarding-sm.webp`)

## Maintenance

- Keep `.DS_Store`, temporary files, and local tool folders out of commits.
- `.claude/` is local tooling and is not required for the website.
- Before deleting assets, search for the filename across `index.html`, `cases/`, `css/`, and `js/`.
- For local preview, run a static server from the project root and open `http://127.0.0.1:8001/`.
