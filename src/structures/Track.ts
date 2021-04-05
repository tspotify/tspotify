import SimplifiedTrack from './SimplifiedTrack.js';
import SimplifiedAlbum from './SimplifiedAlbum.js';
import { ExternalId } from './Misc.js';
import type Client from '../client/Client.js';
import type { TrackObject } from 'spotify-api-types';

export default class Track extends SimplifiedTrack {
  /**
   * The album on which the track appears
   */
  album: SimplifiedAlbum;

  /**
   * Known external IDs for the track
   */
  externalIds: ExternalId;

  /**
   * The popularity of the track. The value will be between `0` and `100`, with `100` being the most popular
   */
  popularity: number;

  constructor(client: Client, data: TrackObject) {
    super(client, data);

    this.album = new SimplifiedAlbum(this.client, data.album);

    this.externalIds = new ExternalId(data.external_ids);

    this.popularity = data.popularity;
  }
}
