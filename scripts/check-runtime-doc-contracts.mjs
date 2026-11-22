import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const contracts = JSON.parse(await fs.readFile(path.join(root, "scripts/runtime-contracts.json"), "utf8"));

function apiSection(markdown, file) {
  const heading = "## API JS";
  const start = markdown.indexOf(heading);
  assert.notEqual(start, -1, `${file} deve ter a seção ${heading}`);
  const content = markdown.slice(start + heading.length);
  const nextHeading = content.search(/\r?\n## /);
  return nextHeading === -1 ? content : content.slice(0, nextHeading);
}

const uniqueNames = new Set();
for (const contract of contracts) {
  assert.ok(!uniqueNames.has(contract.name), `contrato duplicado: ${contract.name}`);
  uniqueNames.add(contract.name);

  const documentation = await fs.readFile(path.join(root, contract.documentation), "utf8");
  const section = apiSection(documentation, contract.documentation);
  assert.ok(documentation.includes(contract.documentedSelector), `${contract.name}: seletor documentado ausente`);
  for (const method of [...contract.api.static, ...contract.api.instance]) {
    assert.ok(section.includes(`${method}(`), `${contract.name}: API ${method} ausente na documentação`);
  }
  for (const event of contract.events) {
    assert.ok(section.includes(`\`${event}\``), `${contract.name}: evento ${event} ausente na documentação`);
  }
  for (const attribute of contract.attributes) {
    assert.ok(section.includes(`\`${attribute}\``), `${contract.name}: atributo ${attribute} ausente na documentação`);
  }
}

const dom = new JSDOM(`<!doctype html><html><body>
  <nav data-fs="navbar"><button data-fs-toggle="navbar">Menu</button><div class="fs-navbar-collapse" hidden></div></nav>
  <ul data-fs="pagination" data-fs-pages="2" data-fs-page="1"><li><button data-fs-page="1">1</button></li><li><button data-fs-page="2">2</button></li></ul>
  <div data-fs="spinner"></div>
  <nav data-fs="scrollspy"><a href="#runtime-contract-section">Seção</a></nav>
  <section id="runtime-contract-section"></section>
  <div id="runtime-contract-results" aria-busy="false"></div>
</body></html>`, { url: "http://localhost" });

const globalNames = ["window", "document", "CustomEvent", "Element", "HTMLElement", "Node", "IntersectionObserver"];
const previousGlobals = new Map(globalNames.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));

try {
  for (const name of globalNames) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      writable: true,
      value: name === "window" ? dom.window : name === "document" ? dom.window.document : dom.window[name],
    });
  }
  Object.defineProperty(document, "readyState", { configurable: true, value: "complete" });

  const runtime = await import("../packages/fokus-js/js/fokus.js");
  for (const contract of contracts) {
    const Component = runtime[contract.export];
    assert.equal(typeof Component, "function", `${contract.name}: export público ausente`);
    for (const method of contract.api.static) {
      assert.equal(typeof Component[method], "function", `${contract.name}: método estático ${method} ausente`);
    }
    for (const method of contract.api.instance) {
      assert.equal(typeof Component.prototype[method], "function", `${contract.name}: método ${method} ausente`);
    }

    const rootElement = document.querySelector(contract.selector);
    assert.ok(rootElement, `${contract.name}: fixture não contém o seletor ${contract.selector}`);
    const instance = Component.getInstance(rootElement);
    assert.ok(instance, `${contract.name}: auto-init não usa ${contract.selector}`);
    const emitted = [];
    for (const event of contract.events) rootElement.addEventListener(event, () => emitted.push(event));

    if (contract.export === "Pagination") {
      instance.goTo(2);
      assert.equal(rootElement.querySelector('[data-fs-page="2"]').getAttribute("aria-current"), "page");
      assert.equal(document.querySelector("#runtime-contract-results").getAttribute("aria-busy"), "false");
    } else if (contract.export === "Spinner") {
      instance.start();
      assert.equal(rootElement.getAttribute("aria-busy"), "true");
      instance.stop();
      assert.equal(rootElement.getAttribute("aria-busy"), "false");
    } else if (contract.export === "Navbar") {
      instance.show();
      rootElement.querySelector(".fs-navbar-collapse").dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      assert.equal(instance.isOpen(), false);
    } else if (contract.export === "Scrollspy") {
      instance.activate(document.querySelector("#runtime-contract-section"));
      assert.equal(rootElement.querySelector("a").classList.contains("is-active"), true);
    }

    assert.deepEqual(emitted, contract.events, `${contract.name}: eventos de runtime divergentes`);
    instance.dispose();
  }

  console.log(`Contratos documentados e runtime validados: ${contracts.map(({ name }) => name).join(", ")}.`);
} finally {
  for (const [name, descriptor] of previousGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  }
  dom.window.close();
}
