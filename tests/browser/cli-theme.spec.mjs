import {test, expect} from "@playwright/test";
import {fileURLToPath} from "node:url";
import {generateThemeCss} from "../../packages/fokus-cli/lib/theme.mjs";
const css = fileURLToPath(new URL("../../dist/css/fokus.css", import.meta.url));
for (const primary of ["#ffffff", "#000000", "#6d28d9", "#fde047", "#777777"]) {
  for (const mode of ["light", "dark", "ancestor-dark"]) {
    test(`CLI brand ${primary} / ${mode}: effective primary text and states`, async ({page}) => {
      const dark = mode === "dark" ? 'data-theme="dark"' : "";
      await page.setContent(`<!doctype html><html ${mode === "ancestor-dark" ? 'data-theme="dark"' : ""}><body><section data-fs-brand="custom" ${dark}><button class="fs-btn fs-btn-primary">Action</button><span class="fs-badge fs-badge-primary">Status</span><button class="fs-btn fs-btn-outline-primary">Outline</button></section></body></html>`);
      await page.addStyleTag({path: css});
      await page.addStyleTag({content: generateThemeCss({name:"custom", primary})});
      const ratio = async selector => page.locator(selector).evaluate(el => {
        const style = getComputedStyle(el);
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext("2d");
        const rgb = color => {ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3);};
        const brightness = Number(style.filter.match(/brightness\(([^)]+)\)/)?.[1] || 1);
        const luminance = color => rgb(color).map(c => Math.min(1,c/255*brightness)).map(c => c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
        const a=luminance(style.color),b=luminance(style.backgroundColor);
        return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      });
      await expect.poll(() => ratio(".fs-btn-primary")).toBeGreaterThanOrEqual(4.5);
      expect(await ratio(".fs-badge-primary")).toBeGreaterThanOrEqual(4.5);
      await page.locator(".fs-btn-primary").hover();
      await expect.poll(() => ratio(".fs-btn-primary")).toBeGreaterThanOrEqual(4.5);
      await page.mouse.down();
      await expect.poll(() => ratio(".fs-btn-primary")).toBeGreaterThanOrEqual(4.5);
      await page.mouse.up();
      await page.locator(".fs-btn-outline-primary").hover();
      await expect.poll(() => ratio(".fs-btn-outline-primary")).toBeGreaterThanOrEqual(4.5);
    });
  }
}
