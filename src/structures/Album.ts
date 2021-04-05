import Client from '../client/Client.js';
import BaseAlbum from './BaseAlbum.js';
import SimplifiedTrack from './SimplifiedTrack.js';
import { Copyright, ExternalId } from './Misc.js';
import type { AlbumObject, SimplifiedTrackObject, CopyrightObject } from 'spotify-api-types';

/**
 * Represents an album on Spotify
 */
export default class Album extends BaseAlbum {
  /**
   * The copyright statements of the album
   */
  copyrights: Array<Copyright>;

  /**
   * Known external IDs for the album
   */
  externalIds: ExternalId;

  /**
   * A list of the genres used to classify the album
   */
  genres: Array<string>;

  /**
   * The label for the album
   */
  label: string;

  /**
   * The popularity of the album. The value will be between `0` and `100`, with `100` being the most popular. The popularity is calculated from the popularity of the album’s individual tracks
   */
  popularity: number;

  /**
   * The tracks of the album
   */
  tracks: Array<SimplifiedTrack>;

  constructor(client: Client, data: AlbumObject) {
    super(client, data);

    this.copyrights = this._patchCopyrights(data.copyrights);

    this.externalIds = new ExternalId(data.external_ids);

    this.genres = data.genres;

    this.label = data.label;

    this.popularity = data.popularity;

    this.tracks = this._patchTracks(data.tracks.items);
  }

  private _patchTracks(data: Array<SimplifiedTrackObject>): Array<SimplifiedTrack> {
    const trackArray: Array<SimplifiedTrack> = [];
    data.forEach(trackObject => {
      trackArray.push(new SimplifiedTrack(this.client, trackObject));
    });
    return trackArray;
  }

  private _patchCopyrights(data: Array<CopyrightObject>): Array<Copyright> {
    const copyrightArray: Array<CopyrightObject> = [];
    data.forEach(copyrightObject => {
      copyrightArray.push(new Copyright(copyrightObject));
    });
    return copyrightArray;
  }
}
