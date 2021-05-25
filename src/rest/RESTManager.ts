import APIRequest from './APIRequest.js';
import { buildRoute } from './APIRouter.js';
import type Client from '../client/Client.js';
import type { ClientCredentials } from '../interfaces/Interfaces.js';
import type { RequestData } from '../structures/Misc.js';

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

  async request(method: string, path: string, options: RequestData<unknown, unknown>): Promise<any> {
    // check whether access token has been expired or not for every non-authorization endpoint request, if yes then re-authorize the client
    if (options.subdomain !== 'account') await this._checkAccessTokenStatus();
    const apiRequest = new APIRequest(this, method, path, options);
    return apiRequest.make();
  }

  async _checkAccessTokenStatus(): Promise<undefined> {
    const { accessTokenDetails, lastTokenUpdateAt } = this.client;
    if (!lastTokenUpdateAt || !accessTokenDetails) throw new Error('Client was not ready.');
    const expiresInMs = accessTokenDetails.expiresIn * 1000;
    const timeLeft = new Date().getTime() - lastTokenUpdateAt.getTime();
    // add a margin of 10 seconds for being on the safe side that the token will not expire just after this check
    const margin = 10000;
    if (timeLeft + margin < expiresInMs) return;
    await this.client._updateAccessToken();
    return;
  }
}
