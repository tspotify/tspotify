import BaseManager from './BaseManager.js';
import Episode from '../structures/Episode.js';
import { Page, RequestData } from '../structures/Misc.js';
import Collection from '../util/Collection.js';
import SimplifiedEpisode from '../structures/SimplifiedEpisode.js';
import { CustomTypeError } from '../errors/ErrorIndex.js';
import type Client from '../client/Client.js';
import type { FetchEpisodeOptions, FetchEpisodesOptions, SearchEpisodesOptions } from '../typings/Interfaces.js';
import type {
  GetEpisodeQuery,
  GetEpisodeResponse,
  GetMultipleEpisodesQuery,
  GetMultipleEpisodesResponse,
  EpisodeObject,
  SimplifiedEpisodeObject,
  GetSearchResponse,
} from 'spotify-api-types';
import type { EpisodeResolvable, FetchedEpisode } from '../typings/Types.js';

export default class EpisodeManager extends BaseManager<EpisodeResolvable, Episode> {
  constructor(client: Client) {
    super(client, Episode);
  }

  /**
   * Resolves an EpisodeResolvable to an Episode object
   */
  override resolve(episodeResolvable: EpisodeResolvable): Episode | null {
    const episode = super.resolve(episodeResolvable);
    if (episode) return episode;
    const episodeId = this.resolveId(episodeResolvable);
    if (episodeId) return super.resolve(episodeId);
    return null;
  }

  /**
   * Resolves an EpisodeResolvable to an Episode ID
   */
  override resolveId(episodeResolvable: EpisodeResolvable): string | null {
    const episodeId = super.resolveId(episodeResolvable);
    if (episodeId) return episodeId;
    if ((episodeResolvable as SimplifiedEpisode).id) {
      return (episodeResolvable as SimplifiedEpisode).id;
    }
    return null;
  }

  /**
   * Fetches episode(s) from Spotify
   */
  async fetch<T extends FetchEpisodeOptions | FetchEpisodesOptions>(options: T): Promise<FetchedEpisode<T> | null> {
    if (!options) throw new Error('No episode IDs were provided');
    const episode = (options as FetchEpisodeOptions)?.episode;
    if (episode) {
      const episodeId = this.resolveId(episode);
      // @ts-ignore
      if (episodeId) return this._fetchSingle(episodeId, options);
    }
    const episodes = (options as FetchEpisodesOptions)?.episodes;
    if (episodes) {
      if (Array.isArray(episodes)) {
        const episodeIds = episodes.map(episode => this.resolveId(episode));
        // @ts-ignore
        if (episodeIds) return this._fetchMany(episodeIds, options);
      }
    }
    return null;
  }

  private async _fetchSingle(id: string, options: FetchEpisodeOptions): Promise<Episode> {
    if (!options?.market) throw new Error('No market was provided!');
    if (!options?.skipCacheCheck) {
      const cachedEpisode = this.resolve(id);
      if (cachedEpisode) return cachedEpisode;
    }
    const query: GetEpisodeQuery = {
      market: options?.market,
    };
    const requestData = new RequestData({ query });
    const data: GetEpisodeResponse = await this.client._api.episodes(id).get(requestData);
    return this.add(data.id, options?.cacheAfterFetching, data);
  }

  private async _fetchMany(ids: Array<string>, options: FetchEpisodesOptions): Promise<Collection<string, Episode>> {
    if (!options?.market) throw new Error('No market was provided!');
    const episodes = new Collection<string, Episode>();
    if (!options?.skipCacheCheck) {
      const cachedEpisodes: Array<string> = [];
      ids.forEach(id => {
        const episode = this.resolve(id);
        if (episode) {
          episodes.set(episode.id, episode);
          cachedEpisodes.push(id);
        }
      });
      ids = ids.filter(id => !cachedEpisodes.includes(id));
    }
    const query: GetMultipleEpisodesQuery = {
      ids,
      market: options?.market,
    };
    const requestData = new RequestData({ query });
    const data: GetMultipleEpisodesResponse = await this.client._api.episodes.get(requestData);
    data.episodes.forEach(episodeObject => {
      const episode = this.add((episodeObject as EpisodeObject)?.id, options?.cacheAfterFetching, episodeObject);
      episodes.set(episode.id, episode);
    });
    return episodes;
  }

  /**
   * Fetches episodes from Spotify by searching
   * @param options The options provided for searching episodes
   * @returns A `Page` of `SimplifiedEpisode` objects as a Promise
   */
  async search(options: SearchEpisodesOptions): Promise<Page<SimplifiedEpisodeObject, SimplifiedEpisode>> {
    if (!options?.market) throw new CustomTypeError('MISSING_MARKET');
    const data: GetSearchResponse = await super._search(options, 'episode', options.market);
    return new Page(this.client, data.episodes, SimplifiedEpisode);
  }
}
