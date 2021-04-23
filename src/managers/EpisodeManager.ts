import BaseManager from './BaseManager.js';
import Episode from '../structures/Episode.js';
import Client from '../client/Client.js';
import APIOptions from '../structures/APIOptions.js';
import type SimplifiedEpisode from '../structures/SimplifiedEpisode.js';
import type { EpisodeResolvable, FetchEpisodeOptions } from '../util/Interfaces.js';
import type { GetEpisodeQuery, GetEpisodeResponse } from 'spotify-api-types';

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

  private async _fetchSingle(id: string, options: FetchEpisodeOptions): Promise<Episode> {
    if (!options?.market) throw new Error('No market was provided!');
    if (!options?.skipCacheCheck) {
      const cachedEpisode = this.resolve(id);
      if (cachedEpisode) return cachedEpisode;
    }
    const query: GetEpisodeQuery = {
      market: options?.market,
    };
    const apiOptions = new APIOptions('api', query, null);
    const data: GetEpisodeResponse = await this.client._api.episodes(id).get(apiOptions);
    return this.add(data.id, options?.cacheAfterFetching, data);
  }
}
