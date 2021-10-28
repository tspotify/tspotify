import Show from '../structures/Show.js';
import BaseManager from './BaseManager.js';
import { RequestData } from '../structures/Misc.js';
import Collection from '../util/Collection.js';
import SimplifiedShow from '../structures/SimplifiedShow.js';
import SimplifiedEpisode from '../structures/SimplifiedEpisode.js';
import { Page } from '../structures/Misc.js';
import type Client from '../client/Client.js';
import type {
  FetchShowOptions,
  FetchShowsOptions,
  FetchShowEpisodesOptions,
  SearchShowsOptions,
} from '../typings/Interfaces.js';
import type {
  SimplifiedShowObject,
  GetShowQuery,
  GetShowResponse,
  GetMultipleShowsQuery,
  GetMultipleShowsResponse,
  GetShowEpisodesQuery,
  GetShowEpisodesResponse,
  SimplifiedEpisodeObject,
  GetSearchResponse,
} from 'spotify-api-types';
import type { ShowResolvable, FetchedShow } from '../typings/Types.js';

export default class ShowManager extends BaseManager<ShowResolvable, Show> {
  constructor(client: Client) {
    super(client, Show);
  }

  /**
   * Resolves a ShowResolvable to a Show object
   */
  override resolve(showResolvable: ShowResolvable): Show | null {
    const show = super.resolve(showResolvable);
    if (show) return show;
    const showId = this.resolveId(showResolvable);
    if (showId) return super.resolve(showId);
    return null;
  }

  /**
   * Resolves a ShowResolvable to a Show ID
   */
  override resolveId(showResolvable: ShowResolvable): string | null {
    const showId = super.resolveId(showResolvable);
    if (showId) return showId;
    if ((showResolvable as SimplifiedShow).id) {
      return (showResolvable as SimplifiedShow).id;
    }
    return null;
  }

  async fetch<T extends FetchShowOptions | FetchShowsOptions>(options: T): Promise<FetchedShow<T> | null> {
    if (!options) throw new Error('No show IDs were provided');
    if (!options?.market) throw new Error('No market was provided');
    const show = (options as FetchShowOptions)?.show;
    if (show) {
      const showId = this.resolveId(show);
      // @ts-ignore
      if (showId) return this._fetchSingle(showId, options);
    }
    const shows = (options as FetchShowsOptions)?.shows;
    if (shows) {
      if (Array.isArray(shows)) {
        const showIds = shows.map(show => this.resolveId(show));
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
    const requestData = new RequestData({ query });
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
    const requestData = new RequestData({ query });
    const data: GetMultipleShowsResponse = await this.client._api.shows.get(requestData);
    const simplifiedShows = new Collection<string, SimplifiedShow>();
    data.shows.forEach(simplifiedShowObject => {
      const simplifiedShow = new SimplifiedShow(this.client, simplifiedShowObject as SimplifiedShowObject);
      simplifiedShows.set(simplifiedShow.id, simplifiedShow);
    });
    return simplifiedShows;
  }

  /**
   * Fetches episodes of a show
   * @param show The show whose episodes are to be fetched
   * @param options The options for fetching episodes of a show
   * @returns A Page of `SimplifiedEpisode` objects as a Promise
   */
  async fetchEpisodes(
    show: ShowResolvable,
    options: FetchShowEpisodesOptions,
  ): Promise<Page<SimplifiedEpisodeObject, SimplifiedEpisode>> {
    const showId = this.resolveId(show);
    if (!showId) throw new Error('Invalid show');
    if (!options?.market) throw new Error('No market was provided');
    const query: GetShowEpisodesQuery = {
      market: options.market,
      limit: options?.limit,
      offset: options?.offset,
    };
    const requestData = new RequestData({ query });
    const data: GetShowEpisodesResponse = await this.client._api.shows(showId).episodes.get(requestData);
    return new Page(this.client, data, SimplifiedEpisode);
  }

  /**
   * Fetches shows from Spotify by searching
   * @param options The options provided for searching shows
   * @returns A `Page` of `SimplifiedShow` objects as a Promise
   */
  async search(options: SearchShowsOptions): Promise<Page<SimplifiedShowObject, SimplifiedShow>> {
    if (!options?.market) throw new Error('Market was not provided');
    const data: GetSearchResponse = await super._search(options, 'show', options.market);
    return new Page(this.client, data.shows, SimplifiedShow);
  }
}
