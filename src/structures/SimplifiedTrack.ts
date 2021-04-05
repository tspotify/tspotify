import LinkedTrack from './LinkedTrack.js';
import SimplifiedArtist from './SimplifiedArtist.js';
import Collection from '../util/Collection.js';
import type Client from '../client/Client.js';
import type { SimplifiedTrackObject, SimplifiedArtistObject } from 'spotify-api-types';

export default class SimplifiedTrack extends LinkedTrack {
  /**
   * The artists who performed the track. Each artist object includes a link in `href` to more detailed information about the artist
   */
  artists: Collection<string, SimplifiedArtist>;

  /**
   * A list of the countries in which the track can be played, identified by their `ISO 3166-1 alpha-2` code
   */
  availableMarkets: Array<string>;

  /**
   * The disc number (usually `1` unless the `album` consists of more than one disc)
   */
  discNumber: number;

  /**
   * The track length in `milliseconds`
   */
  duration: number;

  /**
   * Whether or not the track has explicit lyrics (`true`=yes it does, `false`=no it does not or unknown)
   */
  explicit: boolean;

  /**
   * Whether or not the track is from a local file
   */
  isLocal: boolean;

  /**
   * Part of the response when `Track Relinking` is applied. If `true`, the track is playable in the given market. Otherwise `false`
   */
  isPlayable: boolean | null;

  /**
   * Part of the response when `Track Relinking` is applied and is only part of the response if the track linking, in fact, exists. The requested track has been replaced with a different track. The track in the `linkedFrom` object contains information about the originally requested track
   */
  linkedFrom: LinkedTrack | null;

  /**
   * The name of the track
   */
  name: string;

  /**
   * A URL to a `30` second preview (MP3 format) of the track.
   */
  previewUrl: string | null;

  /**
   * Details about restrictions if any on the track
   */
  restrictions: any;

  /**
   * The number of the track. If an album has several discs, the track number is the number on the specified disc
   */
  trackNumber: number;

  constructor(client: Client, data: SimplifiedTrackObject) {
    super(client, data);

    this.artists = this._patchArtists(data.artists);

    this.availableMarkets = data.available_markets;

    this.discNumber = data.disc_number;

    this.duration = data.duration_ms;

    this.explicit = data.explicit;

    this.isLocal = data.is_local;

    this.isPlayable = data?.is_playable ?? null;

    this.linkedFrom = data?.linked_from ? new LinkedTrack(this.client, data.linked_from) : null;

    this.name = data.name;

    this.previewUrl = data?.preview_url ?? null;

    this.restrictions = data.restrictions;

    this.trackNumber = data.track_number;
  }

  private _patchArtists(data: Array<SimplifiedArtistObject>): Collection<string, SimplifiedArtist> {
    const artistsCollection = new Collection<string, SimplifiedArtist>();
    data.forEach(artistObject => {
      artistsCollection.set(artistObject.id, new SimplifiedArtist(this.client, artistObject));
    });
    return artistsCollection;
  }
}
