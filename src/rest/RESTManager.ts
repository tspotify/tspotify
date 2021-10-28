import APIRequest from './APIRequest.js';
import { buildRoute } from './APIRouter.js';
import Collection from '../util/Collection.js';
import RequestHandler from './RequestHandler.js';
import type Client from '../client/Client.js';
import type { ExtendedRequestData } from '../typings/Types.js';
import type { ClientCredentials } from '../typings/Interfaces.js';

export default class RESTManager {
  /**
   * The client that initiated this class
   */
  client: Client;

  /**
   * The collection of request handlers
   */
  requestHandlers: Collection<string, RequestHandler>;

  constructor(client: Client) {
    this.client = client;
    this.requestHandlers = new Collection();
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
    const { clientId, clientSecret } = this.client.credentials as ClientCredentials;
    const authHeaderString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    return `Basic ${authHeaderString}`;
  }

  getBearerToken(): string {
    return `Bearer ${this.client.accessTokenDetails?.accessToken}`;
  }

  async request(
    method: string,
    path: string,
    options: ExtendedRequestData<Record<string, string> | undefined, Record<string, string> | undefined>,
  ): Promise<unknown> {
    // for every non-authorization endpoint request, check whether access token has expired or not. If yes, then re-authorize the client
    if (!options.useAccounts) await this.#checkAccessTokenStatus();
    const apiRequest = new APIRequest(this, method, path, options);
    let handler = this.requestHandlers.get(apiRequest.route);
    if (!handler) {
      handler = new RequestHandler(this);
      this.requestHandlers.set(apiRequest.route, handler);
    }
    return handler.push(apiRequest);
  }

  async #checkAccessTokenStatus(): Promise<void> {
    const { accessTokenDetails, lastTokenUpdateAt } = this.client;
    if (!lastTokenUpdateAt || !accessTokenDetails) throw new Error('Client was not ready.');
    const expiresInMs = accessTokenDetails.expiresIn * 1000;
    const timeLeft = new Date().getTime() - lastTokenUpdateAt.getTime();
    // add a margin of 10 seconds for being on the safe side that the token will not expire just after this check
    const margin = 10000;
    if (timeLeft + margin < expiresInMs) return;
    await this.client._updateAccessToken();
  }
}
