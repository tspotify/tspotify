import BaseManager from './BaseManager.js';
import Playlist from '../structures/Playlist.js';
import { Image, Page, PlaylistTrack, RequestData } from '../structures/Misc.js';
import type Client from '../client/Client.js';
import type BasePlaylist from '../structures/BasePlaylist.js';
import type {
  PlaylistResolvable,
  FetchPlaylistOptions,
  UserResolvable,
  FetchUserPlaylistsOptions,
  FetchPlaylistItemsOptions,
  FetchFeaturedPlaylistsOptions,
  SearchOptions,
} from '../interfaces/Interfaces.js';
import type {
  GetFeaturedPlaylistsQuery,
  GetFeaturedPlaylistsResponse,
  GetPlaylistCoverImageResponse,
  GetPlaylistItemsQuery,
  GetPlaylistItemsResponse,
  GetPlaylistQuery,
  GetPlaylistResponse,
  GetSearchResponse,
  GetUserPlaylistsQuery,
  GetUserPlaylistsResponse,
  PlaylistTrackObject,
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

  /**
   * Fetches items of a playlist
   * @param options Options for fetching items of a playlist
   * @returns A Page of `PlaylistTrack` objects a Promise
   */
  async fetchItems(options: FetchPlaylistItemsOptions): Promise<Page<PlaylistTrackObject, PlaylistTrack>> {
    const playlistId = this.resolveID(options?.playlist);
    if (!playlistId) throw new Error('Invalid playlist');
    const query: GetPlaylistItemsQuery = {
      limit: options?.limit,
      market: options?.market,
      offset: options?.offset,
      additional_types: 'episode',
    };
    const requestData = new RequestData('api', query, null);
    const data: GetPlaylistItemsResponse = await this.client._api.playlists(playlistId).tracks.get(requestData);
    return new Page(this.client, data, PlaylistTrack);
  }

  /**
   * Fetches cover image of a playlist
   * @param playlist The playlist whose cover image is to be fetched
   * @returns An array of `Image` object
   */
  async fetchCoverImage(playlist: PlaylistResolvable): Promise<Array<Image>> {
    const playlistId = this.resolveID(playlist);
    if (!playlistId) throw new Error('Invalid Playlist');
    const requestData = new RequestData('api', null, null);
    const data: GetPlaylistCoverImageResponse = await this.client._api.playlists(playlistId).images.get(requestData);
    const images: Array<Image> = [];
    data.forEach(imageObject => {
      images.push(new Image(imageObject));
    });
    return images;
  }

  /**
   * Fetches playlists that are featured by Spotify
   * @param options Options for fetching the featured playlists
   * @returns A Page of `SimplifiedPlaylist` objects as a Promise
   */
  async fetchFeaturedPlaylists(
    options?: FetchFeaturedPlaylistsOptions,
  ): Promise<Page<SimplifiedPlaylistObject, SimplifiedPlaylist>> {
    const query: GetFeaturedPlaylistsQuery = {
      country: options?.country,
      limit: options?.limit,
      locale: options?.locale,
      offset: options?.offset,
      timestamp: options?.timestamp,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetFeaturedPlaylistsResponse = await this.client._api.browse('featured-playlists').get(requestData);
    return new Page(this.client, data.playlists, SimplifiedPlaylist);
  }

  /**
   * Fetches playlists from Spotify by searching
   * @param options The options provided for searching playlists
   * @returns A `Page` of `SimplifiedPlaylist` objects as a Promise
   */
  async search(options: SearchOptions): Promise<Page<SimplifiedPlaylistObject, SimplifiedPlaylist>> {
    const data: GetSearchResponse = await super._search(options, 'playlist');
    return new Page(this.client, data.playlists, SimplifiedPlaylist);
  }
}
