function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const heightTransitions = new WeakMap();

export function cancelHeightTransition(el) {
  heightTransitions.get(el)?.cancel();
}

function animateHeight(el, opening, options) {
  cancelHeightTransition(el);
  let frame;
  let timeout;
  let resolve;
  const done = new Promise((finish) => { resolve = finish; });
  const cleanup = () => {
    cancelAnimationFrame(frame);
    clearTimeout(timeout);
    el.removeEventListener("transitionend", handleEnd);
    el.style.removeProperty("height");
    el.style.removeProperty("overflow");
    el.style.removeProperty("transition");
  };
  const state = {
    cancel() {
      cleanup();
      heightTransitions.delete(el);
      resolve(false);
    },
  };
  const finish = () => {
    if (heightTransitions.get(el) !== state) return;
    cleanup();
    if (!opening) el.style.display = "none";
    heightTransitions.delete(el);
    resolve(true);
  };
  const handleEnd = (event) => {
    if (event.target === el && event.propertyName === "height") finish();
  };
  heightTransitions.set(el, state);
  if (opening) el.style.display = "";

  if (prefersReducedMotion()) {
    if (!opening) el.style.display = "none";
    // Keep cancellation possible until callbacks run, even without animation.
    Promise.resolve().then(finish);
    return done;
  }

  const duration = options.duration ?? 200;
  const height = `${el.scrollHeight}px`;
  el.style.overflow = "hidden";
  el.style.height = opening ? "0px" : height;
  el.style.transition = `height ${duration}ms ease`;
  el.addEventListener("transitionend", handleEnd);
  timeout = window.setTimeout(finish, Math.max(450, duration + 50));
  frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(() => {
      if (heightTransitions.get(el) === state) el.style.height = opening ? height : "0px";
    });
  });
  return done;
}

export function collapse(el, options = {}) {
  return animateHeight(el, false, options);
}

export function expand(el, options = {}) {
  return animateHeight(el, true, options);
}

export function onTransitionEnd(el, propertyName) {
  return new Promise((resolve) => {
    const handleEnd = (event) => {
      if (event.target !== el) return;
      if (propertyName && event.propertyName !== propertyName) return;
      el.removeEventListener("transitionend", handleEnd);
      resolve();
    };

    el.addEventListener("transitionend", handleEnd);
  });
}
