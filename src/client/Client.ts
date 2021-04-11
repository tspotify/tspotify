import BaseClient from './BaseClient.js';
import RESTManager from '../rest/RESTManager.js';
import APIOptions from '../structures/APIOptions.js';
import AccessTokenDetails from '../structures/AccessTokenDetails.js';
import AlbumManager from '../managers/AlbumManager.js';
import ArtistManager from '../managers/ArtistManager.js';
import { Events } from '../util/Constants.js';
import type { ClientOptions } from '../util/Constants.js';

/**
 * The object containing client id and secret
 */
export interface ClientCredentials {
  clientID: string;
  clientSecret: string;
}

/**
 * The core of the library
 */
export default class Client extends BaseClient {
  /**
   * The credentials for the client to login with
   */
  credentials: ClientCredentials | null;

  /**
   * The details about the access token returned by the API after authorization
   */
  accessTokenDetails: AccessTokenDetails | null;

  /**
   * The rest manager class that holds the methods for API calls
   */
  rest: RESTManager;

  /**
   * The album nanager class that holds the cache of albums and their methods
   */
  albums: AlbumManager;

  /**
   * Time at which the client became `READY`
   */
  readyAt: Date | null;

  /**
   * The manager class that holds cache and API methods of artists
   */
  artists: ArtistManager;

  constructor(options?: ClientOptions) {
    super(options);

    Object.defineProperty(this, 'credentials', { writable: true });
    this.credentials = null;

    Object.defineProperty(this, 'accessTokenDetails', { writable: true });
    this.accessTokenDetails = null;

    this.rest = new RESTManager(this);

    this.albums = new AlbumManager(this);

    this.readyAt = null;

    this.artists = new ArtistManager(this);
  }

  get _api(): any {
    return this.rest.routeBuilder;
  }

  /**
   * Logs the client in and emits the `ready` event on success
   */
  async login(credentials: ClientCredentials): Promise<AccessTokenDetails> {
    this.credentials = credentials;
    const apiOptions = new APIOptions('account', null, {
      grant_type: 'client_credentials',
    });
    const data = await this._api.api.token.post(apiOptions);
    this.accessTokenDetails = new AccessTokenDetails(data);
    if (!this.accessTokenDetails) throw new Error('Invalid client credentials');
    this.readyAt = new Date();
    this.emit(Events.READY);
    return this.accessTokenDetails;
  }
}
