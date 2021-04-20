import BaseManager from './BaseManager.js';
import Episode from '../structures/Episode.js';
import Client from '../client/Client.js';
import type SimplifiedEpisode from '../structures/SimplifiedEpisode.js';
import type { EpisodeResolvable } from '../util/Interfaces.js';

export default class EpisodeManager extends BaseManager<EpisodeResolvable, Episode> {
  constructor(client: Client) {
    super(client, Episode as any);
  }

  /**
   * Resolves an EpisodeResolvable to an Episode object
   */
  resolve(episodeResolvable: EpisodeResolvable): Episode | null {
    let episode = super.resolve(episodeResolvable);
    if (episode) return episode;
    if ((episodeResolvable as SimplifiedEpisode).id) {
      const id = (episodeResolvable as SimplifiedEpisode).id;
      episode = super.resolve(id);
      if (episode) return episode;
    }
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
}
