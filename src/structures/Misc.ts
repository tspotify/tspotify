import type { CopyrightObject, ExternalIdObject, ExternalUrlObject } from 'spotify-api-types';

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
