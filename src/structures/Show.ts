import SimplifiedShow from './SimplifiedShow.js';
import Collection from '../util/Collection.js';
import SimplifiedEpisode from './SimplifiedEpisode.js';
import type Client from '../client/Client.js';
import type { ShowObject, SimplifiedEpisodeObject } from 'spotify-api-types';

export default class Show extends SimplifiedShow {
  /**
   * Episodes of this show
   */
  episodes: Collection<string, SimplifiedEpisode>;

  constructor(client: Client, data: ShowObject) {
    super(client, data);

    this.episodes = this._patchEpisodes(data.episodes);
  }

  private _patchEpisodes(data: Array<SimplifiedEpisodeObject>): Collection<string, SimplifiedEpisode> {
    const episodesCollection = new Collection<string, SimplifiedEpisode>();
    data.forEach(episodeObject => {
      episodesCollection.set(episodeObject.id, new SimplifiedEpisode(this.client, episodeObject));
    });
    return episodesCollection;
  }
}
