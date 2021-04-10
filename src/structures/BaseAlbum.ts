import BaseStructure from './BaseStructure.js';
import SimplifiedArtist from './SimplifiedArtist.js';
import Client from '../client/Client.js';
import { ExternalUrl } from './Misc.js';
import Collection from '../util/Collection.js';
import APIOptions from './APIOptions.js';
import SimplifiedTrack from './SimplifiedTrack.js';
import type {
  AlbumObject,
  SimplifiedArtistObject,
  SimplifiedAlbumObject,
  GetAlbumTracksQuery,
  GetAlbumTracksResponse,
} from 'spotify-api-types';
import type { FetchAlbumTracksOptions } from '../util/Interfaces.js';

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
  artists: Collection<string, SimplifiedArtist>;

  /**
   * The markets in which the album is available
   */
  availableMarkets: Array<string>;

  /**
   * Known external URLs for the album
   */
  externalUrls: ExternalUrl;

  /**
   * A link to the Web API endpoint providing full details of the album
   */
  href: string;

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
    super(client, data.id);

    this.type = data.album_type;

    this.artists = this._patchArtists(data.artists);

    this.availableMarkets = data.available_markets;

    this.externalUrls = new ExternalUrl(data.external_urls);

    this.href = data.href;

    this.images = data.images;

    this.name = data.name;

    this.releaseDate = data.release_date;

    this.releaseDatePrecision = data.release_date_precision;

    this.restrictions = data?.restrictions ?? null;

    this.rawObjectType = data.type;

    this.uri = data.uri;
  }

  private _patchArtists(data: Array<SimplifiedArtistObject>): Collection<string, SimplifiedArtist> {
    const artistsCollection = new Collection<string, SimplifiedArtist>();
    data.forEach(artistObject => {
      artistsCollection.set(artistObject.id, new SimplifiedArtist(this.client, artistObject));
    });
    return artistsCollection;
  }

  /**
   * Fetches tracks of the album
   */
  async fetchTracks(options?: FetchAlbumTracksOptions): Promise<Collection<string, SimplifiedTrack>> {
    const query: GetAlbumTracksQuery = {
      market: options?.market,
      limit: options?.limit,
      offset: options?.offset,
    };
    const apiOptions = new APIOptions('api', query, null);
    const data: GetAlbumTracksResponse = await this.client._api.albums(this.id).tracks.get(apiOptions);
    const tracksCollection = new Collection<string, SimplifiedTrack>();
    data.items.forEach(item => {
      const track = new SimplifiedTrack(this.client, item);
      tracksCollection.set(track.id, track);
    });
    return tracksCollection;
  }
}
