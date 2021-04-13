import APIOptions from '../structures/APIOptions.js';
import Album from '../structures/Album.js';
import BaseManager from './BaseManager.js';
import Collection from '../util/Collection.js';
import type Client from '../client/Client.js';
import type { AlbumResolvable, FetchAlbumOptions, FetchAlbumsOptions } from '../util/Interfaces.js';
import type SimplifiedAlbum from '../structures/SimplifiedAlbum.js';
import type BaseAlbum from '../structures/BaseAlbum.js';
import type {
  AlbumObject,
  GetAlbumQuery,
  GetAlbumResponse,
  GetMultipleAlbumsQuery,
  GetMultipleAlbumsResponse,
} from 'spotify-api-types';
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
   */
  resolve(albumResolvable: AlbumResolvable): Album | null {
    let album = super.resolve(albumResolvable);
    if (album) return album;
    if ((albumResolvable as BaseAlbum | SimplifiedAlbum).id) {
      const id = (albumResolvable as BaseAlbum | SimplifiedAlbum).id;
      album = super.resolve(id);
      if (album) return album;
    }
    return null;
  }

  /**
   * Resolves an AlbumResolvable to an Album ID
   */
  resolveID(albumResolvable: AlbumResolvable): string | null {
    const albumID = super.resolveID(albumResolvable);
    if (albumID) return albumID;
    if ((albumResolvable as BaseAlbum | SimplifiedAlbum).id) {
      return (albumResolvable as BaseAlbum | SimplifiedAlbum).id;
    }
    return null;
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
    if (albumId) return this._fetchSingle(albumId);
    const album = (options as FetchAlbumOptions)?.album;
    if (album) {
      const albumId = this.resolveID(album);
      // @ts-ignore
      if (albumId) return this._fetchSingle(albumId, options);
    }
    const albums = (options as FetchAlbumsOptions)?.albums;
    if (albums) {
      if (Array.isArray(albums)) {
        const albumIds = albums.map(album => this.resolveID(album));
        // @ts-ignore
        if (albumIds) return this._fetchMany(albumIds, options);
      }
    }
    return null;
  }

  private async _fetchSingle(id: string, options?: FetchAlbumOptions): Promise<Album> {
    if (!options?.skipCacheCheck) {
      const cachedAlbum = this.cache.get(id);
      if (cachedAlbum) return cachedAlbum;
    }
    const query: GetAlbumQuery = {
      market: options?.market,
    };
    const apiOptions = new APIOptions('api', query, null);
    const data: GetAlbumResponse = await this.client._api.albums(id).get(apiOptions);
    return this.add(data.id, options?.cacheAfterFetching, data);
  }

  private async _fetchMany(ids: Array<string>, options?: FetchAlbumsOptions): Promise<Collection<string, Album>> {
    const albums = new Collection<string, Album>();
    if (!options?.skipCacheCheck) {
      const cachedAlbums: Array<string> = [];
      ids.forEach(id => {
        const album = this.cache.get(id);
        if (album) {
          albums.set(album.id, album);
          cachedAlbums.push(album.id);
        }
      });
      ids = ids.filter(id => !cachedAlbums.includes(id));
    }
    const query: GetMultipleAlbumsQuery = {
      ids,
      market: options?.market,
    };
    const apiOptions = new APIOptions('api', query, null);
    const data: GetMultipleAlbumsResponse = await this.client._api.albums.get(apiOptions);
    data.albums.forEach(albumObject => {
      const album = this.add((albumObject as AlbumObject).id, options?.cacheAfterFetching, albumObject);
      albums.set(album.id, album);
    });
    return albums;
  }
}
