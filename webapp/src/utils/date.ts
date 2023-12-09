export function isDateValid(dateStr: string | Date | number) {
  const date = new Date(dateStr);

  return date.getTime() === date.getTime();
}
