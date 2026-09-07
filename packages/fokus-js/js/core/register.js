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

export function autoInit(name, Ctor) {
  if (typeof document === "undefined") return;

  const init = () => {
    document.querySelectorAll(`[data-fs="${name}"]`).forEach((el) => {
      if (!Ctor.getInstance(el)) new Ctor(el);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
