function isPlainObject(obj: any): obj is object {
  if (typeof obj !== 'object' || obj === null) return false;

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return (
    Object.getPrototypeOf(obj) === proto || Object.getPrototypeOf(obj) === null
  );
}

export function mergeRightDeep(a: Record<string, any>, b: Record<string, any>) {
  const result = { ...a };

  Object.keys(b).forEach((key) => {
    if (isPlainObject(b[key])) {
      result[key] = mergeRightDeep(a[key], b[key]);
      return;
    }

    result[key] = b[key] || a[key];
  });

  return result;
}
