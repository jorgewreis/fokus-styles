import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Toast } from '../../packages/fokus-js/js/toast.js';

let toast, el;
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true });
  document.body.innerHTML = '<div data-delay="1000" data-toast-progress="true"><button>Primeira</button><button>Segunda</button><div class="fs-toast-progress"></div></div>';
  el = document.querySelector('div');
  toast = new Toast(el);
  toast.show();
});
afterEach(() => {
  toast.dispose();
  vi.restoreAllMocks();
  vi.useRealTimers();
  document.body.innerHTML = '';
});
const event = (type, relatedTarget = null) => el.dispatchEvent(new FocusEvent(type, { relatedTarget }));
const progress = () => parseFloat(el.querySelector('.fs-toast-progress').style.inlineSize);

describe('Toast independent pause reasons and elapsed progress', () => {
  it.each([
    ['mouseenter', 'focusin', 'mouseleave', 'focusout'],
    ['focusin', 'mouseenter', 'focusout', 'mouseleave'],
  ])('does not resume until both %s and %s end', (first, second, firstEnd, secondEnd) => {
    vi.advanceTimersByTime(300);
    event(first);
    event(second);
    expect(progress()).toBe(70);
    event(firstEnd);
    vi.advanceTimersByTime(5000);
    expect(toast.isOpen).toBe(true);
    expect(el.classList.contains('is-paused')).toBe(true);
    expect(progress()).toBe(70);
    event(secondEnd);
    vi.advanceTimersByTime(699);
    expect(toast.isOpen).toBe(true);
    vi.advanceTimersByTime(1);
    expect(toast.isOpen).toBe(false);
  });

  it('moving focus inside does not schedule a timer or reset remaining time', () => {
    vi.advanceTimersByTime(250);
    event('focusin');
    const schedule = vi.spyOn(toast, '_scheduleHide');
    event('focusout', el.querySelectorAll('button')[1]);
    event('focusin');
    expect(schedule).not.toHaveBeenCalled();
    vi.advanceTimersByTime(5000);
    expect(progress()).toBe(75);
    event('focusout');
    expect(schedule).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(750);
    expect(toast.isOpen).toBe(false);
  });

  it('progress does not double-subtract or restart after repeated pauses, including epoch zero', () => {
    vi.advanceTimersByTime(200);
    expect(progress()).toBe(80);
    event('mouseenter');
    expect(progress()).toBe(80);
    vi.advanceTimersByTime(3000);
    event('mouseleave');
    expect(progress()).toBe(80);
    vi.advanceTimersByTime(300);
    expect(progress()).toBe(50);
    event('focusin');
    expect(progress()).toBe(50);
    vi.advanceTimersByTime(2000);
    event('focusout');
    vi.advanceTimersByTime(450);
    expect(progress()).toBe(5);
    expect(toast.isOpen).toBe(true);
    vi.advanceTimersByTime(50);
    expect(toast.isOpen).toBe(false);
  });

  it('hide clears pause reasons so a new show has a full timer', () => {
    event('mouseenter');
    event('focusin');
    toast.hide();
    toast.show();
    expect(el.classList.contains('is-paused')).toBe(false);
    vi.advanceTimersByTime(999);
    expect(toast.isOpen).toBe(true);
    vi.advanceTimersByTime(1);
    expect(toast.isOpen).toBe(false);
  });

  it('dispose leaves no pending autohide or progress work', () => {
    event('focusin');
    toast.dispose();
    const hide = vi.spyOn(toast, 'hide');
    event('focusout');
    vi.advanceTimersByTime(10000);
    expect(hide).not.toHaveBeenCalled();
    expect(Toast.getInstance(el)).toBeUndefined();
  });
});
