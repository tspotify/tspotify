import APIOptions from '../structures/APIOptions.js';
import Album from '../structures/Album.js';
import BaseManager from './BaseManager.js';
import type Client from '../client/Client.js';

/**
 * Stores cache for albums and holds their API methods
 */
export default class AlbumManager extends BaseManager {
  constructor(client: Client) {
    super(client);
  }

  async fetch(id: string): Promise<Album> {
    const apiOptions = new APIOptions('api', null, null);
    const data = await this.client._api.albums(id).get(apiOptions);
    return new Album(this.client, data);
  }
}
