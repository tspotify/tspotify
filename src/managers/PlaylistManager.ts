import BaseManager from './BaseManager.js';
import Playlist from '../structures/Playlist.js';
import { RequestData } from '../structures/Misc.js';
import type Client from '../client/Client.js';
import type BasePlaylist from '../structures/BasePlaylist.js';
import type { PlaylistResolvable } from '../util/Interfaces.js';
import type { GetPlaylistQuery, GetPlaylistResponse } from 'spotify-api-types';

/**
 * Stores cache for playlists and holds their API methods
 */
export default class PlaylistManager extends BaseManager<PlaylistResolvable, Playlist> {
  constructor(client: Client) {
    super(client, Playlist);
  }

  /**
   * Resolves a PlaylistResolavable to a Playlist
   * @param playlistResolvable A string or object that can be resolved to a Playlist
   * @returns A Playlist
   */
  resolve(playlistResolvable: PlaylistResolvable): Playlist | null {
    const playlist = super.resolve(playlistResolvable);
    if (playlist) return playlist;
    const playlistId = this.resolveID(playlistResolvable);
    if (playlistId) return super.resolve(playlistId);
    return null;
  }

  /**
   * Resolves a PlaylistResolvable to a Playlist ID
   * @param playlistResolvable A string or object that can be resolved to a Playlist
   * @returns The ID of a Playlist
   */
  resolveID(playlistResolvable: PlaylistResolvable): string | null {
    const playlistId = super.resolveID(playlistResolvable);
    if (playlistId) return playlistId;
    if ((playlistResolvable as BasePlaylist | Playlist).id) {
      return (playlistResolvable as BasePlaylist | Playlist).id;
    }
    return null;
  }

  private async _fetchSigle(id: string): Promise<Playlist> {
    const query: GetPlaylistQuery = {
      market: 'IN',
      additional_types: 'episode',
    };
    const requestData = new RequestData('api', query, null);
    const data: GetPlaylistResponse = await this.client._api.playlists(id).get(requestData);
    return this.add(data.id, true, data);
  }
}
