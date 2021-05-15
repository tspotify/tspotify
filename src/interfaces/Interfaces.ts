import type BaseAlbum from '../structures/BaseAlbum.js';
import type SimplifiedAlbum from '../structures/SimplifiedAlbum.js';
import type Album from '../structures/Album.js';
import type Collection from '../util/Collection.js';
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
import {
  CacheAfterFetching_O,
  Country_O,
  Limit_O,
  Limit_R,
  Locale_O,
  Market_O,
  Market_R,
  Offset_O,
  Offset_R,
  SkipCacheCheck_O,
} from './Util.js';

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
export interface FetchAlbumOptions extends CacheAfterFetching_O, Market_O, SkipCacheCheck_O {
  /**
   * The album to fetch
   */
  album: AlbumResolvable;
}

/**
 * Options used for fetching multiple albums
 */
export interface FetchAlbumsOptions extends CacheAfterFetching_O, Market_O, SkipCacheCheck_O {
  /**
   * The album(s) to fetch (max 20)
   */
  albums: Array<AlbumResolvable>;
}

/**
 * Options used for fetching tracks of an album
 */
export interface FetchAlbumTracksOptions extends Limit_R, Market_O, Offset_R { }

/**
 * Options used for fetching a collection of `SimplifiedAlbum` objects of an artist
 */
export interface FetchArtistAlbumsOptions extends Limit_O, Market_O, Offset_O {
  /**
   * The types of album groups to inlcude in the result
   */
  includeGroups?: Array<AlbumGroupType>;
}

export interface FetchArtistOptions extends CacheAfterFetching_O, SkipCacheCheck_O {
  /**
   * The artist to fetch
   */
  artist: ArtistResolvable;
}

export interface FetchArtistsOptions extends CacheAfterFetching_O, SkipCacheCheck_O {
  /**
   * The artist(s) to fetch
   */
  artists: Array<ArtistResolvable>;
}

export interface FetchCategoryOptions extends CacheAfterFetching_O, Country_O, Locale_O, SkipCacheCheck_O {
  categoryResolvable: CategoryResolvable;
}

export interface FetchCategoriesOptions extends Country_O, Locale_O, Limit_O, Offset_O { }

export interface FetchCategoryPlaylistsOptions extends Country_O, Limit_O, Offset_O { }

export interface FetchNewReleasesOptions extends Country_O, Limit_O, Offset_O { }

export interface FetchEpisodeOptions extends CacheAfterFetching_O, SkipCacheCheck_O, Market_R {
  /**
   * The episode to fetch
   */
  episode: EpisodeResolvable;
}

export interface FetchEpisodesOptions extends CacheAfterFetching_O, SkipCacheCheck_O, Market_R {
  /**
   * The episode(s) to fetch
   */
  episodes: Array<EpisodeResolvable>;
}

export interface FetchFeaturedPlaylistsOptions extends Country_O, Locale_O, Limit_O, Offset_O {
  timestamp?: string;
}

export interface FetchPlaylistItemsOptions extends Limit_O, Market_R, Offset_O {
  /**
   * The playlist whose items are to be fetched
   */
  playlist: PlaylistResolvable;
}

export interface FetchShowEpisodesOptions extends Limit_O, Market_R, Offset_O {
  show: ShowResolvable;
}

export interface FetchPlaylistOptions extends CacheAfterFetching_O, Market_R, SkipCacheCheck_O {
  /**
   * The playlist to fetch
   */
  playlist: PlaylistResolvable;
}

export interface FetchShowOptions extends CacheAfterFetching_O, Market_R, SkipCacheCheck_O {
  /**
   * The show to fetch
   */
  show: ShowResolvable;
}

export interface FetchShowsOptions extends Market_R {
  /**
   * The show(s) to fetch
   */
  shows: Array<ShowResolvable>;
}

/**
 * Options used for fetching a user from Spotify
 */
export interface FetchUserOptions extends CacheAfterFetching_O, SkipCacheCheck_O {
  user: UserResolvable;
}

export interface FetchTrackOptions extends CacheAfterFetching_O, Market_O, SkipCacheCheck_O {
  /**
   * The track to fetch
   */
  track: TrackResolvable;
}

export interface FetchTracksOptions extends CacheAfterFetching_O, Market_O, SkipCacheCheck_O {
  /**
   * The tracks(s) to fetch (max 50)
   */
  tracks: Array<TrackResolvable>;
}

/**
 * Options used for fetching playlists of a user
 */
export interface FetchUserPlaylistsOptions extends Limit_O, Offset_O { }

export interface FetchSingleAudioFeaturesOptions extends CacheAfterFetching_O, SkipCacheCheck_O {
  track: TrackResolvable;
}

export interface FetchMultipleAudioFeaturesOptions extends CacheAfterFetching_O, SkipCacheCheck_O {
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
