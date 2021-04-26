import type { CopyrightObject, ExternalIdObject, ExternalUrlObject } from 'spotify-api-types';
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
