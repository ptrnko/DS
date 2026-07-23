#!/usr/bin/env bash
# ---------------------------------------------------------------
# Pap-Pay loop encoder — one command per loop, output to spec.
#
#   ./encode.sh <input-video> <output-basename> [poster-seconds]
#
#   ./encode.sh ~/Downloads/toggle.mp4 hierarchy-toggle
#   ./encode.sh ~/Downloads/err.mov state-03 0.8
#
# Produces, next to this script:
#   <basename>.mp4          H.264, universal fallback (Safari/iOS)
#   <basename>.webm         VP9, smaller, loaded first
#   posters/<basename>.jpg  required poster frame
#
# Spec enforced: longest edge <=1600, fps capped at 30, no audio,
# each file <=3 MB (auto-retries at lower quality if over).
# ---------------------------------------------------------------
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAX_BYTES=$((3 * 1024 * 1024))

command -v ffmpeg >/dev/null || { echo "ffmpeg not found (brew install ffmpeg)"; exit 1; }

if [ $# -lt 2 ]; then
  sed -n '2,18p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
  exit 1
fi

SRC="$1"; NAME="$2"; POSTER_AT="${3:-0}"
[ -f "$SRC" ] || { echo "No such file: $SRC"; exit 1; }
mkdir -p "$DIR/posters"

# fit inside 1600x1600, keep aspect, force even dimensions, cap 30fps
VF="scale=w=1600:h=1600:force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2"
FPSCAP=(-fpsmax 30)
ffmpeg -hide_banner -fpsmax 30 -f lavfi -i nullsrc=s=2x2:d=0.1 -frames:v 1 -f null - >/dev/null 2>&1 || FPSCAP=()

size_of() { wc -c < "$1" | tr -d ' '; }
human()   { awk -v b="$1" 'BEGIN{printf "%.0fKB", b/1024}'; }

echo "→ source: $(basename "$SRC")"
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,duration \
  -of default=noprint_wrappers=1 "$SRC" | sed 's/^/   /'

# ---- MP4 (H.264) — retry with higher CRF until under budget ----
for CRF in 22 26 30 34; do
  ffmpeg -y -loglevel error ${FPSCAP[@]+"${FPSCAP[@]}"} -i "$SRC" -an -vf "$VF" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf "$CRF" -preset slow \
    -movflags +faststart "$DIR/$NAME.mp4"
  B=$(size_of "$DIR/$NAME.mp4")
  [ "$B" -le "$MAX_BYTES" ] && { echo "✓ $NAME.mp4  $(human "$B")  (crf $CRF)"; break; }
  echo "  mp4 $(human "$B") over budget, retrying…"
done

# ---- WebM (VP9) — same ----
for CRF in 30 34 38 42; do
  ffmpeg -y -loglevel error ${FPSCAP[@]+"${FPSCAP[@]}"} -i "$SRC" -an -vf "$VF" \
    -c:v libvpx-vp9 -crf "$CRF" -b:v 0 -row-mt 1 -pix_fmt yuv420p \
    -deadline good -cpu-used 2 "$DIR/$NAME.webm"
  B=$(size_of "$DIR/$NAME.webm")
  [ "$B" -le "$MAX_BYTES" ] && { echo "✓ $NAME.webm $(human "$B")  (crf $CRF)"; break; }
  echo "  webm $(human "$B") over budget, retrying…"
done

# ---- Poster frame ----
ffmpeg -y -loglevel error -ss "$POSTER_AT" -i "$SRC" -frames:v 1 \
  -vf "scale=w=1200:h=1200:force_original_aspect_ratio=decrease" \
  -q:v 5 "$DIR/posters/$NAME.jpg"
echo "✓ posters/$NAME.jpg $(human "$(size_of "$DIR/posters/$NAME.jpg")")"

echo
echo "Done. The slot with data-src=\"../assets/pap-pay/$NAME\" now picks these up."
