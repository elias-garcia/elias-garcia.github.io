// The image viewer fades out when it closes (DESIGN.md §3). Where a closing
// element can stay in the top layer until its fade is done (`overlay` and a
// `display` transition), CSS does it alone. Elsewhere (Safari, Firefox) the
// element fades out while it's still open (`data-closing`), and closes
// afterwards.

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

const closing = new WeakSet<HTMLElement>();

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
  closing.add(element);
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
  closing.delete(element);
  close();
  delete element.dataset.closing;
}

export function isClosing(element: HTMLElement): boolean {
  return closing.has(element);
}
