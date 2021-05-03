import BasePlaylist from './BasePlaylist.js';
import { PlaylistTrack } from './Misc.js';
import { Page } from './Misc.js';
import type Client from '../client/Client.js';
import type { PlaylistObject, PlaylistTrackObject } from 'spotify-api-types';

export default class Playlist extends BasePlaylist {
  /**
   * Tracks or Episodes of the playlist
   */
  tracks: Page<PlaylistTrackObject, PlaylistTrack>;

  constructor(client: Client, data: PlaylistObject) {
    super(client, data);

    this.tracks = new Page(this.client, data.tracks, PlaylistTrack);
  }
}
