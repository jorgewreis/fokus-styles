import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { confirm } from "../../packages/fokus-js/js/confirm.js";
import { Carousel } from "../../packages/fokus-js/js/carousel.js";
import { FileUploadAdvanced } from "../../packages/fokus-js/js/file-upload-advanced.js";
import { NotificationCenter } from "../../packages/fokus-js/js/notification-center.js";
import { Toast } from "../../packages/fokus-js/js/toast.js";
import { Scrollspy } from "../../packages/fokus-js/js/scrollspy.js";
const runtime = { confirm, Carousel, FileUploadAdvanced, NotificationCenter, Toast, Scrollspy };
const read = (id, ext) => readFileSync(`docs/catalog/fixtures/${id}/basic.${ext}`, "utf8");
function run(id) {
  const script = read(id, "js").replace(/^import \{[^}]+\} from "fokus-styles\/js";\n/, "");
  new Function(...Object.keys(runtime), script)(...Object.values(runtime));
}
function mount(id) { document.body.innerHTML = read(id, "html"); run(id); }
const dispose = () => window.dispatchEvent(new Event("pagehide"));
afterEach(() => { dispose(); document.body.innerHTML = ""; vi.restoreAllMocks(); });

it("confirm fixture ignores repeated clicks, cancels, confirms, and cancels pending work on teardown", async () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
  mount("alert-dialog");
  const trigger = document.getElementById("btn-excluir");
  trigger.focus(); trigger.click(); trigger.click();
  expect(document.querySelectorAll(".fs-alert-dialog")).toHaveLength(1);
  document.querySelector('[data-action="cancel"]').click(); await Promise.resolve();
  expect(document.getElementById("confirm-result").textContent).toContain("cancelada");
  expect(document.activeElement).toBe(trigger);
  trigger.click(); document.querySelector('[data-action="confirm"]').click(); await Promise.resolve();
  expect(document.getElementById("confirm-result").textContent).toContain("nenhum dado foi excluído");
  trigger.click(); dispose(); await Promise.resolve();
  expect(document.querySelector(".fs-alert-dialog")).toBeNull();
  trigger.click(); expect(document.querySelector(".fs-alert-dialog")).toBeNull();
  run("alert-dialog"); trigger.click(); expect(document.querySelector(".fs-alert-dialog")).not.toBeNull();
});

it("carousel fixture has local media, keyboard wraparound, inert inactive slides and teardown", () => {
  mount("carousel");
  const root = document.querySelector('[data-fs="carousel"]');
  const instance = Carousel.getInstance(root);
  expect(instance.autoplay).toBe(false);
  expect([...root.querySelectorAll("img")].every(img => img.src.startsWith("data:image/svg+xml,") && img.alt)).toBe(true);
  root.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
  expect(instance.index).toBe(1);
  expect(instance.items[0].hasAttribute("inert")).toBe(true);
  root.querySelector(".fs-carousel-control-next").click(); expect(instance.index).toBe(0);
  dispose(); expect(Carousel.getInstance(root)).toBeUndefined();
  root.querySelector(".fs-carousel-control-next").click(); expect(instance.index).toBe(0);
  run("carousel"); root.querySelector(".fs-carousel-control-next").click();
  expect(Carousel.getInstance(root).index).toBe(1);
});

it("upload fixture lists selected files, labels progress/removal, releases thumbnails and reinitializes", () => {
  const revoke = vi.spyOn(URL, "revokeObjectURL");
  mount("file-upload-advanced");
  const root = document.querySelector('[data-fs="file-upload-advanced"]');
  const input = root.querySelector("input");
  const image = new File(["fake image"], "example.png", { type: "image/png" });
  Object.defineProperty(input, "files", { configurable: true, value: [image] });
  input.dispatchEvent(new Event("change", { bubbles: true }));
  const instance = FileUploadAdvanced.getInstance(root);
  expect(instance.getFiles()).toEqual([image]);
  const id = root.querySelector("[data-file-id]").dataset.fileId;
  instance.setProgress(id, 42);
  expect(root.querySelector('[role="progressbar"]').getAttribute("aria-label")).toBe("Progresso de example.png");
  expect(root.querySelector('[role="progressbar"]').getAttribute("aria-valuenow")).toBe("42");
  instance.setError(id, "Erro demonstrativo"); expect(root.textContent).toContain("Erro demonstrativo");
  root.querySelector('[aria-label="Remover example.png"]').click(); expect(instance.getFiles()).toHaveLength(0);
  input.dispatchEvent(new Event("change")); dispose();
  expect(root.querySelectorAll("[data-file-id]")).toHaveLength(0);
  expect(FileUploadAdvanced.getInstance(root)).toBeUndefined();
  expect(revoke).toHaveBeenCalledTimes(2);
  input.dispatchEvent(new Event("change")); expect(root.querySelectorAll("[data-file-id]")).toHaveLength(0);
  run("file-upload-advanced"); input.dispatchEvent(new Event("change"));
  expect(FileUploadAdvanced.getInstance(root).getFiles()).toHaveLength(1);
});

it("notification fixture adds, reads, clears, closes and cleans up its toast controls", () => {
  mount("notification-center");
  const trigger = document.querySelector('[data-fs="notification-center"]');
  const add = document.getElementById("demo-notification");
  const instance = NotificationCenter.getInstance(trigger);
  add.click(); expect(instance.unreadCount).toBe(1); expect(document.querySelectorAll(".fs-toast")).toHaveLength(1);
  trigger.click(); expect(instance.isOpen).toBe(true); expect(instance.unreadCount).toBe(0);
  expect(document.activeElement).toBe(document.querySelector('[data-notification="clear"]'));
  document.querySelector('[data-notification="clear"]').click(); expect(instance.getAll()).toHaveLength(0);
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  expect(instance.isOpen).toBe(false); expect(document.activeElement).toBe(trigger);
  dispose(); expect(NotificationCenter.getInstance(trigger)).toBeUndefined();
  expect(document.querySelectorAll(".fs-toast")).toHaveLength(0);
  add.click(); expect(instance.getAll()).toHaveLength(0);
  run("notification-center"); add.click(); expect(NotificationCenter.getInstance(trigger).unreadCount).toBe(1);
});

it("scrollspy fixture syncs accessible current location and removes adapter on teardown", () => {
  mount("scrollspy");
  const nav = document.querySelector('[data-fs="scrollspy"]');
  const instance = Scrollspy.getInstance(nav);
  expect(nav.querySelector('[aria-current="location"]').getAttribute("href")).toBe("#introducao");
  instance.activate(document.getElementById("detalhes"));
  expect(nav.querySelectorAll('[aria-current="location"]')).toHaveLength(1);
  expect(nav.querySelector('[aria-current="location"]').getAttribute("href")).toBe("#detalhes");
  dispose(); expect(Scrollspy.getInstance(nav)).toBeUndefined();
  nav.dispatchEvent(new CustomEvent("fs:scrollspy:activate", { detail: { section: document.getElementById("introducao") } }));
  expect(nav.querySelector('[aria-current="location"]').getAttribute("href")).toBe("#detalhes");
  run("scrollspy"); expect(nav.querySelector('[aria-current="location"]').getAttribute("href")).toBe("#introducao");
});
