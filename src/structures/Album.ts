import Client from '../client/Client.js';
import BaseAlbum from './BaseAlbum.js';
import type { AlbumObject } from 'spotify-api-types';

/**
 * Represents an album on Spotify
 */
export default class Album extends BaseAlbum {
  /**
   * The copyright statements of the album
   */
  copyrights: Array<any>;

  /**
   * Known external IDs for the album
   */
  externalIds: object;

  /**
   * A list of the genres used to classify the album
   */
  genres: Array<string>;

  /**
   * The label for the album
   */
  label: string;

  /**
   * The popularity of the album. The value will be between `0` and `100`, with `100` being the most popular. The popularity is calculated from the popularity of the album’s individual tracks
   */
  popularity: number;

  /**
   * The tracks of the album
   */
  tracks: Array<object>;

  constructor(client: Client, data: AlbumObject) {
    super(client, data);

    this.copyrights = data.copyrights;

    this.externalIds = data.external_ids;

    this.genres = data.genres;

    this.label = data.label;

    this.popularity = data.popularity;

    // use a patch method for this later
    this.tracks = data.tracks;
  }
}
