import { afterEach, expect, it } from "vitest";
import { Pagination } from "../../packages/fokus-js/js/pagination.js";
import { Tabs } from "../../packages/fokus-js/js/tabs.js";
import { FormValidation } from "../../packages/fokus-js/js/form-validation.js";
import { Scrollspy } from "../../packages/fokus-js/js/scrollspy.js";
const $ = (s) => document.querySelector(s);
const instances = [];
const track = (i) => { instances.push(i); return i; };
afterEach(() => { instances.splice(0).forEach((i) => i.dispose()); document.body.innerHTML = ""; });
it("Pagination ignores disabled links and styles the page item", () => {
  document.body.innerHTML = '<ul data-fs-pages="3"><li class="fs-page-item"><a data-fs-page="1">1</a></li><li class="fs-page-item is-disabled"><a data-fs-page="2" aria-disabled="true">2</a></li><li class="fs-page-item"><a data-fs-page="3">3</a></li></ul>';
  const c = track(new Pagination($("ul")));
  $('[data-fs-page="2"]').click();
  expect(c.current).toBe(1);
  expect($(".fs-page-item.is-active a").textContent).toBe("1");
  $('[data-fs-page="3"]').click();
  expect(c.current).toBe(3);
  expect($(".fs-page-item.is-active a").textContent).toBe("3");
  expect($('[data-fs-page="1"]').hasAttribute("aria-current")).toBe(false);
});
it.each(["vertical", "horizontal"])("Tabs use orientation-specific arrows (%s)", (orientation) => {
  document.body.innerHTML = '<div aria-orientation="'+orientation+'"><button class="fs-nav-link is-active" data-fs-target="#one">One</button><button class="fs-nav-link" data-fs-target="#two">Two</button></div><section id="one"></section><section id="two"></section>';
  track(new Tabs($("div")));
  const one = $("button"); one.focus();
  one.dispatchEvent(new KeyboardEvent("keydown", { key: orientation === "vertical" ? "ArrowRight" : "ArrowDown", bubbles: true }));
  expect(document.activeElement).toBe(one);
  one.dispatchEvent(new KeyboardEvent("keydown", { key: orientation === "vertical" ? "ArrowDown" : "ArrowRight", bubbles: true }));
  expect(document.activeElement.textContent).toBe("Two");
  expect($("#two").hidden).toBe(false);
});
it("FormValidation marks invalid optional email and clears its state after correction", () => {
  document.body.innerHTML = '<form><input type="email" value="invalid"><input disabled required></form>';
  const c = track(new FormValidation($("form")));
  const event = new Event("submit", { cancelable: true });
  expect(c.validate(event)).toBe(false);
  expect(event.defaultPrevented).toBe(true);
  expect($("input").getAttribute("aria-invalid")).toBe("true");
  $("input").value = "test@example.com";
  expect(c.validate(new Event("submit", { cancelable: true }))).toBe(true);
  expect($("input").getAttribute("aria-invalid")).toBe("false");
});
it("Scrollspy tolerates placeholder hashes and CSS-special IDs", () => {
  document.body.innerHTML = '<nav><a href="#">Top</a><a href="#s:1">Section</a><a href="#missing">Missing</a></nav><section id="s:1"></section>';
  const c = track(new Scrollspy($("nav")));
  expect(c.sections).toEqual([$("section")]);
  c.activate($("section"));
  expect($("a.is-active").textContent).toBe("Section");
});
