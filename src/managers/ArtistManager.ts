import BaseManager from './BaseManager.js';
import Client from '../client/Client.js';
import Artist from '../structures/Artist.js';
import { RequestData } from '../structures/Misc.js';
import Collection from '../util/Collection.js';
import Track from '../structures/Track.js';
import SimplifiedAlbum from '../structures/SimplifiedAlbum.js';
import { Page } from '../structures/Misc.js';
import type SimplifiedArtist from '../structures/SimplifiedArtist.js';
import type {
  ArtistResolvable,
  FetchArtistOptions,
  FetchArtistsOptions,
  FetchedArtist,
  FetchArtistAlbumsOptions,
  SearchOptions,
} from '../interfaces/Interfaces.js';
import type {
  GetArtistResponse,
  GetMultipleArtistsQuery,
  GetMultipleArtistsResponse,
  ArtistObject,
  GetArtistTopTracksQuery,
  GetArtistTopTracksResponse,
  GetRelatedArtistsResponse,
  GetArtistAlbumsQuery,
  GetArtistAlbumsResponse,
  SimplifiedAlbumObject,
  GetSearchResponse,
} from 'spotify-api-types';

/**
 * Stores cache for artists and holds their API methods
 */
export default class ArtistManager extends BaseManager<ArtistResolvable, Artist> {
  constructor(client: Client) {
    super(client, Artist);
  }

  /**
   * Resolves an ArtistResolvable to an Artist object
   */
  resolve(artistResolvable: ArtistResolvable): Artist | null {
    const artist = super.resolve(artistResolvable);
    if (artist) return artist;
    const artistID = this.resolveID(artistResolvable);
    if (artistID) return super.resolve(artistID);
    return null;
  }

  /**
   * Resolves an ArtistResolvable to an Artist ID
   */
  resolveID(artistResolvable: ArtistResolvable): string | null {
    const artistID = super.resolveID(artistResolvable);
    if (artistID) return artistID;
    if ((artistResolvable as SimplifiedArtist).id) {
      return (artistResolvable as SimplifiedArtist).id;
    }
    return null;
  }

  /**
   * Fetches artist(s) from Spotify
   */
  async fetch<T extends ArtistResolvable | FetchArtistOptions | FetchArtistsOptions>(
    options: T,
  ): Promise<FetchedArtist<T> | null> {
    if (!options) throw new Error('No artist IDs were provided');
    const artistId = this.resolveID(options as ArtistResolvable);
    // @ts-ignore
    if (artistId) return this._fetchSingle(artistId);
    const artist = (options as FetchArtistOptions)?.artist;
    if (artist) {
      const artistId = this.resolveID(artist);
      // @ts-ignore
      if (artistId) return this._fetchSingle(artistId, options);
    }
    const artists = (options as FetchArtistsOptions)?.artists;
    if (artists) {
      if (Array.isArray(artists)) {
        const artistIds = artists.map(artist => this.resolveID(artist));
        // @ts-ignore
        if (artistIds) return this._fetchMany(artistIds, options);
      }
    }
    return null;
  }

  private async _fetchSingle(id: string, options?: FetchArtistOptions): Promise<Artist> {
    if (!options?.skipCacheCheck) {
      const cachedArtist = this.cache.get(id);
      if (cachedArtist) return cachedArtist;
    }
    const requestData = new RequestData('api', null, null);
    const data: GetArtistResponse = await this.client._api.artists(id).get(requestData);
    return this.add(data.id, options?.cacheAfterFetching, data);
  }

  private async _fetchMany(ids: Array<string>, options?: FetchArtistsOptions): Promise<Collection<string, Artist>> {
    const artists = new Collection<string, Artist>();
    if (!options?.skipCacheCheck) {
      const cachedArtists: Array<string> = [];
      ids.forEach(id => {
        const artist = this.cache.get(id);
        if (artist) {
          artists.set(artist.id, artist);
          cachedArtists.push(id);
        }
      });
      ids = ids.filter(id => !cachedArtists.includes(id));
    }
    const query: GetMultipleArtistsQuery = {
      ids,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetMultipleArtistsResponse = await this.client._api.artists.get(requestData);
    data.artists.forEach(artistObject => {
      const artist = this.add((artistObject as ArtistObject).id, options?.cacheAfterFetching, artistObject);
      artists.set(artist.id, artist);
    });
    return artists;
  }

  /**
   * Fetches top ten tracks of an artist from a given market
   * @param artist The artist whose top tracks are to be fetched
   * @param market The market to consider for the top tracks
   * @returns A collection of `Track` objects as a Promise
   */
  async fetchTopTracks(artist: ArtistResolvable, market: string): Promise<Collection<string, Track>> {
    if (!market || typeof market !== 'string') throw new Error('Invalid market');
    const artistID = this.resolveID(artist);
    if (!artistID) throw new Error('Invalid artist');
    const query: GetArtistTopTracksQuery = {
      market,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetArtistTopTracksResponse = await this.client._api.artists(artistID, 'top-tracks').get(requestData);
    const tracks = new Collection<string, Track>();
    data.tracks.forEach(trackObject => {
      const track = new Track(this.client, trackObject);
      tracks.set(track.id, track);
    });
    return tracks;
  }

  /**
   * Fetches artists similar to a given artist
   * @param artist The artist whose relation are to be fetched
   * @returns A collection of `Artist` objects as a Promise
   */
  async fetchRelatedArtist(artist: ArtistResolvable): Promise<Collection<string, Artist>> {
    const artistID = this.resolveID(artist);
    if (!artistID) throw new Error('Invalid artist');
    const requestData = new RequestData('api', null, null);
    const data: GetRelatedArtistsResponse = await this.client._api
      .artists(artistID, 'related-artists')
      .get(requestData);
    const artists = new Collection<string, Artist>();
    data.artists.forEach(artistObject => {
      const artist = new Artist(this.client, artistObject);
      artists.set(artist.id, artist);
    });
    return artists;
  }

  /**
   * Fetches albums of an artist
   * @param artist The artist whose albums are to be fetched
   * @param options Options for fetching the albums
   * @returns A Page of `SimplifiedAlbum` objects as a Promise
   */
  async fetchAlbums(
    artist: ArtistResolvable,
    options?: FetchArtistAlbumsOptions,
  ): Promise<Page<SimplifiedAlbumObject, SimplifiedAlbum>> {
    const artistID = this.resolveID(artist);
    if (!artistID) throw new Error('Invalid artist');
    const query: GetArtistAlbumsQuery = {
      include_groups: options?.includeGroups,
      limit: options?.limit,
      market: options?.market,
      offset: options?.offset,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetArtistAlbumsResponse = await this.client._api.artists(artistID).albums.get(requestData);
    return new Page(this.client, data, SimplifiedAlbum);
  }

  /**
   * Fetches artists from Spotify by searching
   * @param options The options provided for searching artists
   * @returns A `Page` of `Artist` objects as a Promise
   */
  async search(options: SearchOptions): Promise<Page<ArtistObject, Artist>> {
    const data: GetSearchResponse = await super._search(options, 'artist');
    return new Page(this.client, data.artists, Artist);
  }
}
