export type GetMethods<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends Function ? K : never;
}[keyof T];

export type PropDefined<T, M extends keyof T> = T &
  Record<M, Exclude<T[M], undefined>>;

export function isMethodDefined<T, M extends keyof T>(
  obj: T,
  method: GetMethods<T>
): obj is PropDefined<T, M> {
  return typeof obj[method] === 'function';
}
