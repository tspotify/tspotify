import BaseManager from './BaseManager.js';
import Client from '../client/Client.js';
import Artist from '../structures/Artist.js';
import APIOptions from '../structures/APIOptions.js';
import Collection from '../util/Collection.js';
import type SimplifiedArtist from '../structures/SimplifiedArtist.js';
import type { ArtistResolvable, FetchArtistOptions, FetchArtistsOptions, FetchedArtist } from '../util/Interfaces.js';
import type {
  GetArtistResponse,
  GetMultipleArtistsQuery,
  GetMultipleArtistsResponse,
  ArtistObject,
} from 'spotify-api-types';

/**
 * Stores cache for artists and holds their API methods
 */
export default class ArtistManager extends BaseManager<ArtistResolvable, Artist> {
  constructor(client: Client) {
    super(client, Artist as any);
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
    const apiOptions = new APIOptions('api', null, null);
    const data: GetArtistResponse = await this.client._api.artists(id).get(apiOptions);
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
    const apiOptions = new APIOptions('api', query, null);
    const data: GetMultipleArtistsResponse = await this.client._api.artists.get(apiOptions);
    data.artists.forEach(artistObject => {
      const artist = this.add((artistObject as ArtistObject).id, options?.cacheAfterFetching, artistObject);
      artists.set(artist.id, artist);
    });
    return artists;
  }
}
