import SimplifiedShow from './SimplifiedShow.js';
import SimplifiedEpisode from './SimplifiedEpisode.js';
import { Page } from './Misc.js';
import type Client from '../client/Client.js';
import type { ShowObject, SimplifiedEpisodeObject } from 'spotify-api-types';

export default class Show extends SimplifiedShow {
  /**
   * Episodes of this show
   */
  episodes: Page<SimplifiedEpisodeObject, SimplifiedEpisode>;

  constructor(client: Client, data: ShowObject) {
    super(client, data);

    this.episodes = new Page(this.client, data.episodes, SimplifiedEpisode);
  }
}
