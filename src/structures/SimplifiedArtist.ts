import BaseStructure from './BaseStructure.js';
import { ExternalUrl } from './Misc.js';
import type Client from '../client/Client.js';
import type Collection from '../util/Collection.js';
import type Track from './Track.js';
import type Artist from './Artist.js';
import type { Page } from './Misc.js';
import type SimplifiedAlbum from './SimplifiedAlbum.js';
import type { FetchArtistAlbumsOptions } from '../typings/Interfaces.js';
import type { SimplifiedArtistObject, SimplifiedAlbumObject } from 'spotify-api-types';

export default class SimplifiedArtist extends BaseStructure {
  /**
   * Known external URLs for this artist
   */
  externalUrls: ExternalUrl;

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

    this.externalUrls = new ExternalUrl(data.external_urls);

    this.href = data.href;

    this.name = data.name;

    this.rawObjectType = data.type;

    this.uri = data.uri;
  }

  /**
   * Fetches top ten tracks of the artist from a given market
   * @param market The market to consider for the top tracks
   * @returns A collection of `Track` objects as a Promise
   */
  async fetchTopTracks(market: string): Promise<Collection<string, Track>> {
    return this.client.artists.fetchTopTracks(this.id, market);
  }

  /**
   * Fetches artists similar to the artist
   * @returns A collection of `Artist` objects as a Promise
   */
  async fetchRelatedArtist(): Promise<Collection<string, Artist>> {
    return this.client.artists.fetchRelatedArtist(this.id);
  }

  /**
   * Fetches albums of the artist
   * @param options Options for fetching the albums
   * @returns A Page of `SimplifiedAlbum` objects as a Promise
   */
  async fetchAlbums(options?: FetchArtistAlbumsOptions): Promise<Page<SimplifiedAlbumObject, SimplifiedAlbum>> {
    return this.client.artists.fetchAlbums(this.id, options);
  }
}
