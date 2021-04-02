import BaseAlbum from './BaseAlbum.js';
import Client from '../client/Client.js';
import type { SimplifiedAlbumObject } from 'spotify-api-types';

export default class SimplifiedAlbum extends BaseAlbum {
  /**
   * The field is present when getting an artist’s albums. Possible values are `album`, `single`, `compilation`, or `appears_on`. Compare to `type` of `album` this field represents relationship between the `artist` and the `album`
   */
  albumGroup: string;

  constructor(client: Client, data: SimplifiedAlbumObject) {
    super(client, data);

    this.albumGroup = data.album_group;
  }
}
