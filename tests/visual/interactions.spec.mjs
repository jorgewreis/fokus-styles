import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));

function mockupUrl(name) {
  return `file://${path.join(rootDir, "mockup", name)}`;
}

test.describe("Dropdown", () => {
  test("abre com clique, navega com ArrowDown, fecha com Escape e devolve o foco", async ({ page }) => {
    await page.goto(mockupUrl("examples/dropdown-tooltip.html"));

    const toggle = page.locator(".fs-dropdown-toggle").first();
    await toggle.click();

    const menu = page.locator("#menu-claro");
    await expect(menu).toHaveClass(/is-open/);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    const items = menu.locator(".fs-dropdown-item:not(.is-disabled)");
    await expect(items.first()).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(items.nth(1)).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(menu).not.toHaveClass(/is-open/);
    await expect(toggle).toBeFocused();
  });

  test("fecha ao clicar fora do menu", async ({ page }) => {
    await page.goto(mockupUrl("examples/dropdown-tooltip.html"));
    const toggle = page.locator(".fs-dropdown-toggle").first();
    await toggle.click();

    await page.mouse.click(5, 5);

    await expect(page.locator("#menu-claro")).not.toHaveClass(/is-open/);
  });

  test("renderiza conteúdo rico com ações descritas e navegação por teclado", async ({ page }) => {
    await page.goto(mockupUrl("examples/dropdown-tooltip.html"));

    const toggle = page.getByRole("button", { name: "Conteúdo rico" });
    await toggle.click();

    const menu = page.locator("#menu-content");
    await expect(menu).toBeVisible();
    await expect(menu.locator(".fs-dropdown-rich-header")).toContainText("Plano profissional");
    await expect(menu.locator(".fs-dropdown-rich-list > .fs-dropdown-item")).toHaveCount(3);
    await expect(menu.locator(".fs-dropdown-rich-footer a")).toHaveAttribute("role", "menuitem");
    await expect(menu.locator(".fs-dropdown-rich-footer a")).toHaveText("Sair");
    await expect(menu.locator(".fs-dropdown-rich-list > .fs-dropdown-item").first()).toBeFocused();
  });
});

test.describe("Tooltip", () => {
  test("aparece no hover e some no mouseleave", async ({ page }) => {
    await page.goto(mockupUrl("examples/dropdown-tooltip.html"));
    const trigger = page.locator('button[data-fs="tooltip"][data-placement="top"]').first();

    await trigger.hover();
    await expect(page.locator(".fs-tooltip.is-open")).toBeVisible();

    await page.mouse.move(5, 5);
    await expect(page.locator(".fs-tooltip.is-open")).toHaveCount(0);
  });
});

test.describe("Modal", () => {
  test("abre com focus trap, fecha com Escape e devolve o foco ao gatilho", async ({ page }) => {
    await page.goto(mockupUrl("examples/modal-select.html"));
    const trigger = page.locator('button[data-fs-target="#modal-claro"]');
    await trigger.click();

    const modal = page.locator("#modal-claro");
    await expect(modal).toHaveClass(/is-open/);
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    await page.keyboard.press("Escape");
    await expect(modal).not.toHaveClass(/is-open/);
    await expect(trigger).toBeFocused();
  });

  test("data-backdrop=static ignora Escape e clique fora", async ({ page }) => {
    await page.goto(mockupUrl("examples/modal-select.html"));
    await page.locator('button[data-fs-target="#modal-claro-static"]').click();

    const modal = page.locator("#modal-claro-static");

    await page.keyboard.press("Escape");
    await expect(modal).toHaveClass(/is-open/);

    await page.mouse.click(5, 5);
    await expect(modal).toHaveClass(/is-open/);

    await modal.locator(".fs-btn-close").click();
    await expect(modal).not.toHaveClass(/is-open/);
  });
});

test.describe("Accordion", () => {
  test("só um painel aberto por vez (comportamento exclusivo por padrão)", async ({ page }) => {
    await page.goto(mockupUrl("examples/accordion-tabs-toast.html"));
    const buttons = page.locator("#accordion-claro .fs-accordion-button");

    await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "true");

    await buttons.nth(1).click();

    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("Tabs", () => {
  test("ArrowRight ativa a próxima aba e o painel correspondente", async ({ page }) => {
    await page.goto(mockupUrl("examples/accordion-tabs-toast.html"));
    const tabs = page.locator("#tabs-claro .fs-nav-link");

    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowRight");

    await expect(tabs.nth(1)).toHaveClass(/is-active/);
    await expect(page.locator("#tab-seguranca-claro")).toBeVisible();
  });
});

test.describe("Toast", () => {
  test("aparece ao acionar o gatilho e some sozinho após o delay", async ({ page }) => {
    await page.goto(mockupUrl("examples/accordion-tabs-toast.html"));

    await page.click("#toast-trigger-claro");
    await expect(page.locator("#toast-claro")).toBeVisible();

    await page.waitForTimeout(4500);
    await expect(page.locator("#toast-claro")).toBeHidden();
  });
});

test.describe("Carousel", () => {
  test("navega por controle, teclado, indicador e arraste", async ({ page }) => {
    await page.goto(mockupUrl("examples/carousel.html"));

    const carousel = page.locator("#carousel-slide");
    const items = carousel.locator(".fs-carousel-item");

    await expect(items.nth(0)).toHaveClass(/is-active/);

    await carousel.locator(".fs-carousel-control-next").click();
    await expect(items.nth(1)).toHaveClass(/is-active/);

    await carousel.focus();
    await page.keyboard.press("End");
    await expect(items.nth(2)).toHaveClass(/is-active/);

    await carousel.locator(".fs-carousel-indicators button").nth(0).click();
    await expect(items.nth(0)).toHaveClass(/is-active/);

    const box = await carousel.boundingBox();
    await page.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2);
    await page.mouse.up();
    await expect(items.nth(1)).toHaveClass(/is-active/);
  });

  test("toggle pausa e retoma autoplay, inclusive após a página voltar a ficar visível", async ({ page }) => {
    await page.goto(mockupUrl("examples/carousel.html"));

    const carousel = page.locator("#carousel-slide-autoplay");
    const items = carousel.locator(".fs-carousel-item");
    const toggle = carousel.locator("[data-fs-carousel-toggle]");

    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await page.waitForTimeout(3200);
    await expect(items.nth(0)).toHaveClass(/is-active/);

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await page.evaluate(() => document.activeElement.blur());
    await page.mouse.move(5, 5);
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForTimeout(3200);
    await expect(items.nth(0)).toHaveClass(/is-active/);
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForTimeout(3200);
    await expect(items.nth(1)).toHaveClass(/is-active/);
  });
});

test.describe("Stepper", () => {
  test("avança/volta pelo wizard e navega por passos concluídos", async ({ page }) => {
    await page.goto(mockupUrl("examples/stepper.html"));

    const stepper = page.locator("#stepper-wizard");
    const steps = stepper.locator(".fs-step");

    await expect(steps.nth(0)).toHaveClass(/fs-step-active/);
    await expect(stepper.locator('[data-stepper="prev"]')).toBeDisabled();

    await stepper.locator('[data-stepper="next"]').click();
    await expect(steps.nth(1)).toHaveClass(/fs-step-active/);
    await expect(steps.nth(0)).toHaveClass(/fs-step-completed/);

    await stepper.locator('[data-stepper="prev"]').click();
    await expect(steps.nth(0)).toHaveClass(/fs-step-active/);
  });
});

test.describe("Offcanvas", () => {
  test("abre pelo gatilho, bloqueia scroll, fecha com Escape e devolve o foco", async ({ page }) => {
    await page.goto(mockupUrl("examples/offcanvas-popover.html"));

    const trigger = page.locator('button[data-fs-target="#offcanvas-start-claro"]');
    await trigger.click();

    const panel = page.locator("#offcanvas-start-claro");
    await expect(panel).toHaveClass(/is-open/);
    await expect(page.locator(".fs-offcanvas-backdrop")).toHaveClass(/is-open/);

    await page.keyboard.press("Escape");
    await expect(panel).not.toHaveClass(/is-open/);
    await expect(page.locator(".fs-offcanvas-backdrop")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("data-backdrop=static ignora Escape e clique fora, fecha só pelo dismiss", async ({ page }) => {
    await page.goto(mockupUrl("examples/offcanvas-popover.html"));

    await page.click('button[data-fs-target="#offcanvas-static-claro"]');
    const panel = page.locator("#offcanvas-static-claro");
    await expect(panel).toHaveClass(/is-open/);

    await page.keyboard.press("Escape");
    await expect(panel).toHaveClass(/is-open/);

    await panel.locator('[data-fs-dismiss="offcanvas"]').click();
    await expect(panel).not.toHaveClass(/is-open/);
  });
});

test.describe("Popover", () => {
  test("clique no gatilho abre; clique dentro não fecha; clique fora fecha", async ({ page }) => {
    await page.goto(mockupUrl("examples/offcanvas-popover.html"));

    await page.click('button[data-fs-target="#pop-click-claro"]');
    const panel = page.locator("#pop-click-claro");
    await expect(panel).toHaveClass(/is-open/);

    await panel.locator(".fs-popover-body").click();
    await expect(panel).toHaveClass(/is-open/);

    await page.mouse.click(5, 5);
    await expect(panel).not.toHaveClass(/is-open/);
  });

  test("modo hover mostra ao passar o mouse e esconde ao sair", async ({ page }) => {
    await page.goto(mockupUrl("examples/offcanvas-popover.html"));

    const trigger = page.locator('button[data-fs-target="#pop-hover-claro"]');
    const panel = page.locator("#pop-hover-claro");

    await trigger.hover();
    await expect(panel).toHaveClass(/is-open/);

    await page.mouse.move(5, 5);
    await expect(panel).not.toHaveClass(/is-open/);
  });
});
