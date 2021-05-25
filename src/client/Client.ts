import BaseClient from './BaseClient.js';
import RESTManager from '../rest/RESTManager.js';
import { RequestData, AccessTokenDetails } from '../structures/Misc.js';
import AlbumManager from '../managers/AlbumManager.js';
import ArtistManager from '../managers/ArtistManager.js';
import TrackManager from '../managers/TrackManager.js';
import EpisodeManager from '../managers/EpisodeManager.js';
import ShowManager from '../managers/ShowManager.js';
import UserManager from '../managers/UserManager.js';
import PlaylistManager from '../managers/PlaylistManager.js';
import { Events } from '../util/Constants.js';
import CategoryManager from '../managers/CategoryManager.js';
import type { ClientCredentials, ClientOptions } from '../interfaces/Interfaces.js';
import type {
  GetAvailableMarketsResponse,
  GetRecommendationGenresResponse,
  PostClientCredentialsFlowBody,
  PostClientCredentialsFlowResponse,
} from 'spotify-api-types';

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
   * Time at which the client became `ready`
   */
  readyAt: Date | null;

  /**
   * The manager class that holds cache and API methods of artists
   */
  artists: ArtistManager;

  /**
   * The manager class that holds cache and API methods of tracks
   */
  tracks: TrackManager;

  /**
   * The manager class that holds cache and API methods of episodes
   */
  episodes: EpisodeManager;

  /**
   * The manager class that holds cache and API methods of shows
   */
  shows: ShowManager;

  /**
   * The manager class that holds cache and API methods of users
   */
  users: UserManager;

  /**
   * The manager class that holds cache and API methods of playlists
   */
  playlists: PlaylistManager;

  /**
   * The manager class that holds cache and API methods of categories
   */
  categories: CategoryManager;

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

    this.tracks = new TrackManager(this);

    this.episodes = new EpisodeManager(this);

    this.shows = new ShowManager(this);

    this.users = new UserManager(this);

    this.playlists = new PlaylistManager(this);

    this.categories = new CategoryManager(this);
  }

  get _api(): any {
    return this.rest.routeBuilder;
  }

  /**
   * Logs in the client and emits `ready` event on success
   * @param credentials The credentials that were used to log in the bot
   * @returns An `AccessTokenDetails` object
   */
  async login(credentials: ClientCredentials): Promise<AccessTokenDetails> {
    this.credentials = credentials;
    const body: PostClientCredentialsFlowBody = {
      grant_type: 'client_credentials',
    };
    const requestData = new RequestData('account', null, body);
    const data: PostClientCredentialsFlowResponse = await this._api.api.token.post(requestData);
    this.accessTokenDetails = new AccessTokenDetails(data);
    this.readyAt = new Date();
    this.emit(Events.READY);
    return this.accessTokenDetails;
  }

  /**
   * Fetches a list of markets where Spotify is available
   * @returns An array of `ISO 3166-1 alpha-2` strings as a Promise
   */
  async fetchAvailableMarkets(): Promise<Array<string>> {
    const requestData = new RequestData('api', null, null);
    const data: GetAvailableMarketsResponse = await this._api.markets.get(requestData);
    return data.markets;
  }

  /**
   * Fetches a list of available genres
   * @returns An array of genre strings as a Promise
   */
  async fetchRecommendationGenres(): Promise<Array<string>> {
    const requestData = new RequestData('api', null, null);
    const data: GetRecommendationGenresResponse = await this._api
      .recommendations('available-genre-seeds')
      .get(requestData);
    return data.genres;
  }
}
