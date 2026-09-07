import { createElement, forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Modal as FokusStylesModal } from "../../fokus-js/js/modal.js";

// Componente-fino: não reimplementa foco/overlay/teclado do Modal (já
// prontos em fokus-styles/js/modal.js) — só instancia a classe vanilla sobre
// o botão-gatilho renderizado pelo React e desfaz a instância no unmount.
// Mesmo contrato de data-fs-target do uso declarativo (docs/components/modal.md),
// só que sem precisar de data-fs="modal" (o React chama `new Modal()` direto
// em vez de depender do auto-init por `data-fs`).
export const ModalTrigger = forwardRef(function ModalTrigger({ target, backdrop, children, ...rest }, ref) {
  const buttonRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    instanceRef.current = new FokusStylesModal(buttonRef.current, { backdrop });
    return () => instanceRef.current?.dispose();
  }, [backdrop]);

  useImperativeHandle(ref, () => ({
    show: () => instanceRef.current?.show(),
    hide: () => instanceRef.current?.hide(),
    toggle: () => instanceRef.current?.toggle(),
  }));

  return createElement("button", { type: "button", ref: buttonRef, "data-fs-target": target, ...rest }, children);
});

export function ModalPanel({ id, className = "", children, ...rest }) {
  return createElement(
    "div",
    { id, className: ["fs-modal", className].filter(Boolean).join(" "), ...rest },
    createElement("div", { className: "fs-modal-dialog" }, createElement("div", { className: "fs-modal-content" }, children)),
  );
}
