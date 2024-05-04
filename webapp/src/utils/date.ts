export function isDateValid(dateStr: string | Date | number) {
  const date = new Date(dateStr);

  return date.getTime() === date.getTime();
}

export function getTimeZone() {
  return Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone;
}

export function getTimezoneOffset() {
  return new Date().getTimezoneOffset();
}
