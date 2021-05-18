import PublicUser from './PublicUser.js';
import Track from './Track.js';
import Episode from './Episode.js';
import Collection from '../util/Collection.js';
import SimplifiedTrack from './SimplifiedTrack.js';
import type {
  CopyrightObject,
  ExternalIdObject,
  ExternalUrlObject,
  FollowersObject,
  ImageObject,
  ExplicitContentSettingsObject,
  BaseRestrictionObject,
  AlbumRestrictionObject,
  EpisodeRestrictionObject,
  TrackRestrictionObject,
  PlaylistTracksRefObject,
  PlaylistTrackObject,
  TrackObject,
  EpisodeObject,
  PagingObject,
  RecommendationSeedObject,
  RecommendationsObject,
  SimplifiedTrackObject,
} from 'spotify-api-types';
import type Client from '../client/Client.js';
import type { StructureConstructable } from '../interfaces/Interfaces.js';
import type { SubdomainType } from '../interfaces/Types.js';

/**
 * The details about the access token returned by the API after logging in
 */
export class AccessTokenDetails {
  /**
   * The access token for the client
   */
  accessToken: string;

  /**
   * The type of the token
   */
  tokenType: string;

  /**
   * The time of expiry of the token in seconds
   */
  expiresIn: number;

  /* eslint-disable */
  constructor(data: any) {
    this.accessToken = data?.access_token ?? null;

    this.tokenType = data?.token_type ?? null;

    this.expiresIn = data?.expires_in ?? null;
  }
}

export class BaseRestriction {
  /**
   * The reason for the restriction. Supported values:
   * 
   * `market` - The content item is not available in the given market
   * 
   * `product` - The content item is not available for the user’s subscription type
   * 
   * `explicit` - The content item is explicit and the user’s account is set to not play explicit content
   * 
   * **⚠️Note**: Additional reasons may be added in the future. If you use this field, make sure that your application safely handles unknown values
   */
  reason: string;

  constructor(data: BaseRestrictionObject) {
    this.reason = data.reason;
  }
}

export class AlbumRestriction extends BaseRestriction {
  constructor(data: AlbumRestrictionObject) {
    super(data);
  }
}

export class EpisodeRestriction extends BaseRestriction {
  constructor(data: EpisodeRestrictionObject) {
    super(data);
  }
}

export class TrackRestriction extends BaseRestriction {
  constructor(data: TrackRestrictionObject) {
    super(data);
  }
}

/**
 * Data used for generating an API request
 */
export class RequestData<Q, B> {
  /**
   * The subdomain of the endpoint being requested
   */
  subdomain: SubdomainType;

  /**
   * The query object for the request
   */
  query: Q;

  /**
   * The body of the request
   */
  body: B;

  constructor(subdomain: SubdomainType, query: Q, body: B) {
    this.subdomain = subdomain;
    this.query = query;
    this.body = body;
  }
}

/**
 * Holds copyright details for a content on Spotify
 */
export class Copyright {
  /**
   * The copyright text for this content
   */
  text: string;

  /**
   * The type of copyright: `C` = the copyright, `P` = the sound recording (performance) copyright
   */
  type: string;

  constructor(data: CopyrightObject) {
    this.text = data.text;

    this.type = data.type;
  }
}

/**
 * Holds details about external IDs of a content
 */
export class ExternalId {
  /**
   * International Article Number
   */
  ean: string;

  /**
   * International Standard Recording Code
   */
  isrc: string;

  /**
   * Universal Product Code
   */
  upc: string;

  constructor(data: ExternalIdObject) {
    this.ean = data.ean;

    this.isrc = data.isrc;

    this.upc = data.upc;
  }
}

/**
 * Holds the Spotify URL for the content
 */
export class ExternalUrl {
  /**
   * The Spotify URL for the object
   */
  spotify: string;

  constructor(data: ExternalUrlObject) {
    this.spotify = data.spotify;
  }
}

export class ExplicitContentSettings {
  /**
  * When `true`, indicates that explicit content should not be played
  */
  filterEnabled: boolean;

  /**
   * When `true`, indicates that the explicit content setting is locked and can’t be changed by the user
   */
  filterLocked: boolean;

  constructor(data: ExplicitContentSettingsObject) {
    this.filterEnabled = data.filter_enabled;

    this.filterLocked = data.filter_locked;
  }
}

export class Followers {
  /**
   * A link to the Web API endpoint providing full details of the followers, `null` if not available.
   * 
   * **⚠️Note**: Please note that this will always be set to null, as the Web API does not support it at the moment
   */
  href: string | null;

  /**
  * The total number of followers
  */
  total: number;

  constructor(data: FollowersObject) {
    this.href = data.href;

    this.total = data.total;
  }
}

export class Image {
  /**
   * The image height in pixels
   */
  height: number | null;

  /**
  * The source URL of the image
  */
  url: string;

  /**
   * The image width in pixels
   */
  width: number | null;

  constructor(data: ImageObject) {
    this.height = data?.height ?? null;

    this.url = data.url;

    this.width = data?.width ?? null;
  }
}

export class Page<R, T> {
  private _holds: StructureConstructable<T>;

  client: Client;

  href: string;

  items: Collection<string, T>;

  limit: number;

  next: string | null;

  offset: number;

  previous: string;

  total: number;

  constructor(client: Client, data: PagingObject<R>, structureType: StructureConstructable<T>) {
    Object.defineProperty(this, '_holds', { writable: true });
    this._holds = structureType;

    Object.defineProperty(this, 'client', { writable: true });
    this.client = client;

    this.href = data.href;

    this.items = this._patchItems(data.items);

    this.limit = data.limit;

    this.next = data.next;

    this.offset = data.offset;

    this.previous = data.previous;

    this.total = data.total;
  }

  private _patchItems(data: Array<R>): Collection<string, T> {
    const patchedItems = new Collection<string, T>();
    data.forEach(item => {
      // @ts-ignore
      patchedItems.set(item?.id ?? item.track.id, new this._holds(this.client, item))
    });
    return patchedItems;
  }
}

export class PlaylistTrack {
  /**
   * The date and time the track or episode was added
   * 
   * **⚠️Note**: Some very old playlists may return `null` in this field
   */
  addedAt: Date | null;

  /**
   * The Spotify user who added the track or episode
   * 
   * **⚠️Note**: Some very old playlists may return `null` in this field
   */
  addedBy: PublicUser | null;

  /**
   * Whether this track or episode is a local file or not
   */
  isLocal: boolean;

  /**
  * Information about the track or episode
  */
  track: Track | Episode;

  constructor(client: Client, data: PlaylistTrackObject) {
    this.addedAt = data.added_at;

    this.addedBy = data.added_by?.id ? new PublicUser(client, data.added_by) : null;

    this.isLocal = data.is_local;

    this.track = data.track.type === 'track' ? new Track(client, data.track as TrackObject) : new Episode(client, data.track as EpisodeObject);
  }
}

export class PlaylistTracksRef {
  /**
   * A link to the Web API endpoint where full details of the playlist’s tracks can be retrieved
   */
  href: string;

  /**
   * Number of tracks in the playlist
   */
  total: number;

  constructor(data: PlaylistTracksRefObject) {
    this.href = data.href;

    this.total = data.total;
  }
}

export class RecommendationSeed {
  /**
   * The number of tracks available after `min_*` and `max_*` filters have been applied
   */
  afterFilteringSize: number;

  /**
   * The number of tracks available after relinking for regional availability
   */
  afterRelinkingSize: number;

  /**
   * A link to the full track or artist data for this seed. For tracks this will be a link to a `Track`. For artists a link to an `Artist`. For genre seeds, this value will be `null`
   */
  href: string | null;

  /**
   * The id used to select this seed. This will be same as the string used in `seed` parameter of `SeedData`
   */
  id: string;

  /**
   * The number of recommended tracks available for this seed
   */
  initialPoolSize: number;

  /**
   * The entity type of this seed
   * 
   * One of `ARTIST`, `TRACK` or `GENRE`
   */
  type: string;

  constructor(data: RecommendationSeedObject) {
    this.afterFilteringSize = data.afterFilteringSize;

    this.afterRelinkingSize = data.afterRelinkingSize;

    this.href = data.href;

    this.id = data.id;

    this.initialPoolSize = data.initialPoolSize;

    this.type = data.type;
  }
}

export class Recommendation {
  /**
   * The client that instantiated this
   */
  client: Client;

  /**
   * An array of recommendation seed objects
   */
  seeds: Array<RecommendationSeed>;

  /**
   * A collection of simplified track objects, ordered according to the parameters supplied
   */
  tracks: Collection<string, SimplifiedTrack>;

  constructor(client: Client, data: RecommendationsObject) {
    Object.defineProperty(this, 'client', { writable: true });
    this.client = client;

    this.seeds = this._patchSeeds(data.seeds);

    this.tracks = this._patchTracks(data.tracks);
  }

  private _patchSeeds(data: Array<RecommendationSeedObject>): Array<RecommendationSeed> {
    const patchedSeeds: Array<RecommendationSeed> = [];
    data.forEach(recommendationSeedObject => {
      patchedSeeds.push(new RecommendationSeed(recommendationSeedObject));
    });
    return patchedSeeds;
  }

  private _patchTracks(data: Array<SimplifiedTrackObject>): Collection<string, SimplifiedTrack> {
    const patchedTracks = new Collection<string, SimplifiedTrack>();
    data.forEach(simplifiedTrackObject => {
      patchedTracks.set(simplifiedTrackObject.id, new SimplifiedTrack(this.client, simplifiedTrackObject));
    });
    return patchedTracks;
  }
}