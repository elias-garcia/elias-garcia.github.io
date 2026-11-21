// The browser's status bar colour (the theme-color metas), changed for a
// while and put back.
const original = new Map<HTMLMetaElement, string>();

export function tintStatusBar(color: string): void {
  for (const meta of document.querySelectorAll<HTMLMetaElement>(
    'meta[name="theme-color"]',
  )) {
    if (!original.has(meta)) {
      original.set(meta, meta.content);
    }
    meta.content = color;
  }
}

export function restoreStatusBar(): void {
  for (const [meta, color] of original) {
    meta.content = color;
  }
  original.clear();
}
