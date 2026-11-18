// Dialogs and popovers fade out when they close (DESIGN.md §2.5, overlays).
// Where a closing element can stay in the top layer until its fade is done
// (`overlay` and a `display` transition), CSS does it alone. Elsewhere (Safari,
// Firefox) the element fades out while it's still open (`data-closing`), and
// closes afterwards.

let cssFadesOut: boolean | undefined;

// A browser with `overlay` must also really transition `display` (Firefox
// once claimed `allow-discrete` without doing it), so that's checked too.
function canFadeOutInCss(): boolean {
  if (cssFadesOut !== undefined) {
    return cssFadesOut;
  }
  if (!CSS.supports("overlay", "auto")) {
    cssFadesOut = false;
    return cssFadesOut;
  }
  const probe = document.createElement("div");
  probe.style.cssText =
    "transition: display 1s allow-discrete !important; display: block;";
  document.body.append(probe);
  // Reading the style first gives the transition a state to start from.
  const before = getComputedStyle(probe).display;
  probe.style.display = "none";
  const held =
    before === "block" && getComputedStyle(probe).display === "block";
  probe.remove();
  cssFadesOut = held;
  return cssFadesOut;
}

const closing = new WeakMap<HTMLElement, object>();

export async function closeTopLayer(
  element: HTMLElement,
  close: () => void,
): Promise<void> {
  if (canFadeOutInCss()) {
    close();
    return;
  }
  if (closing.has(element)) {
    return;
  }
  const attempt = {};
  closing.set(element, attempt);
  element.dataset.closing = "";
  await Promise.allSettled(
    element
      .getAnimations()
      .filter(
        (animation) =>
          animation instanceof CSSTransition &&
          animation.transitionProperty === "opacity",
      )
      .map((animation) => animation.finished),
  );
  // Opened again during the fade: it stays open.
  if (closing.get(element) === attempt) {
    closing.delete(element);
    close();
    delete element.dataset.closing;
  }
}

// For an element opened again while it fades out.
export function stopClosing(element: HTMLElement): void {
  closing.delete(element);
  delete element.dataset.closing;
}

export function isClosing(element: HTMLElement): boolean {
  return closing.has(element);
}

// Esc, a click outside (`closedby="any"`) and Android's Back fade out too.
// Browsers only let a page hold back a close request after a user action, so
// without one the dialog closes at once.
export function fadeOnCloseRequests(dialog: HTMLDialogElement): void {
  dialog.addEventListener("cancel", (event) => {
    if (event.cancelable && !canFadeOutInCss()) {
      event.preventDefault();
      void closeTopLayer(dialog, () => {
        dialog.close();
      });
    }
  });
}
