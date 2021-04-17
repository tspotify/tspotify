import Client from '../client/Client.js';
import SimplifiedEpisode from './SimplifiedEpisode.js';
import type { EpisodeObject } from 'spotify-api-types';

export default class Episode extends SimplifiedEpisode {
  /**
   * The show on which the episode belongs
   */
  show: any;

  constructor(client: Client, data: EpisodeObject) {
    super(client, data);

    this.show = data.show;
  }
}
