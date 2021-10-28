import BaseManager from './BaseManager.js';
import Category from '../structures/Category.js';
import { Page, RequestData } from '../structures/Misc.js';
import SimplifiedPlaylist from '../structures/SimplifiedPlaylist.js';
import type Client from '../client/Client.js';
import type {
  FetchCategoriesOptions,
  FetchCategoryOptions,
  FetchCategoryPlaylistsOptions,
} from '../typings/Interfaces.js';
import type {
  CategoryObject,
  GetCategoryPlaylistQuery,
  GetCategoryPlaylistResponse,
  GetCategoryQuery,
  GetCategoryResponse,
  GetMultipleCategoriesQuery,
  GetMultipleCategoriesResponse,
  SimplifiedPlaylistObject,
} from 'spotify-api-types';
import type { CategoryResolvable, FetchedCategory } from '../typings/Types.js';

export default class CategoryManager extends BaseManager<CategoryResolvable, Category> {
  constructor(client: Client) {
    super(client, Category);
  }

  /**
   * Fetches one or more categories from Spotify
   * @param options Options for fetching categories
   * @returns A `Category` or a Page of `Category` objects as a Promise
   */
  async fetch<T extends CategoryResolvable | FetchCategoryOptions | FetchCategoriesOptions>(
    options: T,
  ): Promise<FetchedCategory<T>> {
    if (!options) throw new Error('No options were provided');
    const categoryId = this.resolveId(options as CategoryResolvable);
    // @ts-ignore
    if (categoryId) return this._fetchSingle(categoryId, options);
    const categoryResolvable = (options as FetchCategoryOptions)?.categoryResolvable;
    if (categoryResolvable) {
      const categoryId = this.resolveId(categoryResolvable);
      // @ts-ignore
      if (categoryId) return this._fetchSingle(categoryId, options);
    }
    // @ts-ignore
    return this._fetchMultiple(options);
  }

  private async _fetchSingle(id: string, options?: FetchCategoryOptions): Promise<Category> {
    if (!options?.skipCacheCheck) {
      const cachedCategory = this.cache.get(id);
      if (cachedCategory) return cachedCategory;
    }
    const query: GetCategoryQuery = {
      country: options?.country,
      locale: options?.locale,
    };
    const requestData = new RequestData({ query });
    const data: GetCategoryResponse = await this.client._api.browse.categories(id).get(requestData);
    return this.add(data.id, options?.cacheAfterFetching, data);
  }

  private async _fetchMultiple(options?: FetchCategoriesOptions): Promise<Page<CategoryObject, Category>> {
    const query: GetMultipleCategoriesQuery = {
      country: options?.country,
      limit: options?.limit,
      locale: options?.locale,
      offset: options?.offset,
    };
    const requestData = new RequestData({ query });
    const data: GetMultipleCategoriesResponse = await this.client._api.browse.categories.get(requestData);
    return new Page(this.client, data.categories, Category);
  }

  /**
   * Fetches playlists listed under a specific category
   * @param categoryResolvable The category from which playlists are to be fetched
   * @param options Options for fetching the playlists
   * @returns A Page of `SimplifiedPlaylist` objects as a Promise
   */
  async fetchPlaylists(
    categoryResolvable: CategoryResolvable,
    options?: FetchCategoryPlaylistsOptions,
  ): Promise<Page<SimplifiedPlaylistObject, SimplifiedPlaylist>> {
    const categoryId = this.resolveId(categoryResolvable);
    if (!categoryId) throw new Error('Invalid category');
    const query: GetCategoryPlaylistQuery = {
      country: options?.country,
      limit: options?.limit,
      offset: options?.offset,
    };
    const requestData = new RequestData({ query });
    const data: GetCategoryPlaylistResponse = await this.client._api.browse
      .categories(categoryId)
      .playlists.get(requestData);
    return new Page(this.client, data.playlists, SimplifiedPlaylist);
  }
}
