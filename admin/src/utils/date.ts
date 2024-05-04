export function formatDate(value: string) {
  if (!value) return '-';

  return new Date(value).toLocaleString('uk-UA');
}
