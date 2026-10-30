import { describe, it, expect } from "vitest";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { generateThemeCss } from "../../packages/fokus-cli/lib/theme.mjs";
import { buildCss } from "../../packages/fokus-cli/lib/build.mjs";
import { analyzeFiles, formatReport } from "../../packages/fokus-cli/lib/analyze.mjs";

describe("fokus-cli: theme", () => {
  it.each(["#12345", "#1234567", "#fff8", "#ffffffff", "#ggg", "#12", null, 123, {}])("rejeita cor sem RGB opaco válido: %s", (primary) => {
    expect(() => generateThemeCss({ name: "acme", primary })).toThrow(/#RGB ou #RRGGBB/);
  });

  it.each(["#000", "#fff", "#ABC", "#000000", "#FFFFFF", "#aBcDeF"])("aceita hex RGB: %s", (primary) => {
    expect(generateThemeCss({ name: "acme", primary })).toContain(`--fs-color-primary: ${primary};`);
  });

  it("calcula a mesma cor de texto para RGB curto e expandido", () => {
    for (const [short, full] of [["#fff", "#ffffff"], ["#000", "#000000"], ["#abc", "#aabbcc"]]) {
      const text = css => css.match(/--fs-btn-color: (#[a-f0-9]+);/)[1];
      expect(text(generateThemeCss({ name: "acme", primary: short }))).toBe(text(generateThemeCss({ name: "acme", primary: full })));
    }
  });

  it("gera os dois blocos data-fs-brand (claro/escuro) com a cor primary informada", () => {
    const css = generateThemeCss({ name: "acme", primary: "#2563eb" });

    expect(css).toContain('[data-fs-brand="acme"]');
    expect(css).toContain('[data-fs-brand="acme"][data-theme="dark"]');
    expect(css).toContain("--fs-color-primary: #2563eb;");
    expect(css).toContain("color-mix(in oklch, #2563eb 15%, white)");
  });

  it("escolhe texto de botão branco para um primary escuro e preto para um primary claro", () => {
    const dark = generateThemeCss({ name: "dark-brand", primary: "#1d4e89" });
    const light = generateThemeCss({ name: "light-brand", primary: "#fde047" });

    expect(dark).toContain("--fs-btn-color: #ffffff;");
    expect(light).toContain("--fs-btn-color: #000000;");
    expect(light).toContain("--fs-color-on-primary: #000000;");
    expect(light).toContain('[data-theme="dark"] [data-fs-brand="light-brand"]');
    expect(light).toContain("--fs-badge-color: var(--fs-color-on-primary);");
  });

  it.each(["#fff", "#000", "#777777", "#747474", "#6d28d9", "#fde047"])("mantém pares gerados AA em claro, escuro e estados: %s", primary => {
    const css = generateThemeCss({ name: "acme", primary });
    const luminance = hex => {
      const normalized = hex.length === 4 ? "#" + [...hex.slice(1)].map(c => c+c).join("") : hex;
      return [1,3,5].map(i => parseInt(normalized.slice(i,i+2),16)/255)
        .map(c => c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4)
        .reduce((sum,c,i) => sum+c*[.2126,.7152,.0722][i],0);
    };
    for (const block of css.split("}").slice(0, 2)) {
      for (const [background, foreground] of [
        ["color-primary", "color-on-primary"],
        ["brand-primary-hover", "brand-on-primary-hover"],
        ["brand-primary-active", "brand-on-primary-active"],
      ]) {
        const token = name => block.match(new RegExp("--fs-" + name + ": (#[a-fA-F0-9]+);"))[1];
        const a = luminance(token(background)), b = luminance(token(foreground));
        expect((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("rejeita nome de marca ou cor inválidos", () => {
    expect(() => generateThemeCss({ name: "acme brand", primary: "#2563eb" })).toThrow();
    expect(() => generateThemeCss({ name: "acme", primary: "azul" })).toThrow();
  });
});

describe("fokus-cli: build", () => {
  it("compila um entry .scss simples para CSS expandido com sourcemap", async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "fokus-cli-build-"));
    const entry = path.join(tmpDir, "entry.scss");
    const out = path.join(tmpDir, "out.css");

    await fs.writeFile(entry, ".foo { color: red; &:hover { color: blue; } }");

    const { outPath, mapPath } = await buildCss({ entry, out });
    const css = await fs.readFile(outPath, "utf8");

    expect(css).toContain(".foo");
    expect(css).toContain("color: red");
    expect(await fs.readFile(mapPath, "utf8")).toContain('"version"');

    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("minifica quando --minify é passado (sem quebras de linha extras)", async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "fokus-cli-build-min-"));
    const entry = path.join(tmpDir, "entry.scss");
    const out = path.join(tmpDir, "out.min.css");

    await fs.writeFile(entry, ".foo { color: red; }");

    const { outPath } = await buildCss({ entry, out, minify: true });
    const css = await fs.readFile(outPath, "utf8");

    expect(css.split("\n").length).toBeLessThanOrEqual(3);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });
});

describe("fokus-cli: analyze", () => {
  it("mede tamanho bruto e gzip de um arquivo", async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "fokus-cli-analyze-"));
    const file = path.join(tmpDir, "sample.css");
    await fs.writeFile(file, ".foo { color: red; }".repeat(50));

    const [result] = await analyzeFiles([file]);

    expect(result.bytes).toBeGreaterThan(0);
    expect(result.gzipBytes).toBeGreaterThan(0);
    expect(result.gzipBytes).toBeLessThan(result.bytes);

    const report = formatReport([result]);
    expect(report).toContain("sample.css".slice(0, 10));

    await fs.rm(tmpDir, { recursive: true, force: true });
  });
});
