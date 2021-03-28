import BaseClient from './BaseClient.js';
import type { ClientOptions } from '../util/Constants.js';
import RESTManager from '../rest/RESTManager.js';
import APIOptions from '../structures/APIOptions.js';
import AccessTokenDetails from '../structures/AccessTokenDetails.js';

export interface ClientCredentials {
  clientID: string;
  clientSecret: string;
}

export default class Client extends BaseClient {
  credentials: ClientCredentials | null;
  accessTokenDetails: AccessTokenDetails | null;
  rest: RESTManager;

  constructor(options?: ClientOptions) {
    super(options);

    Object.defineProperty(this, 'credentials', { writable: true });
    this.credentials = null;

    Object.defineProperty(this, 'accessTokenDetails', { writable: true });
    this.accessTokenDetails = null;

    this.rest = new RESTManager(this);
  }

  get _api(): any {
    return this.rest.routeBuilder;
  }

  async login(credentials: ClientCredentials): Promise<AccessTokenDetails> {
    this.credentials = credentials;
    const apiOptions = new APIOptions('account', null, {
      grant_type: 'client_credentials',
    });
    const data = await this._api.api.token.post(apiOptions);
    this.accessTokenDetails = new AccessTokenDetails(data);
    return this.accessTokenDetails;
  }
}
