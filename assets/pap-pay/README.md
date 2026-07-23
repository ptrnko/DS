# Pap-Pay — media assets

Motion-first case. Almost every slot on `cases/pap-pay.html` is a looping video
or the one live prototype embed. Drop finished media here and the slots pick it
up automatically — no HTML edits needed.

## How to add a loop

One command per loop. It encodes mp4 + webm + poster and enforces the spec
(longest edge ≤1600, fps capped at 30, no audio, every file ≤3 MB — it retries
at lower quality if it goes over):

```bash
./encode.sh <input-video> <output-basename> [poster-seconds]
```

```bash
./encode.sh ~/Downloads/toggle.mp4 hierarchy-toggle
./encode.sh ~/Downloads/error.mov state-03 0.8
```

The basename must match the slot's `data-src` — that's the whole wiring.
Needs ffmpeg (`brew install ffmpeg`).

## What's still missing

| Block | Basename | Status |
|-------|----------|--------|
| 1 · Cover | `cover-loop` | ✅ done — 6.0s, mp4 1.1 MB + webm 779 KB + poster |
| 3 · Main | `hierarchy-toggle` | ⬜ USD ↔ Crypto switch, autoplay loop |
| 4 · Send flow | `send-flow` | ⬜ video fallback **and/or** live Figma embed |
| 5 · States | `state-01` … `state-06` | ⬜ short 2–3s loops |

Captions currently on the six state slots (rename/reorder freely in the HTML):
empty balance · rate refresh · error · pending on chain · mascot reassure ·
mascot alert.

### Live prototype (block 4)

Put the Figma prototype URL into `data-embed` on `#pp-proto` in
`cases/pap-pay.html`. Behaviour:

- `data-embed` set → live iframe embed
- `data-embed` empty + `send-flow.*` present → video fallback plays
- neither → labelled placeholder stays

A Figma embed does **not** autoplay, which is why the fallback exists.

### Copy still to write

- Block 2 → the **Process** cell (currently `—`)
- Block 6 → the **reflection** paragraph (currently `—`)
- Block 6 → design-system tile `href` (currently `#`) → link to the DS case

## Hard constraints

- Autoplay only via `<video autoplay loop muted playsinline>` with mp4 + webm.
- Each loop ≤3 MB, 30 fps, poster frame mandatory.
- Motion derives from system tokens: durations 100 / 200 / 300 / 500 ms;
  curves standard / decelerate / accelerate. Enter = decelerate,
  exit = accelerate, errors faster than the rest.
- Watch total page media weight — the mobile version is required.

Internal product, data under NDA — use only screens cleared for the portfolio.
The case is behind a soft WIP password gate (client-side, not real security).
