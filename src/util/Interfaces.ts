import type BaseAlbum from '../structures/BaseAlbum.js';
import type SimplifiedAlbum from '../structures/SimplifiedAlbum.js';
import type Album from '../structures/Album.js';
import type Collection from './Collection.js';
import type SimplifiedArtist from '../structures/SimplifiedArtist.js';
import type Artist from '../structures/Artist.js';
import type SimplifiedTrack from '../structures/SimplifiedTrack.js';
import type Track from '../structures/Track.js';
import type SimplifiedEpisode from '../structures/SimplifiedEpisode.js';
import type Episode from '../structures/Episode.js';

/**
 * Base interface for all fetch options
 */
export interface BaseFetchOptions {
  /**
   * Whether to fetch from the API directly or check the cache first
   */
  skipCacheCheck?: boolean;

  /**
   * Whether to cache the fetched content or not
   */
  cacheAfterFetching?: boolean;

  /**
   * The market you’d like to request
   */
  market?: string;
}

/**
 * The object containing client id and secret
 */
export interface ClientCredentials {
  /**
   * The Client ID for the bot
   */
  clientID: string;

  /**
   * The Client Secret for the bot
   */
  clientSecret: string;
}

/**
 * Options used for fetching a single album
 */
export interface FetchAlbumOptions extends BaseFetchOptions {
  /**
   * The album to fetch
   */
  album: AlbumResolvable;
}

/**
 * Options used for fetching multiple albums
 */
export interface FetchAlbumsOptions extends BaseFetchOptions {
  /**
   * The album(s) to fetch (max 20)
   */
  albums: Array<AlbumResolvable>;
}

/**
 * Options used for fetching tracks of an album
 */
export interface FetchAlbumTracksOptions extends Omit<BaseFetchOptions, 'skipCacheCheck' | 'cacheAfterFetching'> {
  /**
   * The maximum number of tracks to fetch. Must be between 1-50, inclusive
   */
  limit: number;

  /**
   * The index of the first track to fetch. Use this with limit to fetch the next set of tracks
   */
  offset: number;
}

export interface FetchArtistOptions extends Omit<BaseFetchOptions, 'market'> {
  /**
   * The artist to fetch
   */
  artist: ArtistResolvable;
}

export interface FetchArtistsOptions extends Omit<BaseFetchOptions, 'market'> {
  /**
   * The artist(s) to fetch
   */
  artists: Array<ArtistResolvable>;
}

export interface FetchEpisodeOptions extends Omit<BaseFetchOptions, 'market'> {
  /**
   * The episode to fetch
   */
  episode: EpisodeResolvable;

  /**
   * The market you’d like to request
   */
  market: string;
}

export interface FetchEpisodesOptions extends Omit<FetchEpisodeOptions, 'episode'> {
  /**
   * The episode(s) to fetch
   */
  episodes: Array<EpisodeResolvable>;
}

export interface FetchTrackOptions extends BaseFetchOptions {
  /**
   * The track to fetch
   */
  track: TrackResolvable;
}

export interface FetchTracksOptions extends BaseFetchOptions {
  /**
   * The tracks(s) to fetch (max 50)
   */
  tracks: Array<TrackResolvable>;
}

export interface StructureConstructable<T> {
  // @ts-ignore
  new(...args: any[]): T;
}

export type AlbumResolvable = string | BaseAlbum | SimplifiedAlbum | Album;

export type ArtistResolvable = string | SimplifiedArtist | Artist;

export type EpisodeResolvable = string | SimplifiedEpisode | Episode;

export type FetchedAlbum<T extends AlbumResolvable | FetchAlbumOptions | FetchAlbumsOptions> = T extends
  | AlbumResolvable
  | FetchAlbumOptions
  ? Album
  : Collection<string, Album>;

export type FetchedArtist<T extends ArtistResolvable | FetchArtistOptions | FetchArtistsOptions> = T extends
  | ArtistResolvable
  | FetchArtistOptions
  ? Artist
  : Collection<string, Artist>;

export type FetchedTrack<T extends TrackResolvable | FetchTrackOptions | FetchTracksOptions> = T extends
  | TrackResolvable
  | FetchTrackOptions
  ? Track
  : Collection<string, Track>;

export type TrackResolvable = string | SimplifiedTrack | Track;
