import path from "node:path";
import fs from "node:fs/promises";
import * as sass from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

// Compila um entry-point .scss de um projeto consumidor (que importe
// `fokus-styles/scss` ou qualquer outro pacote Sass) usando o mesmo pipeline
// do build interno do FokusStyles (sass -> autoprefixer -> cssnano opcional),
// sem exigir que o consumidor monte a própria toolchain.
export async function buildCss({ entry, out, minify = false, loadPaths = [] }) {
  const entryPath = path.resolve(entry);
  const outPath = path.resolve(out);

  const compiled = sass.compile(entryPath, {
    loadPaths: [...loadPaths, path.join(process.cwd(), "node_modules")],
    sourceMap: true,
    sourceMapIncludeSources: true,
    style: "expanded",
  });

  const plugins = minify ? [autoprefixer, cssnano] : [autoprefixer];
  const result = await postcss(plugins).process(compiled.css, {
    from: entryPath,
    to: outPath,
    map: { prev: compiled.sourceMap, inline: false },
  });

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, `${result.css}\n/*# sourceMappingURL=${path.basename(outPath)}.map */\n`);
  await fs.writeFile(`${outPath}.map`, JSON.stringify(result.map));

  return { outPath, mapPath: `${outPath}.map` };
}
