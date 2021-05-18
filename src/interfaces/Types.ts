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
import type { CategoryObject } from 'spotify-api-types';
import type SimplifiedPlaylist from '../structures/SimplifiedPlaylist.js';
import type Playlist from '../structures/Playlist.js';
import type BasePlaylist from '../structures/BasePlaylist.js';
import type AudioFeatures from '../structures/AudioFeatures.js';
import type Category from '../structures/Category.js';
import type { Page } from '../structures/Misc.js';
import {
  FetchAlbumOptions,
  FetchAlbumsOptions,
  FetchArtistOptions,
  FetchArtistsOptions,
  FetchSingleAudioFeaturesOptions,
  FetchMultipleAudioFeaturesOptions,
  FetchCategoryOptions,
  FetchCategoriesOptions,
  FetchEpisodeOptions,
  FetchEpisodesOptions,
  FetchShowOptions,
  FetchShowsOptions,
  FetchTrackOptions,
  FetchTracksOptions,
} from './Interfaces.js';

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

export type SearchItemType = 'album' | 'artist' | 'episode' | 'playlist' | 'show' | 'track';

export type SeedResolvable = ArtistResolvable | string | TrackResolvable;

export type SeedType = 'ARTIST' | 'GENRE' | 'TRACK';

export type ShowResolvable = string | SimplifiedShow | Show;

export type SubdomainType = 'api' | 'account';

export type UserResolvable = string | PublicUser | PrivateUser;

export type TrackResolvable = string | SimplifiedTrack | Track;
