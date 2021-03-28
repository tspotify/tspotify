import type RESTManager from './RESTManager.js';

/* eslint-disable */
const noop = () => { };
const methods = ['get', 'post', 'delete', 'patch', 'put'];
const reflectors = ['toString'];

export function buildRoute(manager: RESTManager): any {
  const route = [''];
  const handler = {
    get(target: any, property: string): any {
      if (reflectors.includes(property)) return () => route.join('/');
      if (methods.includes(property)) {
        return (options: any) => manager.request(property, route.join('/'), Object.assign({}, options));
      }
      route.push(property);
      return new Proxy(noop, handler);
    },
    apply(target: any, _: undefined, argumentList: Array<any>): ProxyConstructor {
      route.push(...argumentList.filter(arg => arg != null));
      return new Proxy(noop, handler);
    },
  };
  return new Proxy(noop, handler);
}
