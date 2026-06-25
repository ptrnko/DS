# Anastasiia Petrenko — Portfolio

Personal portfolio of Anastasiia Petrenko, Lead Product Designer specializing in high-load systems: CRM/ERP, Trading, Logistics, Finance, HR, E-commerce and Analytics platforms.

## Project structure

```
/
├── index.html          # Main page
├── css/
│   ├── tokens.css      # Design tokens (colors, typography, spacing)
│   └── style.css       # Component styles
├── js/
│   └── main.js         # Scroll behavior, interactions
└── assets/
    └── images/         # Photos, case thumbnails, 3D visuals
```

## Design system

Design source: [Figma — Petrenko Portfolio Redesign](https://www.figma.com/design/SZtgi6KM5C7eNJK2mJ4QXy)

All design tokens live in `css/tokens.css`. Never hardcode colors, font sizes, or spacing — always reference a token.

### Colors

| Token | Value | Usage |
|---|---|---|
| `--c-bg` | `#0a0a0c` | Page background |
| `--c-bg-card` | `#0f0f12` | Card background |
| `--c-bg-footer` | `#101013` | Footer background |
| `--c-surface` | `#2a2a2e` | Dividers, gaps between cards |
| `--c-accent` | `#4493fa` | Labels, highlights, links |
| `--c-accent-border` | `#125bba` | Card top border |
| `--c-text` | `#ffffff` | Headings, primary text |
| `--c-text-nav` | `#cccccc` | Navigation, footer links |
| `--c-text-muted` | `#999999` | Logo, secondary labels |
| `--c-text-body` | `rgba(153,153,153,0.67)` | Body copy |
| `--c-text-label` | `#666666` | Footer column headers |
| `--c-text-copyright` | `#545454` | Copyright line |

### Typography

Font: **Inter** (Regular 400, Medium 500, Bold 700)

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--fs-hero-label` | 24px | Regular | "Hi! I'm …" greeting |
| `--fs-hero-title` | 48px | Bold | Hero headline |
| `--fs-hero-body` | 22px | Regular | Hero subtitle |
| `--fs-section-title` | 24px | Medium | Section headings |
| `--fs-about-quote` | 36px | Medium | About quote |
| `--fs-about-body` | 22px | Regular | About paragraphs |
| `--fs-card-label` | 16px | Medium | Card category tag |
| `--fs-card-title` | 20px | Bold | Card project name |
| `--fs-card-link` | 12px | Regular | "View case →" |
| `--fs-nav` | 16px | Regular | Navigation links |
| `--fs-footer-body` | 18px | Regular | Footer links |
| `--fs-footer-label` | 14px | Bold | Footer column headers |
| `--fs-caption` | 12px | Regular | Copyright |

### Spacing

| Token | Value | Usage |
|---|---|---|
| `--sp-page-x` | 80px | Horizontal page padding |
| `--sp-section-y` | 100px | Section top/bottom padding |
| `--sp-section-y-lg` | 150px | Large section bottom padding |
| `--sp-card-gap` | 30px | Gap between grid rows |
| `--sp-card-pad-x` | 20px | Card horizontal padding |
| `--sp-card-pad-top` | 30px | Card top padding |

### Sections

| Section | Node ID | Description |
|---|---|---|
| Header | `1:4` | Sticky nav with logo + 3 links |
| Hero | `1:10` | Full-width intro with 3D visual |
| Work Grid | `1:39` | 2×3 case card grid |
| About | `1:30` | Quote + bio + photo |
| Footer | `1:84` | Contact / Links / Navigate columns |

## Roadmap

- [x] Project scaffolding (HTML/CSS/JS)
- [x] Design system tokens
- [ ] Hero section implementation
- [ ] Work grid with real case images
- [ ] About section
- [ ] Footer
- [ ] Responsive (tablet + mobile)
- [ ] Case study pages
- [ ] Animations & interactions
