const OPPOSITE_PLACEMENT = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function fitsPlacement(placement, referenceRect, floatingRect, offset, viewportWidth, viewportHeight) {
  switch (placement) {
    case "top":
      return referenceRect.top - floatingRect.height - offset >= 0;
    case "bottom":
      return referenceRect.bottom + floatingRect.height + offset <= viewportHeight;
    case "left":
      return referenceRect.left - floatingRect.width - offset >= 0;
    case "right":
      return referenceRect.right + floatingRect.width + offset <= viewportWidth;
    default:
      return true;
  }
}

function alignCrossAxis(align, referenceStart, referenceSize, floatingSize) {
  switch (align) {
    case "start":
      return referenceStart;
    case "end":
      return referenceStart + referenceSize - floatingSize;
    default:
      return referenceStart + (referenceSize - floatingSize) / 2;
  }
}

export function computePosition(referenceEl, floatingEl, options = {}) {
  const { placement = "bottom", align = "center", offset = 8, padding = 8 } = options;

  const referenceRect = referenceEl.getBoundingClientRect();
  const floatingRect = floatingEl.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  let finalPlacement = placement;

  if (
    !fitsPlacement(placement, referenceRect, floatingRect, offset, viewportWidth, viewportHeight) &&
    fitsPlacement(OPPOSITE_PLACEMENT[placement], referenceRect, floatingRect, offset, viewportWidth, viewportHeight)
  ) {
    finalPlacement = OPPOSITE_PLACEMENT[placement];
  }

  let top;
  let left;

  if (finalPlacement === "top" || finalPlacement === "bottom") {
    top =
      finalPlacement === "top"
        ? referenceRect.top - floatingRect.height - offset
        : referenceRect.bottom + offset;
    left = alignCrossAxis(align, referenceRect.left, referenceRect.width, floatingRect.width);
  } else {
    left =
      finalPlacement === "left"
        ? referenceRect.left - floatingRect.width - offset
        : referenceRect.right + offset;
    top = alignCrossAxis(align, referenceRect.top, referenceRect.height, floatingRect.height);
  }

  const maxLeft = Math.max(padding, viewportWidth - floatingRect.width - padding);
  const maxTop = Math.max(padding, viewportHeight - floatingRect.height - padding);
  left = Math.min(Math.max(left, padding), maxLeft);
  top = Math.min(Math.max(top, padding), maxTop);

  return {
    top: top + window.scrollY,
    left: left + window.scrollX,
    placement: finalPlacement,
  };
}

// Mantém overlays alinhados quando o viewport ou o próprio conteúdo muda.
// O ResizeObserver é opcional para preservar compatibilidade com navegadores
// que não o implementam; scroll/resize continuam cobrindo o caso básico.
export function watchPosition(referenceEl, floatingEl, options = {}) {
  const update = () => applyPosition(floatingEl, computePosition(referenceEl, floatingEl, options));
  let frame = null;
  const schedule = () => {
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      update();
    });
  };

  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("scroll", schedule, { passive: true, capture: true });
  const observer = typeof ResizeObserver === "function" ? new ResizeObserver(schedule) : null;
  observer?.observe(referenceEl);
  observer?.observe(floatingEl);

  return () => {
    window.removeEventListener("resize", schedule);
    window.removeEventListener("scroll", schedule, true);
    if (frame !== null) cancelAnimationFrame(frame);
    observer?.disconnect();
  };
}

export function applyPosition(floatingEl, position) {
  floatingEl.style.position = "absolute";
  floatingEl.style.top = `${position.top}px`;
  floatingEl.style.left = `${position.left}px`;
}
