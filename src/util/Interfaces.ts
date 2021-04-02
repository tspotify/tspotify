import type BaseAlbum from '../structures/BaseAlbum.js';
import type SimplifiedAlbum from '../structures/SimplifiedAlbum.js';
import type Album from '../structures/Album.js';

export type AlbumResolvable = string | BaseAlbum | SimplifiedAlbum | Album;

/**
 * Options used for fetching a single album
 */
export interface FetchAlbumOptions {
  /**
   * The Spotify ID of the album
   */
  album: string | Array<string>;

  /**
   * Whether to fetch album from the API directly or check the cache first
   */
  skipCacheCheck?: boolean;

  /**
   * Whether to cache the fetched album or not
   */
  cacheAfterFetching?: boolean;
}

/**
 * Options used for fetching multiple albums
 */
export interface FetchAlbumsOptions {
  /**
   * An array of Spotify ID of the albums
   */
  albums: Array<string>;

  /**
   * Whether to fetch albums from the API directly or check the cache first
   */
  skipCacheCheck?: boolean;

  /**
   * Whether to cache the fetched albums or not
   */
  cacheAfterFetching?: boolean;
}
