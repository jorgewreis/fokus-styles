import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();
const interactiveSelector = "a, button, input, select, textarea, label, [contenteditable='true']";

export class Carousel {
  constructor(carouselEl) {
    this.carouselEl = carouselEl;
    this.inner = carouselEl.querySelector(".fs-carousel-inner");
    this.items = Array.from(carouselEl.querySelectorAll(".fs-carousel-item"));
    this.indicators = Array.from(carouselEl.querySelectorAll(".fs-carousel-indicators button"));
    this.prevBtn = carouselEl.querySelector(".fs-carousel-control-prev");
    this.nextBtn = carouselEl.querySelector(".fs-carousel-control-next");
    this.toggleBtn = carouselEl.querySelector("[data-fs-carousel-toggle]");
    this.counterEl = carouselEl.querySelector("[data-fs-carousel-counter]");
    this.progressEl = carouselEl.querySelector("[data-fs-carousel-progress]");

    this.interval = Number(carouselEl.getAttribute("data-interval")) || 5000;
    this.autoplay = carouselEl.getAttribute("data-autoplay") === "true";
    this.dragEnabled = carouselEl.getAttribute("data-drag") !== "false";
    this.timer = null;
    this.userPaused = false;
    this.isHovering = false;
    this.isFocusWithin = false;
    this.drag = null;
    this.isStatic = this.items.length < 2;
    this.index = Math.max(this.items.findIndex((item) => item.classList.contains("is-active")), 0);

    carouselEl.setAttribute("role", "group");
    carouselEl.setAttribute("aria-roledescription", "carousel");
    carouselEl.classList.toggle("is-static", this.isStatic);
    carouselEl.classList.toggle("is-two-slides", this.items.length === 2);
    if (!this.isStatic && !carouselEl.hasAttribute("tabindex")) {
      carouselEl.setAttribute("tabindex", "0");
      this.managesTabindex = true;
    }

    this._render();

    this._handlePrev = () => this.prev();
    this._handleNext = () => this.next();
    this._handleToggle = () => (this.userPaused ? this.play() : this.pause());
    this._handleIndicator = (event) => {
      const index = this.indicators.indexOf(event.currentTarget);
      if (index !== -1) this.goTo(index);
    };
    this._handleKeydown = this._handleKeydown.bind(this);
    this._handlePointerDown = this._handlePointerDown.bind(this);
    this._handlePointerMove = this._handlePointerMove.bind(this);
    this._handlePointerEnd = this._handlePointerEnd.bind(this);
    this._handleVisibilityChange = this._handleVisibilityChange.bind(this);
    this._handleMouseEnter = () => {
      this.isHovering = true;
      this._syncAutoplay();
    };
    this._handleMouseLeave = () => {
      this.isHovering = false;
      this._syncAutoplay();
    };
    this._handleFocusIn = () => {
      this.isFocusWithin = true;
      this._syncAutoplay();
    };
    this._handleFocusOut = () => {
      queueMicrotask(() => {
        this.isFocusWithin = carouselEl.contains(document.activeElement);
        this._syncAutoplay();
      });
    };

    this.prevBtn?.addEventListener("click", this._handlePrev);
    this.nextBtn?.addEventListener("click", this._handleNext);
    this.toggleBtn?.addEventListener("click", this._handleToggle);
    this.indicators.forEach((btn) => btn.addEventListener("click", this._handleIndicator));
    carouselEl.addEventListener("keydown", this._handleKeydown);
    carouselEl.addEventListener("pointerdown", this._handlePointerDown);
    carouselEl.addEventListener("pointermove", this._handlePointerMove);
    carouselEl.addEventListener("pointerup", this._handlePointerEnd);
    carouselEl.addEventListener("pointercancel", this._handlePointerEnd);
    carouselEl.addEventListener("mouseenter", this._handleMouseEnter);
    carouselEl.addEventListener("mouseleave", this._handleMouseLeave);
    carouselEl.addEventListener("focusin", this._handleFocusIn);
    carouselEl.addEventListener("focusout", this._handleFocusOut);
    document.addEventListener("visibilitychange", this._handleVisibilityChange);

    instances.set(carouselEl, this);
    this._syncAutoplay();
  }

  static getInstance(el) {
    return instances.get(el);
  }

  static getOrCreateInstance(el) { return this.getInstance(el) ?? new Carousel(el); }
  static next(el) { return this.getOrCreateInstance(el).next(); }
  static prev(el) { return this.getOrCreateInstance(el).prev(); }
  static goTo(el, index) { return this.getOrCreateInstance(el).goTo(index); }

  _isDocumentVisible() {
    return document.visibilityState !== "hidden";
  }

  _isTemporarilyPaused() {
    return this.isHovering || this.isFocusWithin || !this._isDocumentVisible() || Boolean(this.drag);
  }

  _isAutoplayEnabled() {
    return this.autoplay && !this.isStatic && !this.userPaused && !this._isTemporarilyPaused();
  }

  _syncAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this._isAutoplayEnabled()) this.timer = setInterval(() => this.next(), this.interval);
    this._syncAutoplayA11y();
  }

  _syncAutoplayA11y() {
    if (this.inner) this.inner.setAttribute("aria-live", this.timer ? "off" : "polite");
    this.carouselEl.classList.toggle(
      "is-autoplay-paused",
      this.autoplay && !this.isStatic && !this.timer,
    );
    if (this.progressEl) {
      this.progressEl.style.setProperty("--fs-carousel-progress-duration", `${this.interval}ms`);
      this.progressEl.classList.remove("is-running");
      if (this.timer) {
        void this.progressEl.offsetWidth;
        this.progressEl.classList.add("is-running");
      }
    }
    if (!this.toggleBtn) return;

    const isPlaying = this.autoplay && !this.userPaused && !this.isStatic;
    this.toggleBtn.disabled = !this.autoplay || this.isStatic;
    this.toggleBtn.setAttribute("aria-pressed", String(isPlaying));
    this.toggleBtn.setAttribute(
      "aria-label",
      isPlaying ? "Pausar reprodução automática" : "Reproduzir reprodução automática",
    );
  }

  _render() {
    if (this.inner && !this.carouselEl.classList.contains("fs-carousel-fade")) {
      this.inner.style.transform = `translate3d(-${this.index * 100}%, 0, 0)`;
    }

    this.items.forEach((item, index) => {
      item.classList.toggle("is-active", index === this.index);
      item.setAttribute("aria-hidden", String(index !== this.index));
      item.toggleAttribute("inert", index !== this.index);
    });
    this.indicators.forEach((btn, index) => {
      btn.classList.toggle("is-active", index === this.index);
      btn.setAttribute("aria-current", String(index === this.index));
    });
    if (this.counterEl) this.counterEl.textContent = `${this.index + 1} de ${this.items.length}`;
    this._syncAutoplayA11y();
  }

  _goToIndex(nextIndex) {
    const count = this.items.length;
    if (count < 2) return;

    const from = this.index;
    const to = ((nextIndex % count) + count) % count;
    if (to === from) return;

    this.index = to;
    this._render();
    this.carouselEl.dispatchEvent(
      new CustomEvent("fs:shown", { bubbles: true, detail: { from, to } }),
    );
    this.carouselEl.dispatchEvent(
      new CustomEvent("fs:carousel:slid", { bubbles: true, detail: { from, to } }),
    );
  }

  next() {
    this._goToIndex(this.index + 1);
  }

  prev() {
    this._goToIndex(this.index - 1);
  }

  goTo(index) {
    this._goToIndex(index);
  }

  pause() {
    if (!this.autoplay) return;
    this.userPaused = true;
    this._syncAutoplay();
  }

  play() {
    if (!this.autoplay || this.isStatic) return;
    this.userPaused = false;
    this._syncAutoplay();
  }

  _handleKeydown(event) {
    if (event.target !== this.carouselEl) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      this.next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.prev();
    } else if (event.key === "Home") {
      event.preventDefault();
      this.goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      this.goTo(this.items.length - 1);
    }
  }

  _handlePointerDown(event) {
    if (!this.dragEnabled || this.isStatic || this.carouselEl.classList.contains("fs-carousel-fade")) return;
    if (event.isPrimary === false || (event.pointerType === "mouse" && event.button !== 0)) return;
    if (event.target.closest?.(interactiveSelector)) return;

    this.drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, deltaX: 0, horizontal: false };
    try {
      this.carouselEl.setPointerCapture?.(event.pointerId);
    } catch {
      // Alguns ambientes de teste não implementam pointer capture.
    }
    this._syncAutoplay();
  }

  _handlePointerMove(event) {
    if (!this.drag || event.pointerId !== this.drag.id) return;
    const deltaX = event.clientX - this.drag.startX;
    const deltaY = event.clientY - this.drag.startY;

    if (!this.drag.horizontal) {
      if (Math.abs(deltaY) > 8 && Math.abs(deltaY) >= Math.abs(deltaX)) {
        this._clearDrag();
        return;
      }
      if (Math.abs(deltaX) <= 8 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      this.drag.horizontal = true;
      this.carouselEl.classList.add("is-dragging");
    }

    this.drag.deltaX = deltaX;
    this.inner.style.transform = `translate3d(calc(-${this.index * 100}% + ${deltaX}px), 0, 0)`;
    event.preventDefault();
  }

  _handlePointerEnd(event) {
    if (!this.drag || event.pointerId !== this.drag.id) return;
    const { deltaX, horizontal } = this.drag;
    this._clearDrag();
    this._render();
    if (event.type === "pointercancel" || !horizontal) return;

    const width = this.carouselEl.getBoundingClientRect().width;
    const threshold = Math.min(80, Math.max(40, width * 0.12));
    if (Math.abs(deltaX) < threshold) return;
    if (deltaX < 0) this.next();
    else this.prev();
  }

  _clearDrag() {
    if (!this.drag) return;
    try {
      if (this.carouselEl.hasPointerCapture?.(this.drag.id)) this.carouselEl.releasePointerCapture(this.drag.id);
    } catch {
      // Pointer capture pode já ter sido liberado pelo navegador.
    }
    this.drag = null;
    this.carouselEl.classList.remove("is-dragging");
    this._syncAutoplay();
  }

  _handleVisibilityChange() {
    this._syncAutoplay();
  }

  dispose() {
    this.userPaused = true;
    this._clearDrag();
    this._syncAutoplay();
    this.prevBtn?.removeEventListener("click", this._handlePrev);
    this.nextBtn?.removeEventListener("click", this._handleNext);
    this.toggleBtn?.removeEventListener("click", this._handleToggle);
    this.indicators.forEach((btn) => btn.removeEventListener("click", this._handleIndicator));
    this.carouselEl.removeEventListener("keydown", this._handleKeydown);
    this.carouselEl.removeEventListener("pointerdown", this._handlePointerDown);
    this.carouselEl.removeEventListener("pointermove", this._handlePointerMove);
    this.carouselEl.removeEventListener("pointerup", this._handlePointerEnd);
    this.carouselEl.removeEventListener("pointercancel", this._handlePointerEnd);
    this.carouselEl.removeEventListener("mouseenter", this._handleMouseEnter);
    this.carouselEl.removeEventListener("mouseleave", this._handleMouseLeave);
    this.carouselEl.removeEventListener("focusin", this._handleFocusIn);
    this.carouselEl.removeEventListener("focusout", this._handleFocusOut);
    document.removeEventListener("visibilitychange", this._handleVisibilityChange);
    if (this.managesTabindex) this.carouselEl.removeAttribute("tabindex");
    instances.delete(this.carouselEl);
  }
}

autoInit("carousel", Carousel);
