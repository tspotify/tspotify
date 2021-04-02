import BaseStructure from './BaseStructure.js';
import SimplifiedArtist from './SimplifiedArtist.js';
import Client from '../client/Client.js';
import type { AlbumObject, SimplifiedArtistObject, SimplifiedAlbumObject } from 'spotify-api-types';

/**
 * Base class for all album-like structures
 */
export default class BaseAlbum extends BaseStructure {
  /**
   * The type of the album
   */
  type: string;

  /**
   * The artists of the album
   */
  artists: Array<SimplifiedArtist>;

  /**
   * The markets in which the album is available
   */
  availableMarkets: Array<string>;

  /**
   * Known external URLs for the album
   */
  externalUrls: object;

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
   * The name of the album
   */
  name: string;

  /**
   * The date the album was first released, for example `1981-12-15`. Depending on the precision, it might be shown as `1981` or `1981-12`
   */
  releaseDate: string;

  /**
   * The precision with which `releaseDate` value is known: `year`, `month`, or `day`
   */
  releaseDatePrecision: string;

  /**
   * Included in the response when a content restriction is applied
   */
  restrictions: object | null;

  /**
   * The raw object type returned by the api: `album`
   */
  rawObjectType: string;

  /**
   * The Spotify URI for the album
   */
  uri: string;

  constructor(client: Client, data: AlbumObject | SimplifiedAlbumObject) {
    super(client);

    this.type = data.album_type;

    this.artists = this._patchArtists(data.artists);

    this.availableMarkets = data.available_markets;

    this.externalUrls = data.external_urls;

    this.href = data.href;

    this.id = data.id;

    this.images = data.images;

    this.name = data.name;

    this.releaseDate = data.release_date;

    this.releaseDatePrecision = data.release_date_precision;

    this.restrictions = data?.restrictions ?? null;

    this.rawObjectType = data.type;

    this.uri = data.uri;
  }

  private _patchArtists(data: Array<SimplifiedArtistObject>): Array<SimplifiedArtist> {
    const artistsArray: Array<SimplifiedArtist> = [];
    data.forEach(artistObject => {
      artistsArray.push(new SimplifiedArtist(this.client, artistObject));
    });
    return artistsArray;
  }
}
