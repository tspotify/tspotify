import BaseStructure from './BaseStructure.js';
import Client from '../client/Client.js';
import type { SimplifiedArtistObject } from 'spotify-api-types';

export default class SimplifiedArtist extends BaseStructure {
  /**
   * Known external URLs for this artist
   */
  externalUrls: object;

  /**
   * A link to the Web API endpoint providing full details of the artist
   */
  href: string;

  /**
   * The name of the artist
   */
  name: string;

  /**
   * The raw object type returned by the API: `artist`
   */
  rawObjectType: string;

  /**
   * The Spotify URI for the artist
   */
  uri: string;

  constructor(client: Client, data: SimplifiedArtistObject) {
    super(client, data.id);

    this.externalUrls = data.external_urls;

    this.href = data.href;

    this.name = data.name;

    this.rawObjectType = data.type;

    this.uri = data.uri;
  }
}
