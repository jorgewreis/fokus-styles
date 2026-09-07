import { createElement, forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Tabs as FokusStylesTabs } from "../../fokus-js/js/tabs.js";

// Diferente de Modal/Dropdown: o Tabs vanilla lê a lista de `.fs-nav-link`
// (com `data-fs-target`) uma vez, na construção — então este wrapper só
// instancia sobre a raiz renderizada pelo React. Limitação conhecida (mesmo
// espírito da nota de _brands.scss): se os filhos mudarem dinamicamente
// depois do mount, a instância não re-escaneia sozinha; troque a `key` do
// componente pra forçar remount quando a lista de abas mudar de verdade.
export const TabList = forwardRef(function TabList({ className = "", children, ...rest }, ref) {
  const rootRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    instanceRef.current = new FokusStylesTabs(rootRef.current);
    return () => instanceRef.current?.dispose();
  }, []);

  useImperativeHandle(ref, () => ({
    show: (tabEl) => instanceRef.current?.show(tabEl),
  }));

  return createElement("div", { ref: rootRef, className: ["fs-tabs", className].filter(Boolean).join(" "), ...rest }, children);
});
