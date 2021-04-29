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
} from 'spotify-api-types';
import type { SubdomainType } from '../util/Interfaces.js';

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