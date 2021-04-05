import APIOptions from '../structures/APIOptions.js';
import Album from '../structures/Album.js';
import BaseManager from './BaseManager.js';
import Collection from '../util/Collection.js';
import type Client from '../client/Client.js';
import type { AlbumResolvable, FetchAlbumOptions, FetchAlbumsOptions } from '../util/Interfaces.js';
import type SimplifiedAlbum from '../structures/SimplifiedAlbum.js';
import type BaseAlbum from '../structures/BaseAlbum.js';
import type { AlbumObject } from 'spotify-api-types';
import type { FetchedAlbum } from '../util/Interfaces.js';

/**
 * Stores cache for albums and holds their API methods
 */
export default class AlbumManager extends BaseManager<AlbumResolvable, Album> {
  constructor(client: Client) {
    super(client, Album as any);
  }

  /**
   * Resolves an AlbumResolvable to an Album object
   * @param album An album on Spotify
   */
  resolve(album: AlbumResolvable): Album | null {
    let albumResolvable = super.resolve(album);
    if (albumResolvable) return albumResolvable;
    if ((album as BaseAlbum | SimplifiedAlbum).id) {
      const id = (album as BaseAlbum | SimplifiedAlbum).id;
      albumResolvable = super.resolve(id);
      if (albumResolvable) return albumResolvable;
    }
    return null;
  }

  /**
   * Resolves an AlbumResolvable to an Album ID
   * @param album An album on Spotify
   */
  resolveID(album: AlbumResolvable): string | null {
    const albumResolvable = super.resolveID(album);
    if (albumResolvable) return albumResolvable;
    if ((album as BaseAlbum | SimplifiedAlbum).id) {
      const id = (album as BaseAlbum | SimplifiedAlbum).id;
      if (id) return id;
    }
    return null;
  }

  add(id: string, cache = true, data: AlbumObject): Album {
    return super.add(id, cache, data);
  }

  /**
   * Fetches album(s) from Spotify
   * @param options Options for fetching album(s)
   */
  async fetch<T extends AlbumResolvable | FetchAlbumOptions | FetchAlbumsOptions>(
    options: T,
  ): Promise<FetchedAlbum<T> | null> {
    if (!options) throw new Error('No album IDs were provided');
    const albumId = this.resolveID(options as string);
    // @ts-ignore
    if (albumId) return this._fetchSingle(albumId, true);
    const album = (options as FetchAlbumOptions)?.album as AlbumResolvable;
    if (album) {
      const albumId = this.resolveID(album);
      // @ts-ignore
      if (albumId) return this._fetchSingle(albumId);
    }
    const albums = (options as FetchAlbumsOptions)?.albums;
    if (albums) {
      if (Array.isArray(albums)) {
        const albumIds = albums.map(album => this.resolveID(album));
        // @ts-ignore
        return this._fetchMany(albumIds, true);
      }
    }
    return null;
  }

  private async _fetchSingle(id: string, cache?: boolean): Promise<Album> {
    const apiOptions = new APIOptions('api', null, null);
    const data: AlbumObject = await this.client._api.albums(id).get(apiOptions);
    return this.add(data.id, cache, data);
  }

  private async _fetchMany(ids: Array<string>, cache?: boolean): Promise<Collection<string, Album>> {
    const apiOptions = new APIOptions('api', { ids }, null);
    const data: Record<string, Array<AlbumObject>> = await this.client._api.albums.get(apiOptions);
    const albums = new Collection<string, Album>();
    data.albums.forEach(albumObject => {
      const album = this.add(albumObject.id, cache, albumObject);
      albums.set(album.id, album);
    });
    return albums;
  }
}
