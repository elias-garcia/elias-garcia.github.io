// Opening and closing the image viewer, the photo travels between its
// thumbnail and the frame: one view transition name, passed from one to the
// other as the page changes. Without view transitions, or with reduced
// motion, nothing travels.

const travelName = "viewer-photo";

let travel: ViewTransition | undefined;
// The photos the current travel has named.
let travelling: HTMLImageElement[] = [];

export function canTravel(): boolean {
  return (
    "startViewTransition" in document &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function skipTravel(): void {
  travel?.skipTransition();
}

export function isTravellingBack(): boolean {
  return document.documentElement.dataset.viewerTravel === "closing";
}

// `change` makes the page's change and returns the photo that takes over
// the name. The header reads `data-viewer-travel` to stay part of the page.
export function travelBetween(
  from: HTMLImageElement,
  change: () => HTMLImageElement | undefined,
  closing: boolean,
): void {
  travel?.skipTransition();
  const root = document.documentElement;
  root.dataset.viewerTravel = closing ? "closing" : "opening";
  from.style.viewTransitionName = travelName;
  const named = [from];
  const transition = document.startViewTransition(async () => {
    from.style.removeProperty("view-transition-name");
    const to = change();
    if (to !== undefined) {
      named.push(to);
      to.style.viewTransitionName = travelName;
      // Drawn before the transition shows it.
      await to.decode().catch(() => undefined);
    }
  });
  travel = transition;
  travelling = named;
  // A travel cut short by a newer one leaves the names that one uses: the
  // newer one may have named the same photo already.
  const done = () => {
    const current = travel === transition;
    for (const photo of named) {
      if (current || !travelling.includes(photo)) {
        photo.style.removeProperty("view-transition-name");
      }
    }
    if (current) {
      travel = undefined;
      travelling = [];
      delete root.dataset.viewerTravel;
    }
  };
  void transition.finished.then(done, done);
}
