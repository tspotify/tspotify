import type { AlbumGroupType } from 'spotify-api-types';
import type {
  AlbumResolvable,
  ArtistResolvable,
  CategoryResolvable,
  EpisodeResolvable,
  PlaylistResolvable,
  SeedResolvable,
  SeedType,
  ShowResolvable,
  TrackResolvable,
  UserResolvable,
} from './Types.js';
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
 * Information related to the API
 */
export interface ApiOptions {
  /**
   * Current default version of the API
   */
  version: number;

  /**
   * The base URL of the API
   */
  baseURL: string;

  /**
   * The base URL for account authorization and login
   */
  baseAccountServiceURL: string;
}

export interface AttributeValues {
  /**
   * The ceiling value for the attribute. It would restrict results to only those tracks with a value of the attribute lower than this value
   */
  max?: number;

  /**
   * The floor value for the attribute. It would restrict results to only those tracks with a value of the attribute greater than this value
   */
  min?: number;

  /**
   * The target value for the attribute. It would return tracks with a value of the attribute nearest to this value
   */
  target?: number;
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
 * Options with which the client gets initiated with
 */
export interface ClientOptions {
  /**
   * The details about API endpoint
   */
  api: ApiOptions;
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

export interface FetchCategoriesOptions extends Country_O, Locale_O, Limit_O, Offset_O { }

export interface FetchCategoryOptions extends CacheAfterFetching_O, Country_O, Locale_O, SkipCacheCheck_O {
  categoryResolvable: CategoryResolvable;
}

export interface FetchCategoryPlaylistsOptions extends Country_O, Limit_O, Offset_O { }

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

export interface FetchMultipleAudioFeaturesOptions extends CacheAfterFetching_O, SkipCacheCheck_O {
  tracks: Array<TrackResolvable>;
}

export interface FetchNewReleasesOptions extends Country_O, Limit_O, Offset_O { }

export interface FetchPlaylistItemsOptions extends Limit_O, Market_R, Offset_O {
  /**
   * The playlist whose items are to be fetched
   */
  playlist: PlaylistResolvable;
}

export interface FetchPlaylistOptions extends CacheAfterFetching_O, Market_R, SkipCacheCheck_O {
  /**
   * The playlist to fetch
   */
  playlist: PlaylistResolvable;
}

export interface FetchRecommendationsOptions extends Limit_O, Market_O {
  /**
   * A combination of artists, genres, and tracks as seeds for the recommendations
   *
   * The total count of all types of seeds together can be upto 5
   */
  seeds: Array<SeedData>;

  /**
   * A confidence measure from `0.0` to `1.0` of whether the track is acoustic
   *
   * `1.0` represents high confidence the track is acoustic
   */
  acousticness?: AttributeValues;

  /**
   * Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity
   *
   * A value of `0.0` is least danceable and `1.0` is most danceable
   */
  danceability?: AttributeValues;

  /**
   * The duration of the track in milliseconds
   */
  duration?: AttributeValues;

  /**
   * Energy is a measure from `0.0` to `1.0` and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy
   */
  energy?: AttributeValues;

  /**
   * Predicts whether a track contains no vocals. `Ooh` and `aah` sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly `vocal`. The closer the instrumentalness value is to `1.0`, the greater likelihood the track contains no vocal content. Values above `0.5` are intended to represent instrumental tracks, but confidence is higher as the value approaches `1.0`
   */
  instrumentalness?: AttributeValues;

  /**
   * The key the track is in. Integers map to pitches using standard Pitch Class notation
   *
   * E.g: `0 = C`, `1 = C♯/D♭`, `2 = D` and so on
   */
  key?: AttributeValues;

  /**
   * Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above `0.8` provides strong likelihood that the track is live
   */
  liveness?: AttributeValues;

  /**
   * The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typical range between `-60` and `0` dB
   */
  loudness?: AttributeValues;

  /**
   * Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by `1` and minor is `0`
   */
  mode?: AttributeValues;

  /**
   * The popularity of the track. The value will be between `0` and `100`, with `100` being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are
   *
   * **⚠️Note**: When applying `track relinking` via the market parameter, it is expected to find relinked tracks with popularities that do not match `min_*`, `max_*` and `target_*` popularities. These relinked tracks are accurate replacements for unplayable tracks with the expected popularity scores. Original, non-relinked tracks are available via the `linked_from` attribute of the relinked track response
   */
  popularity?: AttributeValues;

  /**
   * Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to `1.0` the attribute value. Values above `0.66` describe tracks that are probably made entirely of spoken words. Values between `0.33` and `0.66` describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below `0.33` most likely represent music and other non-speech-like tracks
   */
  speechiness?: AttributeValues;

  /**
   * The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration
   */
  tempo?: AttributeValues;

  /**
   * An estimated overall time signature of a track. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure)
   */
  timeSignature?: AttributeValues;

  /**
   * A measure from `0.0` to `1.0` describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).
   */
  valence?: AttributeValues;
}

export interface FetchShowEpisodesOptions extends Limit_O, Market_R, Offset_O {
  show: ShowResolvable;
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

export interface FetchSingleAudioFeaturesOptions extends CacheAfterFetching_O, SkipCacheCheck_O {
  track: TrackResolvable;
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
 * Options used for fetching a user from Spotify
 */
export interface FetchUserOptions extends CacheAfterFetching_O, SkipCacheCheck_O {
  user: UserResolvable;
}

/**
 * Options used for fetching playlists of a user
 */
export interface FetchUserPlaylistsOptions extends Limit_O, Offset_O { }

export interface StructureConstructable<T> {
  // @ts-ignore
  new(...args: any[]): T;
}

export interface SearchOptions extends Market_O, Limit_O, Offset_O {
  /**
   * The query for the search
   */
  query: string;

  includeExternal?: string;
}

export interface SeedData {
  /**
   * The seed for generating recommendations
   */
  seed: SeedResolvable;

  /**
   * The type of this seed
   */
  type: SeedType;
}
