import { RequestData } from '../structures/Misc.js';
import Album from '../structures/Album.js';
import BaseManager from './BaseManager.js';
import Collection from '../util/Collection.js';
import SimplifiedTrack from '../structures/SimplifiedTrack.js';
import { Page } from '../structures/Misc.js';
import SimplifiedAlbum from '../structures/SimplifiedAlbum.js';
import type Client from '../client/Client.js';
import type {
  AlbumResolvable,
  FetchAlbumOptions,
  FetchAlbumsOptions,
  FetchedAlbum,
  FetchAlbumTracksOptions,
  FetchNewReleasesOptions,
  SearchOptions,
} from '../interfaces/Interfaces.js';
import type BaseAlbum from '../structures/BaseAlbum.js';
import type {
  AlbumObject,
  GetAlbumQuery,
  GetAlbumResponse,
  GetMultipleAlbumsQuery,
  GetMultipleAlbumsResponse,
  GetAlbumTracksQuery,
  GetAlbumTracksResponse,
  SimplifiedTrackObject,
  SimplifiedAlbumObject,
  GetNewReleasesQuery,
  GetNewReleasesResponse,
  GetSearchResponse,
} from 'spotify-api-types';

/**
 * Stores cache for albums and holds their API methods
 */
export default class AlbumManager extends BaseManager<AlbumResolvable, Album> {
  constructor(client: Client) {
    super(client, Album);
  }

  /**
   * Resolves an AlbumResolvable to an Album object
   */
  resolve(albumResolvable: AlbumResolvable): Album | null {
    const album = super.resolve(albumResolvable);
    if (album) return album;
    const albumID = this.resolveID(albumResolvable);
    if (albumID) return super.resolve(albumID);
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
    const requestData = new RequestData('api', query, null);
    const data: GetAlbumResponse = await this.client._api.albums(id).get(requestData);
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
    const requestData = new RequestData('api', query, null);
    const data: GetMultipleAlbumsResponse = await this.client._api.albums.get(requestData);
    data.albums.forEach(albumObject => {
      const album = this.add((albumObject as AlbumObject).id, options?.cacheAfterFetching, albumObject);
      albums.set(album.id, album);
    });
    return albums;
  }

  /**
   * Fetches track(s) of an album
   * @param album The album whose tracks are to be fetched
   * @param options Options for fetching the tracks
   * @returns A Page of `SimplifiedTrack` objects as a Promise
   */
  async fetchTracks(
    album: AlbumResolvable,
    options?: FetchAlbumTracksOptions,
  ): Promise<Page<SimplifiedTrackObject, SimplifiedTrack>> {
    const albumID = this.resolveID(album);
    if (!albumID) throw new Error('No album IDs were provided!');
    const query: GetAlbumTracksQuery = {
      market: options?.market,
      limit: options?.limit,
      offset: options?.offset,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetAlbumTracksResponse = await this.client._api.albums(albumID).tracks.get(requestData);
    return new Page(this.client, data, SimplifiedTrack);
  }

  /**
   * Fetches recently released albums
   * @param options Options for fetching new releases
   * @returns A Page of `SimplifiedAlbum` objects as a Promise
   */
  async fetchNewReleases(options?: FetchNewReleasesOptions): Promise<Page<SimplifiedAlbumObject, SimplifiedAlbum>> {
    const query: GetNewReleasesQuery = {
      country: options?.country,
      limit: options?.limit,
      offset: options?.offset,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetNewReleasesResponse = await this.client._api.browse('new-releases').get(requestData);
    return new Page(this.client, data.albums, SimplifiedAlbum);
  }

  /**
   * Fetches albums from Spotify by searching
   * @param options The options provided for searching albums
   * @returns A `Page` of `SimplifiedAlbum` objects as a Promise
   */
  async search(options: SearchOptions): Promise<Page<SimplifiedAlbumObject, SimplifiedAlbum>> {
    const data: GetSearchResponse = await super._search(options, 'album');
    return new Page(this.client, data.albums, SimplifiedAlbum);
  }
}
