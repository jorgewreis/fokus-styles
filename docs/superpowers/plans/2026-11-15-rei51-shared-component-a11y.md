# REI-51 Shared Component Accessibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent an already open modal from becoming ARIA-hidden when a second trigger is initialized, and make FileDrop respect native disabled fieldset inheritance.

**Architecture:** Keep both public component APIs unchanged. Each repair delegates state semantics to existing DOM state: the modal's `is-open` class and the platform `:disabled` selector.

**Tech Stack:** ES modules, Vitest, jsdom, Playwright.

**Spec:** Linear REI-51 — UX: Corrigir componentes compartilhados e acessibilidade no Styles.

## Global Constraints

- Preserve `Modal` and `FileDrop` public APIs and existing event behavior.
- Do not alter multi-file handling, focus-trap ownership, or overlay-stack behavior outside the regressions below.
- Use native disabled semantics; do not add `aria-disabled` as a replacement.
- Work from `work/main` in an isolated checkout; do not touch the user's `integration-review/` directory.

## Review Focus

- A second modal trigger created while the shared target is open keeps `aria-hidden="false"`; test in Task 1.
- A modal initialized while closed remains hidden; existing modal setup tests retain this coverage.
- A file input disabled through a fieldset ignores a drop and clears drag styling; test in Task 2.
- A directly disabled input remains blocked; the existing test remains green in Task 2.
- An enabled file input still synchronizes files and dispatches one native change event; the existing test remains green in Task 2.

---

### Task 1: Preserve the open modal accessibility state

**Files:**
- Modify: `packages/fokus-js/js/modal.js:24-26`
- Test: `tests/unit/modal.test.js`

**Interfaces:**
- Consumes: `modalEl.classList.contains("is-open")` and `Modal.show()`.
- Produces: Constructor initialization that does not hide an already open shared modal target.

- [ ] **Step 1: Write the failing two-trigger regression test**

Build two buttons targeting `#myModal`; show the first instance, construct the second, and assert `is-open` plus `aria-hidden === "false"`.

- [ ] **Step 2: Run the focused modal test to verify it fails**

Run: `npm test -- --run tests/unit/modal.test.js`
Expected: FAIL because the second constructor resets `aria-hidden` to `true`.

- [ ] **Step 3: Guard the constructor's initial hidden state in `Modal`**

Set `aria-hidden="true"` only when `modalEl` does not already have `is-open`; retain its role and modal attributes.

- [ ] **Step 4: Run the focused modal test to verify it passes**

Run: `npm test -- --run tests/unit/modal.test.js`
Expected: PASS.

### Task 2: Respect inherited disabled state in FileDrop

**Files:**
- Modify: `packages/fokus-js/js/file-drop.js:64-66`
- Test: `tests/unit/file-drop.test.js`

**Interfaces:**
- Consumes: `HTMLInputElement.matches(":disabled")` and the existing drop event handler.
- Produces: Drops blocked for controls disabled by either the control itself or an ancestor fieldset.

- [ ] **Step 1: Write the failing disabled-fieldset regression test**

Create the input inside `<fieldset disabled>` with its associated label, dispatch a drop, and assert no `change`, no file replacement, and no `is-dragover` class.

- [ ] **Step 2: Run the focused FileDrop test to verify it fails**

Run: `npm test -- --run tests/unit/file-drop.test.js`
Expected: FAIL because `input.disabled` is false for inherited disabled state.

- [ ] **Step 3: Use native disabled matching in `_handleDrop`**

Replace the direct property check with `this.inputEl.matches(":disabled")`; preserve drag-state cleanup before the guard.

- [ ] **Step 4: Run focused and full validation**

Run: `npm test -- --run tests/unit/modal.test.js tests/unit/file-drop.test.js`, then `npm test`.
Expected: PASS.

- [ ] **Step 5: Exercise the changed examples in Chromium**

Run the repository's focused Playwright modal and upload/FileDrop coverage, including keyboard close/focus return and disabled drop behavior.
Expected: no browser-console error and the same accessible state observed in the rendered page.
