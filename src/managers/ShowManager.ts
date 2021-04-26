import Show from '../structures/Show.js';
import BaseManager from './BaseManager.js';
import { RequestData } from '../structures/Misc.js';
import Collection from '../util/Collection.js';
import SimplifiedShow from '../structures/SimplifiedShow.js';
import type Client from '../client/Client.js';
import type { ShowResolvable, FetchShowOptions, FetchShowsOptions, FetchedShow } from '../util/Interfaces.js';
import type {
  SimplifiedShowObject,
  GetShowQuery,
  GetShowResponse,
  GetMultipleShowsQuery,
  GetMultipleShowsResponse,
} from 'spotify-api-types';

export default class ShowManager extends BaseManager<ShowResolvable, Show> {
  constructor(client: Client) {
    super(client, Show);
  }

  /**
   * Resolves a ShowResolvable to a Show object
   */
  resolve(showResolvable: ShowResolvable): Show | null {
    const show = super.resolve(showResolvable);
    if (show) return show;
    const showID = this.resolveID(showResolvable);
    if (showID) return super.resolve(showID);
    return null;
  }

  /**
   * Resolves a ShowResolvable to a Show ID
   */
  resolveID(showResolvable: ShowResolvable): string | null {
    const showID = super.resolveID(showResolvable);
    if (showID) return showID;
    if ((showResolvable as SimplifiedShow).id) {
      return (showResolvable as SimplifiedShow).id;
    }
    return null;
  }

  async fetch<T extends FetchShowOptions | FetchShowsOptions>(options: T): Promise<FetchedShow<T> | null> {
    if (!options) throw new Error('No show IDs were provided');
    const show = (options as FetchShowOptions)?.show;
    if (show) {
      const showId = this.resolveID(show);
      // @ts-ignore
      if (showId) return this._fetchSingle(showId, options);
    }
    const shows = (options as FetchShowsOptions)?.shows;
    if (shows) {
      if (Array.isArray(shows)) {
        const showIds = shows.map(show => this.resolveID(show));
        // @ts-ignore
        if (showIds) return this._fetchMany(showIds, options);
      }
    }
    return null;
  }

  private async _fetchSingle(id: string, options: FetchShowOptions): Promise<Show> {
    if (!options.skipCacheCheck) {
      const cachedShow = this.resolve(id);
      if (cachedShow) return cachedShow;
    }
    const query: GetShowQuery = {
      market: options?.market,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetShowResponse = await this.client._api.shows(id).get(requestData);
    return this.add(data.id, options?.cacheAfterFetching, data);
  }

  /**
   * **⚠️Note**: Unlike other bulk endpoints, this one doesn't return a complete object. Since, the object(s) fetched
   * by this method are `SimplifiedShow`, they aren't cached
   */
  private async _fetchMany(
    ids: Array<string>,
    options: FetchShowsOptions,
  ): Promise<Collection<string, SimplifiedShow>> {
    const query: GetMultipleShowsQuery = {
      ids,
      market: options?.market,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetMultipleShowsResponse = await this.client._api.shows.get(requestData);
    const simplifiedShows = new Collection<string, SimplifiedShow>();
    data.shows.forEach(simplifiedShowObject => {
      const simplifiedShow = new SimplifiedShow(this.client, simplifiedShowObject as SimplifiedShowObject);
      simplifiedShows.set(simplifiedShow.id, simplifiedShow);
    });
    return simplifiedShows;
  }
}
