import BaseManager from './BaseManager.js';
import Client from '../client/Client.js';
import Artist from '../structures/Artist.js';
import type SimplifiedArtist from '../structures/SimplifiedArtist.js';
import type { ArtistResolvable } from '../util/Interfaces.js';

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
    let artist = super.resolve(artistResolvable);
    if (artist) return artist;
    if ((artistResolvable as SimplifiedArtist).id) {
      const id = (artistResolvable as SimplifiedArtist).id;
      artist = super.resolve(id);
      if (artist) return artist;
    }
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
}
