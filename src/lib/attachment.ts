// Every list row attachment image fills one slot of a row of three in the
// text column, so photos and video thumbnails share these.
export const attachmentImage = {
  widths: [110, 165, 220, 330],
  sizes: "(width < 40rem) calc((100vw - 4rem) / 3), 165px",
} as const;
