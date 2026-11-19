// Every list row attachment image fills one slot of a row of three in the
// text column: video thumbnails, and talk photos wherever the date column fits.
export const attachmentImage = {
  widths: [110, 165, 220, 330],
  sizes: "(width < 40rem) calc((100vw - 4rem) / 3), 165px",
} as const;

// Talk photos, except on rows too narrow for the date column, where they fill
// the text column: windows under 484px, the row's 436px wrap plus the page's
// 24px sides.
export const photoImage = {
  widths: [...attachmentImage.widths, 480, 720],
  sizes: `(width < 484px) calc(100vw - 3rem), ${attachmentImage.sizes}`,
} as const;

// A talk photo in the image viewer: the card, at most 840px, or the full
// width of a phone. Widths past the original's are left out.
export const viewerImage = {
  widths: [840, 1280, 1680, 2520],
  sizes: "(width < 40rem) 100vw, 840px",
} as const;
