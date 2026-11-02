import { createElement, forwardRef, useEffect, useLayoutEffect, useImperativeHandle, useRef } from "react";
import { Dropdown as FokusStylesDropdown } from "../../fokus-js/js/dropdown.js";

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Mesmo padrão de Modal.js: instancia a classe vanilla sobre o
// botão-gatilho renderizado pelo React, sem reimplementar
// posicionamento/teclado/clique-fora (já prontos em fokus-styles/js/dropdown.js).
export const DropdownTrigger = forwardRef(function DropdownTrigger({ target, placement, align, className = "", children, ...rest }, ref) {
  const buttonRef = useRef(null);
  const instanceRef = useRef(null);

  // The vanilla menu is reparented: restore it before React removes its DOM.
  useBrowserLayoutEffect(() => {
    instanceRef.current = new FokusStylesDropdown(buttonRef.current, { placement, align });
    const instance = instanceRef.current;
    return () => {
      instance.dispose();
      instanceRef.current = null;
    };
  }, [target, placement, align]);

  useImperativeHandle(ref, () => ({
    show: () => instanceRef.current?.show(),
    hide: () => instanceRef.current?.hide(),
    toggle: () => instanceRef.current?.toggle(),
  }));

  return createElement(
    "button",
    {
      type: "button",
      ref: buttonRef,
      className: ["fs-dropdown-toggle", className].filter(Boolean).join(" "),
      "data-fs-target": target,
      ...rest,
    },
    children,
  );
});

export function DropdownMenu({ id, className = "", children, ...rest }) {
  return createElement("div", { id, className: ["fs-dropdown-menu", className].filter(Boolean).join(" "), ...rest }, children);
}
