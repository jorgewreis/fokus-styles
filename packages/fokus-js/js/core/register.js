export function createInstanceRegistry() {
  const instances = new WeakMap();

  return {
    get(el) {
      return instances.get(el);
    },
    set(el, instance) {
      instances.set(el, instance);
    },
    delete(el) {
      instances.delete(el);
    },
  };
}

export function autoInit(name, Ctor, options = {}) {
  if (typeof document === "undefined") return;

  const selector = options.selector ?? `[data-fs="${name}"]`;

  const init = () => {
    document.querySelectorAll(selector).forEach((el) => {
      if (!Ctor.getInstance(el)) new Ctor(el);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
