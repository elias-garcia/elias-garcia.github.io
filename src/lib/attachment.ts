// Every list row attachment image fills one slot of a row of three in the
// text column: link attachment images, and talk photos wherever the date column fits.
export const attachmentImage = {
  widths: [110, 165, 220, 330],
  sizes: "(width < 40rem) calc((100vw - 4rem) / 3), 165px",
} as const;

// Talk photos fill the text column on rows too narrow for the date column:
// windows under 484px (the row's 436px wrap plus the page's 24px sides), so up
// to 435px wide, which 880 covers at 2×. Elsewhere they fill a slot, 163px in
// the full column.
export const photoImage = {
  widths: [...attachmentImage.widths, 480, 720, 880],
  sizes: "(width < 484px) calc(100vw - 3rem), 163px",
} as const;

// A talk photo in the image viewer: the card, at most 840px, or the full
// width of a phone. Widths past the original's are left out, and the
// original's own width added.
export const viewerImage = {
  widths: [840, 1680],
  sizes: "(width < 40rem) 100vw, 840px",
} as const;
