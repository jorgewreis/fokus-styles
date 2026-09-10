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
  const { placement = "bottom", align = "center", offset = 8, padding = 8, fallbackPlacements } = options;

  const referenceRect = referenceEl.getBoundingClientRect();
  const floatingRect = floatingEl.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  const candidates = [...new Set(fallbackPlacements ?? [placement, OPPOSITE_PLACEMENT[placement], "bottom", "top", "right", "left"])]
    .filter(Boolean);
  const placementCandidates = fallbackPlacements ? candidates : candidates.slice(0, 2);
  const finalPlacement = placementCandidates.find((candidate) => fitsPlacement(candidate, referenceRect, floatingRect, offset, viewportWidth, viewportHeight))
    ?? placement;

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

  const crossSize = finalPlacement === "top" || finalPlacement === "bottom" ? floatingRect.width : floatingRect.height;
  const crossStart = finalPlacement === "top" || finalPlacement === "bottom" ? left : top;
  const referenceCenter = finalPlacement === "top" || finalPlacement === "bottom"
    ? referenceRect.left + referenceRect.width / 2
    : referenceRect.top + referenceRect.height / 2;
  const crossOffset = Math.min(Math.max(referenceCenter - crossStart, 8), Math.max(8, crossSize - 8));

  return {
    top: top + window.scrollY,
    left: left + window.scrollX,
    placement: finalPlacement,
    arrowOffset: `${crossOffset}px`,
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
  if (position.arrowOffset) {
    floatingEl.style.setProperty("--fs-popover-arrow-offset", position.arrowOffset);
    floatingEl.style.setProperty("--fs-tooltip-arrow-offset", position.arrowOffset);
  }
}
