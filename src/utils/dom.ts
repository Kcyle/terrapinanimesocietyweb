export function $(selector: string, parent: Document | Element = document): HTMLElement | null {
  return parent.querySelector<HTMLElement>(selector);
}

export function $$(selector: string, parent: Document | Element = document): HTMLElement[] {
  return Array.from(parent.querySelectorAll<HTMLElement>(selector));
}

export function exists(selector: string): boolean {
  return $(selector) !== null;
}

export function onReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
