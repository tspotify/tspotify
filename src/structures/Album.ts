import Client from '../client/Client.js';
import BaseStructure from './BaseStructure.js';
import Artist from './Artist.js';
import type { AlbumObject } from 'spotify-api-types';

/**
 * Represents an album on Spotify
 */
export default class Album extends BaseStructure {
  /**
   * The type of the album
   */
  albumType: string;

  /**
   * The artists of the album
   */
  artists: Array<Artist>;

  /**
   * The markets in which the album is available
   */
  availableMarkets: Array<string>;

  /**
   * The copyright statements of the album
   */
  copyrights: Array<any>;

  /**
   * Known external IDs for the album
   */
  externalIds: object;

  /**
   * Known external URLs for the album
   */
  externalUrls: object;

  /**
   * A list of the genres used to classify the album
   */
  genres: Array<string>;

  /**
   * A link to the Web API endpoint providing full details of the album
   */
  href: string;

  /**
   * The Spotify ID of the alnum
   */
  id: string;

  /**
   * The cover art for the album in various sizes, widest first
   */
  images: Array<object>;

  /**
   * The label for the album
   */
  label: string;

  /**
   * The name of the album
   */
  name: string;

  constructor(client: Client, data: AlbumObject) {
    super(client);

    this.albumType = data?.album_type ?? null;

    this.artists = ((data?.artists as unknown) as Array<Artist>) ?? null;

    this.availableMarkets = data?.available_markets ?? null;

    this.copyrights = data?.copyrights ?? null;

    this.externalIds = data?.external_ids ?? null;

    this.externalUrls = data?.external_urls ?? null;

    this.genres = data?.genres ?? null;

    this.href = data?.href ?? null;

    this.id = data?.id ?? null;

    this.images = data?.images ?? null;

    this.label = data?.label ?? null;

    this.name = data?.name ?? null;
  }
}
