import type RESTManager from './RESTManager.js';
import type { RequestData } from '../structures/Misc.js';

/* eslint-disable */
const noop = () => { };
const methods = ['get', 'post', 'delete', 'patch', 'put'];
const reflectors = ['toString'];

export function buildRoute(manager: RESTManager): any {
  const path = [''];
  const handler = {
    get(target: any, property: string): any {
      if (reflectors.includes(property)) return () => path.join('/');
      if (methods.includes(property)) {
        const routeBucket: Array<string> = [];
        let currentDirectory: string;
        for (let i = 0; i < path.length; i++) {
          currentDirectory = path[i];
          // replace literal ID with ':id' to keep route of an endpoint independent from IDs
          if (/((\w|-){22})/g.test(currentDirectory)) {
            routeBucket.push(':id');
          } else {
            routeBucket.push(currentDirectory);
          }
        }
        return (options: RequestData<unknown, unknown>) => manager.request(property, path.join('/'), Object.assign({
          route: routeBucket.join('/')
        }, options));
      }
      path.push(property);
      return new Proxy(noop, handler);
    },
    apply(target: any, _: undefined, argumentList: Array<any>): ProxyConstructor {
      path.push(...argumentList.filter(arg => arg != null));
      return new Proxy(noop, handler);
    },
  };
  return new Proxy(noop, handler);
}
