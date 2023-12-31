export function debounce<tFn extends (...args: any[]) => any>(
  fn: tFn,
  ms: number,
) {
  let timeout: number;

  function debouncedFn(...args: any[]) {
    clearTimeout(timeout);

    timeout = window.setTimeout(() => fn(...args), ms);
  }

  return debouncedFn;
}
