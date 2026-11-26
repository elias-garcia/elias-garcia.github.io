// An entry's photos and its link card's image fill a slot of a row of three
// in the text column, 163px in the full column. On rows too narrow for the
// date column, windows under 484px (the row's 436px wrap plus the page's 24px
// sides), they fill the text column: up to 435px wide, which 880 covers at
// 2×. Up to 40rem an open job's body spans the row, so a slot is a third of
// it.
export const photoImage = {
  widths: [110, 165, 220, 330, 480, 720, 880],
  sizes:
    "(width < 484px) calc(100vw - 3rem), (width < 40rem) calc((100vw - 4rem) / 3), 163px",
} as const;

// A talk photo in the image viewer: the card, at most 840px, or the full
// width of a phone. Widths past the original's are left out, and the
// original's own width added.
export const viewerImage = {
  widths: [840, 1680],
  sizes: "(width < 40rem) 100vw, 840px",
} as const;
