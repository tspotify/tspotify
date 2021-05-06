import BaseManager from './BaseManager.js';
import Playlist from '../structures/Playlist.js';
import { Page, RequestData } from '../structures/Misc.js';
import type Client from '../client/Client.js';
import type BasePlaylist from '../structures/BasePlaylist.js';
import type {
  PlaylistResolvable,
  FetchPlaylistOptions,
  UserResolvable,
  FetchUserPlaylistsOptions,
} from '../util/Interfaces.js';
import type {
  GetPlaylistQuery,
  GetPlaylistResponse,
  GetUserPlaylistsQuery,
  GetUserPlaylistsResponse,
  SimplifiedPlaylistObject,
} from 'spotify-api-types';
import { SimplifiedPlaylist } from '../index.js';

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

  async fetch(options: FetchPlaylistOptions): Promise<Playlist> {
    if (!options) throw new Error('Provide valid options');
    const playlistId = this.resolveID(options?.playlist);
    if (!playlistId) throw new Error('Invalid playlist');
    return this._fetchSigle(playlistId, options);
  }

  private async _fetchSigle(id: string, options: FetchPlaylistOptions): Promise<Playlist> {
    if (!options?.skipCacheCheck) {
      const cachedPlaylist = this.cache.get(id);
      if (cachedPlaylist) return cachedPlaylist;
    }
    const query: GetPlaylistQuery = {
      market: options?.market,
      additional_types: 'episode',
    };
    const requestData = new RequestData('api', query, null);
    const data: GetPlaylistResponse = await this.client._api.playlists(id).get(requestData);
    return this.add(data.id, options?.cacheAfterFetching, data);
  }

  /**
   * Fetches playlists of a user
   * @param user The user whose playlists are to be fetched
   * @param options Options for fetching the user's playlists
   * @returns A Page of `SimplifiedPlaylist` objects as a Promise
   */
  async fetchUserPlaylists(
    user: UserResolvable,
    options?: FetchUserPlaylistsOptions,
  ): Promise<Page<SimplifiedPlaylistObject, SimplifiedPlaylist>> {
    const userId = this.client.users.resolveID(user);
    if (!userId) throw new Error('Invalid user');
    const query: GetUserPlaylistsQuery = {
      limit: options?.limit,
      offset: options?.offset,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetUserPlaylistsResponse = await this.client._api.users(userId).playlists.get(requestData);
    return new Page(this.client, data, SimplifiedPlaylist);
  }
}
