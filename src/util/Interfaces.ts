import type BaseAlbum from '../structures/BaseAlbum.js';
import type SimplifiedAlbum from '../structures/SimplifiedAlbum.js';
import type Album from '../structures/Album.js';
import type Collection from './Collection.js';
import type SimplifiedArtist from '../structures/SimplifiedArtist.js';
import type Artist from '../structures/Artist.js';

export type AlbumResolvable = string | BaseAlbum | SimplifiedAlbum | Album;

export type ArtistResolvable = string | SimplifiedArtist | Artist;

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
export interface FetchAlbumsOptions extends Omit<FetchAlbumOptions, 'album' | 'skipCacheCheck' | 'cacheAfterFetching'> {
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

/**
 * Options used for fetching tracks of an album
 */
export interface FetchAlbumTracksOptions {
  /**
   * The market you would like to request
   */
  market?: string;

  /**
   * The maximum number of tracks to fetch. Must be between 1-50, inclusive
   */
  limit: number;

  /**
   * The index of the first track to fetch. Use this with limit to fetch the next set of tracks
   */
  offset: number;
}
