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
import type SimplifiedShow from '../structures/SimplifiedShow.js';
import type Show from '../structures/Show.js';
import type PublicUser from '../structures/PublicUser.js';
import type PrivateUser from '../structures/PrivateUser.js';
import type { AlbumGroupType, CategoryObject } from 'spotify-api-types';
import type SimplifiedPlaylist from '../structures/SimplifiedPlaylist.js';
import type Playlist from '../structures/Playlist.js';
import type BasePlaylist from '../structures/BasePlaylist.js';
import type AudioFeatures from '../structures/AudioFeatures.js';
import type Category from '../structures/Category.js';
import type { Page } from '../structures/Misc.js';

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

/**
 * Options used for fetching a collection of `SimplifiedAlbum` objects of an artist
 */
export interface FetchArtistAlbumsOptions {
  /**
   * The types of album groups to inlcude in the result
   */
  includeGroups?: Array<AlbumGroupType>;

  /**
   * The maximum number of albums to fetch
   */
  limit?: number;

  /**
   * The market to request
   */
  market?: string;

  /**
   * The index of the first album to fetch. Use this with limit to fetch the next set of albums
   */
  offset?: number;
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

export interface FetchCategoryOptions extends Omit<BaseFetchOptions, 'market'> {
  categoryResolvable: CategoryResolvable;

  country?: string;

  locale?: string;
}

export interface FetchCategoriesOptions {
  country?: string;

  locale?: string;

  limit?: number;

  offset?: number;
}

export interface FetchCategoryPlaylistsOptions {
  country?: string;

  limit?: number;

  offset?: number;
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

export interface FetchFeaturedPlaylistsOptions extends FetchCategoriesOptions {
  timestamp?: string;
}

export interface FetchPlaylistItemsOptions {
  /**
   * The maximum number of items to fetch
   */
  limit?: number;

  /**
   * The playlist whose items are to be fetched
   */
  playlist: PlaylistResolvable;

  /**
   * The market to request
   */
  market: string;

  /**
   * The index of the first item to fetch. Use this with limit to fetch the next set of items
   */
  offset?: number;
}

export interface FetchShowEpisodesOptions {
  show: ShowResolvable;

  /**
   * The maximum number of episodes to fetch
   */
  limit?: number;

  /**
   * The market to request
   */
  market: string;

  /**
   * The index of the first episode to fetch. Use this with limit to fetch the next set of episodes
   */
  offset?: number;
}

export interface FetchPlaylistOptions extends Omit<BaseFetchOptions, 'market'> {
  /**
   * The playlist to fetch
   */
  playlist: PlaylistResolvable;

  /**
   * The market to request
   */
  market: string;
}

export interface FetchShowOptions extends Omit<BaseFetchOptions, 'market'> {
  /**
   * The show to fetch
   */
  show: ShowResolvable;

  /**
   * The market you would like to request
   */
  market: string;
}

export interface FetchShowsOptions {
  /**
   * The show(s) to fetch
   */
  shows: Array<ShowResolvable>;

  /**
   * The market you would like to request
   */
  market: string;
}

/**
 * Options used for fetching a user from Spotify
 */
export interface FetchUserOptions extends Omit<BaseFetchOptions, 'market'> {
  user: UserResolvable;
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

/**
 * Options used for fetching playlists of a user
 */
export interface FetchUserPlaylistsOptions {
  /**
   * The maximum number of tracks to fetch. Must be between 1-50, inclusive
   */
  limit?: number;

  /**
   * The index of the first track to fetch. Use this with limit to fetch the next set of tracks
   */
  offset?: number;
}

export interface FetchSingleAudioFeaturesOptions extends Omit<BaseFetchOptions, 'market'> {
  track: TrackResolvable;
}

export interface FetchMultipleAudioFeaturesOptions extends Omit<BaseFetchOptions, 'market'> {
  tracks: Array<TrackResolvable>;
}

export interface StructureConstructable<T> {
  // @ts-ignore
  new(...args: any[]): T;
}

export type AlbumResolvable = string | BaseAlbum | SimplifiedAlbum | Album;

export type ArtistResolvable = string | SimplifiedArtist | Artist;

export type CategoryResolvable = string | Category;

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

export type FetchedAudioFeatures<
  T extends TrackResolvable | FetchSingleAudioFeaturesOptions | FetchMultipleAudioFeaturesOptions
  > = T extends TrackResolvable | FetchSingleAudioFeaturesOptions ? AudioFeatures : Array<AudioFeatures>;

export type FetchedCategory<T extends CategoryResolvable | FetchCategoryOptions | FetchCategoriesOptions> = T extends
  | CategoryResolvable
  | FetchCategoryOptions
  ? Category
  : Page<CategoryObject, Category>;

export type FetchedEpisode<T extends FetchEpisodeOptions | FetchEpisodesOptions> = T extends FetchEpisodeOptions
  ? Episode
  : Collection<string, Episode>;

export type FetchedShow<T extends FetchShowOptions | FetchShowsOptions> = T extends FetchShowOptions
  ? Show
  : Collection<string, SimplifiedShow>;

export type FetchedTrack<T extends TrackResolvable | FetchTrackOptions | FetchTracksOptions> = T extends
  | TrackResolvable
  | FetchTrackOptions
  ? Track
  : Collection<string, Track>;

export type PlaylistResolvable = string | BasePlaylist | SimplifiedPlaylist | Playlist;

export type ShowResolvable = string | SimplifiedShow | Show;

export type SubdomainType = 'api' | 'account';

export type UserResolvable = string | PublicUser | PrivateUser;

export type TrackResolvable = string | SimplifiedTrack | Track;
