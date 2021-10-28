import { fetch } from 'undici';
import type Client from '../client/Client.js';
import type RESTManager from './RESTManager.js';
import type { HeadersInit, BodyInit, Response } from 'undici';
import type { ExtendedRequestData } from '../typings/Types.js';

export default class APIRequest {
  rest: RESTManager;
  method: string;
  path: string;
  options: ExtendedRequestData<Record<string, string> | undefined, Record<string, string> | undefined>;
  route: string;
  client: Client;

  constructor(
    rest: RESTManager,
    method: string,
    path: string,
    options: ExtendedRequestData<Record<string, string> | undefined, Record<string, string> | undefined>,
  ) {
    this.rest = rest;
    this.method = method;
    this.path = path;
    this.options = options;
    this.route = options.route;
    this.client = rest.client;

    if (options.query) {
      const querystring = Object.entries(options.query)
        .filter(([, value]) => value !== null && typeof value !== 'undefined')
        .map(([key, value]) => (Array.isArray(value) ? `${key}=${value.join(',')}` : `${key}=${value}`))
        .join('&');

      this.path = `${path}?${querystring}`;
    }
  }

  async make(): Promise<Response> {
    const baseURL = this.options.useAccounts
      ? `${this.client.options.api.baseAccountServiceURL}`
      : `${this.client.options.api.baseURL}/v${this.client.options.api.version}`;
    const url = baseURL + this.path;

    const headers: HeadersInit = {};
    headers.Authorization = this.options.useAccounts ? this.rest.getBasicAuth() : this.rest.getBearerToken();

    let body: BodyInit | undefined;
    if (this.method !== 'get' && this.options.body) {
      if (this.options.useAccounts) {
        body = new URLSearchParams(this.options.body).toString();
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        body = JSON.stringify(this.options.body);
        headers['Content-Type'] = 'application/json';
      }
    }

    return fetch(url, {
      method: this.method,
      keepalive: true,
      headers,
      body,
    });
  }
}
