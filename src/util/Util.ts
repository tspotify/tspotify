import type { DefaultClientOptionsInterface } from './Constants';

const has = (obj: Record<string, unknown>, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

/* eslint-disable */
export function mergeDefault(defaultObject: any, given: any): DefaultClientOptionsInterface {
  if (!given) return defaultObject;
  let key: keyof DefaultClientOptionsInterface | any;
  for (key in defaultObject) {
    if (!has(given, key) || given[key] === undefined) {
      given[key] = defaultObject[key];
    } else if (given[key] === Object(given[key])) {
      given[key] = mergeDefault(defaultObject[key], given[key]);
    }
  }
  return given as DefaultClientOptionsInterface;
}
