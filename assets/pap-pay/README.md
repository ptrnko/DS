# Pap-Pay — media assets

Motion-first case. Almost every slot on the page is a looping video or the one live
prototype embed. Drop finished media here and the `.pp-media` slots on
`cases/pap-pay.html` pick it up automatically (each slot references a `-webm` + `-mp4`
pair by `data-src`).

## Naming

| Block | File base | Type |
|-------|-----------|------|
| 1 · Cover | `cover-loop` | video, 6–8s seamless loop, title sits over it in HTML |
| 3 · Main | `hierarchy-toggle` | video, autoplay loop, USD ↔ Crypto switch |
| 4 · Send flow | `send-flow` | live Figma embed (iframe) **+** `send-flow` video fallback |
| 5 · States grid | `state-01` … `state-0N` | short 2–3s loops |

For every video ship three files with the same base name:

```
cover-loop.webm          # VP9/AV1, primary
cover-loop.mp4           # H.264, fallback
posters/cover-loop.jpg   # required poster-кадр (first frame)
```

## Hard constraints

- Autoplay only via `<video autoplay loop muted playsinline>` with **mp4 + webm**.
  A Figma prototype embed does **not** autoplay — only block 4 gets the live embed.
- Each loop ≤ **3 MB**, **30 fps**, poster frame mandatory.
- Motion derives from system tokens: durations 100 / 200 / 300 / 500 ms;
  curves standard / decelerate / accelerate. Enter = decelerate, exit = accelerate,
  errors faster than the rest.
- Watch total media weight on the page — mobile version is required.

## Prototype embed (block 4)

Put the Figma prototype URL in the `data-embed` attribute of `#pp-proto` in
`cases/pap-pay.html`. Until then the slot shows the video fallback / placeholder.

Internal product, data under NDA — use only screens cleared for the portfolio.
