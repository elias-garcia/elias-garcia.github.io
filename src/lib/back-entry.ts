// The image viewer's history entry: it adds one when it opens, so Back
// closes it, as Back does other full-screen overlays on a phone.

import { isRecord } from "./guards.ts";

function isViewerEntry(state: unknown): boolean {
  return isRecord(state) && state.viewer === true;
}

// `isOpen` and `close` are the viewer's. `opened` and `closed` tell the entry
// what happened to the viewer.
export function backEntry(viewer: {
  isOpen: () => boolean;
  close: () => void;
}): { opened: () => void; closed: () => void } {
  // `owns`: the current entry is the viewer's. `goingBack`: the viewer
  // took its entry back and that Back hasn't landed yet.
  let owns = false;
  let goingBack = false;

  addEventListener("popstate", () => {
    if (goingBack) {
      goingBack = false;
      // Reopened before the Back landed: now add its entry.
      if (viewer.isOpen()) {
        history.pushState({ viewer: true }, "");
        owns = true;
      }
    } else {
      // The visitor went Back (or forward): the entry is no longer ours.
      owns = false;
      if (viewer.isOpen()) {
        viewer.close();
      } else if (isViewerEntry(history.state)) {
        // Forward onto the entry of a viewer that's closed: step off it, or
        // the next Back would do nothing visible.
        goingBack = true;
        history.back();
      }
    }
  });

  return {
    // Reopened before the last close was handled, it keeps that entry; if
    // the last close's Back is still on its way, the new entry waits for it.
    opened: () => {
      if (!owns && !goingBack) {
        history.pushState({ viewer: true }, "");
        owns = true;
      }
    },
    // Closed some other way than Back: take back the history entry, so the
    // next Back leaves the page as expected.
    closed: () => {
      if (owns) {
        owns = false;
        goingBack = true;
        history.back();
      }
    },
  };
}
