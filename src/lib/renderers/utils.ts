export function isAnyReadonly(...args: any[]): boolean | undefined {
  for (let arg of args) {
    if (typeof arg?.readonly === 'boolean') return arg.readonly;
    if (typeof arg?.readOnly === 'boolean') return arg.readOnly;
  }
  return undefined;
}