import type RESTManager from './RESTManager.js';
import type Client from '../client/Client.js';
import fetch from 'node-fetch';

export default class APIRequest {
  rest: RESTManager;
  method: string;
  path: string;
  options: any;
  client: Client;

  constructor(rest: RESTManager, method: string, path: string, options: any) {
    this.rest = rest;
    this.method = method;
    this.path = path;
    this.options = options;
    this.client = rest.client;

    if (options.query) {
      const querystring = Object.entries(options.query)
        .filter(([, value]) => value !== null && typeof value !== 'undefined')
        .map(([key, value]) => (Array.isArray(value) ? `${key}=${value.join(',')}` : `${key}=${value}`))
        .join('&');

      this.path = `${path}?${querystring}`;
    }
  }

  make(): any {
    const baseURL =
      this.options.subdomain === 'api'
        ? `${this.client.options.api.baseURL}/v${this.client.options.api.version}`
        : `${this.client.options.api.baseAccountServiceURL}`;
    const url = baseURL + this.path;

    const headers: any = {};
    headers.Authorization = this.options.subdomain === 'api' ? this.rest.getBearerToken() : this.rest.getBasicAuth();

    let body;
    if (this.method != 'get' && this.options.body) {
      if (this.options.subdomain === 'api') {
        body = JSON.stringify(this.options.body);
        headers['Content-Type'] = 'application/json';
      } else {
        body = new URLSearchParams(this.options.body).toString();
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
    }

    return fetch(url, {
      method: this.method,
      headers,
      body,
    }).then(res => res.json());
  }
}
