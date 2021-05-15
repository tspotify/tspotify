import APIRequest from './APIRequest.js';
import { buildRoute } from './APIRouter.js';
import type Client from '../client/Client.js';
import type { ClientCredentials } from '../interfaces/Interfaces.js';

export default class RESTManager {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get routeBuilder(): any {
    return buildRoute(this);
  }

  get baseURL(): string {
    return this.client.options.api.baseURL;
  }

  get baseAccountServiceURL(): string {
    return this.client.options.api.baseAccountServiceURL;
  }

  getBasicAuth(): string {
    const { clientID, clientSecret } = this.client.credentials as ClientCredentials;
    const authHeaderString = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
    return `Basic ${authHeaderString}`;
  }

  getBearerToken(): string {
    return `Bearer ${this.client.accessTokenDetails?.accessToken}`;
  }

  request(method: string, path: string, options: any): Promise<any> {
    const apiRequest = new APIRequest(this, method, path, options);
    return apiRequest.make();
  }
}
