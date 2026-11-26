// Pinch zoom for the image viewer's photos. Panzoom only loads once a photo
// is opened, and only pinch-zooms: one finger moves between photos or drags
// the viewer closed unless the photo is zoomed in.

import type createPanzoom from "@panzoom/panzoom";
import type { PanzoomObject } from "@panzoom/panzoom";

let panzoom: typeof createPanzoom | undefined;
const zooms = new Map<HTMLImageElement, PanzoomObject>();

// Zoom is an extra: if Panzoom can't load (offline, say), photos don't zoom,
// and the next photo opened tries again.
export async function loadZoom(): Promise<void> {
  try {
    panzoom ??= (await import("@panzoom/panzoom")).default;
  } catch {
    // Left for the next try.
  }
}

// Does nothing until Panzoom is in.
export function zoomable(image: HTMLImageElement | undefined): void {
  if (image === undefined || panzoom === undefined || zooms.has(image)) {
    return;
  }
  zooms.set(
    image,
    panzoom(image, {
      minScale: 1,
      maxScale: 4,
      contain: "outside",
      panOnlyWhenZoomed: true,
      cursor: "auto",
      // The stylesheet decides: the card clips a zoomed photo, the phone
      // viewer lets it fill the screen.
      overflow: "",
    }),
  );
}

export function isZoomedIn(image: HTMLImageElement | undefined): boolean {
  return image !== undefined && (zooms.get(image)?.getScale() ?? 1) > 1;
}

export function resetZoom(image: HTMLImageElement | undefined): void {
  if (image !== undefined) {
    zooms.get(image)?.reset({ animate: false });
  }
}

export function clearZooms(): void {
  for (const zoom of zooms.values()) {
    zoom.destroy();
  }
  zooms.clear();
}
