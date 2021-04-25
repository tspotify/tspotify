import SimplifiedEpisode from './SimplifiedEpisode.js';
import SimplifiedShow from './SimplifiedShow.js';
import type Client from '../client/Client.js';
import type { EpisodeObject } from 'spotify-api-types';

export default class Episode extends SimplifiedEpisode {
  /**
   * The show on which the episode belongs
   */
  show: SimplifiedShow;

  constructor(client: Client, data: EpisodeObject) {
    super(client, data);

    this.show = new SimplifiedShow(client, data.show);
  }
}
