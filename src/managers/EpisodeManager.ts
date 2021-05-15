import BaseManager from './BaseManager.js';
import Episode from '../structures/Episode.js';
import Client from '../client/Client.js';
import { RequestData } from '../structures/Misc.js';
import Collection from '../util/Collection.js';
import type SimplifiedEpisode from '../structures/SimplifiedEpisode.js';
import type {
  EpisodeResolvable,
  FetchEpisodeOptions,
  FetchEpisodesOptions,
  FetchedEpisode,
} from '../interfaces/Interfaces.js';
import type {
  GetEpisodeQuery,
  GetEpisodeResponse,
  GetMultipleEpisodesQuery,
  GetMultipleEpisodesResponse,
  EpisodeObject,
} from 'spotify-api-types';

export default class EpisodeManager extends BaseManager<EpisodeResolvable, Episode> {
  constructor(client: Client) {
    super(client, Episode);
  }

  /**
   * Resolves an EpisodeResolvable to an Episode object
   */
  resolve(episodeResolvable: EpisodeResolvable): Episode | null {
    const episode = super.resolve(episodeResolvable);
    if (episode) return episode;
    const episodeID = this.resolveID(episodeResolvable);
    if (episodeID) return super.resolve(episodeID);
    return null;
  }

  /**
   * Resolves an EpisodeResolvable to an Episode ID
   */
  resolveID(episodeResolvable: EpisodeResolvable): string | null {
    const episodeID = super.resolveID(episodeResolvable);
    if (episodeID) return episodeID;
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
      const episodeId = this.resolveID(episode);
      // @ts-ignore
      if (episodeId) return this._fetchSingle(episodeId, options);
    }
    const episodes = (options as FetchEpisodesOptions)?.episodes;
    if (episodes) {
      if (Array.isArray(episodes)) {
        const episodeIds = episodes.map(episode => this.resolveID(episode));
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
    const requestData = new RequestData('api', query, null);
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
    const requestData = new RequestData('api', query, null);
    const data: GetMultipleEpisodesResponse = await this.client._api.episodes.get(requestData);
    data.episodes.forEach(episodeObject => {
      const episode = this.add((episodeObject as EpisodeObject)?.id, options?.cacheAfterFetching, episodeObject);
      episodes.set(episode.id, episode);
    });
    return episodes;
  }
}
