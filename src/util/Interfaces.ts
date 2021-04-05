import type BaseAlbum from '../structures/BaseAlbum.js';
import type SimplifiedAlbum from '../structures/SimplifiedAlbum.js';
import type Album from '../structures/Album.js';
import type Collection from './Collection.js';

export type AlbumResolvable = string | BaseAlbum | SimplifiedAlbum | Album;

/**
 * Options used for fetching a single album
 */
export interface FetchAlbumOptions {
  /**
   * The album to fetch
   */
  album: AlbumResolvable;

  /**
   * The market you’d like to request
   */
  market?: string;

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
export interface FetchAlbumsOptions extends Omit<FetchAlbumOptions, 'album'> {
  /**
   * The album(s) to fetch (max 20)
   */
  albums: Array<AlbumResolvable>;
}

export type FetchedAlbum<T extends AlbumResolvable | FetchAlbumOptions | FetchAlbumsOptions> = T extends
  | AlbumResolvable
  | FetchAlbumOptions
  ? Album
  : Collection<string, Album>;
