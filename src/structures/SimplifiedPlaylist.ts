import BasePlaylist from './BasePlaylist.js';
import { PlaylistTracksRef } from './Misc.js';
import type Client from '../client/Client.js';
import type { SimplifiedPlaylistObject } from 'spotify-api-types';

export default class SimplifiedPlaylist extends BasePlaylist {
  /**
   * A collection containing a link (href) to the Web API endpoint where full details of the playlist’s tracks can be retrieved, along with the total number of tracks in the playlist.
   *
   * **⚠️Note**: A track object may be `null`. This can happen if a track is no longer available
   */
  tracks: PlaylistTracksRef;

  constructor(client: Client, data: SimplifiedPlaylistObject) {
    super(client, data);

    this.tracks = new PlaylistTracksRef(data.tracks);
  }
}
