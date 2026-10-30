import { SassColor } from "sass";

// Gera um preset de marca (data-fs-brand) em CSS puro (color-mix(), sem Sass),
// utilizável por qualquer consumidor independente da toolchain de build —
// mesma fórmula de mistura (pesos) usada internamente em
// packages/fokus-core/scss/themes/_brands.scss, só reimplementada em JS
// pra decidir a cor do texto do botão sólido (branco ou preto) sem exigir
// que o consumidor rode o pipeline Sass do FokusStyles.

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((c) => c + c).join("")
    : normalized;
  const int = parseInt(value, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function linearizeChannel(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * linearizeChannel(r) + 0.7152 * linearizeChannel(g) + 0.0722 * linearizeChannel(b);
}

// Réplica de tools/_mixins.scss#color-contrast: escolhe branco quando o
// contraste com branco já atinge o mínimo, senão cai pra preto.
function pickTextColor(backgroundHex, minContrast = 4.5) {
  const contrastWithWhite = 1.05 / (relativeLuminance(backgroundHex) + 0.05);
  return contrastWithWhite >= minContrast ? "#ffffff" : "#000000";
}

// Sass is already a CLI dependency. Use its color conversion rather than a
// second approximate OKLCH implementation. The emitted CSS stays standalone.
function darkPrimary(hex) {
  const { r, g, b } = hexToRgb(hex);
  const color = new SassColor({ red: r, green: g, blue: b }).toSpace("oklch");
  const mixed = new SassColor({
    lightness: color.channel("lightness") * 0.95 + 0.05,
    chroma: color.channel("chroma") * 0.95,
    hue: color.channel("hue"),
    space: "oklch",
  }).toSpace("rgb").toGamut({ method: "local-minde" });
  return "#" + ["red", "green", "blue"].map(channel =>
    Math.round(mixed.channel(channel)).toString(16).padStart(2, "0")
  ).join("");
}

function stateTokens(primary) {
  return [0.98, 0.95].map((factor, i) => {
    const rgb = hexToRgb(primary);
    const bg = "#" + Object.values(rgb).map(c =>
      Math.round(c * factor).toString(16).padStart(2, "0")
    ).join("");
    const state = i ? "active" : "hover";
    return `  --fs-brand-primary-${state}: ${bg};
  --fs-brand-on-primary-${state}: ${pickTextColor(bg)};`;
  }).join("\n");
}

export function generateThemeCss({ name, primary }) {
  if (typeof name !== "string" || !/^[a-z0-9-]+$/i.test(name)) {
    throw new Error(`Nome de marca inválido: "${name}" (use apenas letras, números e hífen).`);
  }
  if (typeof primary !== "string" || !/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(primary)) {
    throw new Error(`Cor primary inválida: "${primary}" (use #RGB ou #RRGGBB sem transparência, ex.: #6d28d9).`);
  }

  const btnText = pickTextColor(primary);
  const dark = darkPrimary(primary);
  const darkText = pickTextColor(dark);

  return `/* Preset de marca "${name}" gerado por \`fokus theme ${name} --primary ${primary}\`.
 * CSS puro (color-mix()) — mesma fórmula de packages/fokus-core/scss/themes/_brands.scss,
 * sem dependência de Sass. Inclua este arquivo depois do CSS do FokusStyles.
 * Documentação: docs/guides/theming.md#multi-brand
 */
[data-fs-brand="${name}"] {
  --fs-color-primary: ${primary};
  --fs-color-on-primary: ${btnText};
${stateTokens(primary)}
  --fs-alert-primary-bg: color-mix(in oklch, ${primary} 15%, white);
  --fs-alert-primary-text: color-mix(in oklch, ${primary} 50%, black);
  --fs-feedback-primary-bg: color-mix(in oklch, ${primary} 15%, white);
  --fs-btn-color: ${btnText};
  --fs-badge-color: ${btnText};
}

[data-fs-brand="${name}"][data-theme="dark"],
[data-theme="dark"] [data-fs-brand="${name}"] {
  --fs-color-primary: ${dark};
  --fs-color-on-primary: ${darkText};
${stateTokens(dark)}
  --fs-alert-primary-bg: color-mix(in oklch, ${primary} 15%, #1e293b);
  --fs-alert-primary-text: color-mix(in oklch, ${primary} 55%, white);
  --fs-feedback-primary-bg: color-mix(in oklch, ${primary} 15%, #1e293b);
  --fs-btn-color: ${darkText};
  --fs-badge-color: ${darkText};
}

[data-fs-brand="${name}"] .fs-btn-primary:hover,
[data-fs-brand="${name}"].fs-btn-primary:hover {
  --fs-btn-bg: var(--fs-brand-primary-hover);
  --fs-btn-color: var(--fs-brand-on-primary-hover);
  filter: none;
}

[data-fs-brand="${name}"] .fs-btn-primary:active,
[data-fs-brand="${name}"].fs-btn-primary:active {
  --fs-btn-bg: var(--fs-brand-primary-active);
  --fs-btn-color: var(--fs-brand-on-primary-active);
  filter: none;
}

[data-fs-brand="${name}"] .fs-badge-primary,
[data-fs-brand="${name}"].fs-badge-primary {
  --fs-badge-color: var(--fs-color-on-primary);
}
`;
}
