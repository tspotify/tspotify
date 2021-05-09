import BaseManager from './BaseManager.js';
import Category from '../structures/Category.js';
import { Page, RequestData } from '../structures/Misc.js';
import type Client from '../client/Client.js';
import type {
  CategoryResolvable,
  FetchCategoriesOptions,
  FetchCategoryOptions,
  FetchedCategory,
} from '../util/Interfaces.js';
import type {
  CategoryObject,
  GetCategoryQuery,
  GetCategoryResponse,
  GetMultipleCategoriesQuery,
  GetMultipleCategoriesResponse,
} from 'spotify-api-types';

export default class CategoryManager extends BaseManager<CategoryResolvable, Category> {
  constructor(client: Client) {
    super(client, Category);
  }

  async fetch<T extends CategoryResolvable | FetchCategoryOptions | FetchCategoriesOptions>(
    options: T,
  ): Promise<FetchedCategory<T>> {
    const categoryId = this.resolveID(options as CategoryResolvable);
    // @ts-ignore
    if (categoryId) return this._fetchSingle(categoryId, options);
    const category = (options as FetchCategoryOptions)?.categoryResolvable;
    if (category) {
      const categoryId = this.resolveID(category);
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
    const requestData = new RequestData('api', query, null);
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
    const requestData = new RequestData('api', query, null);
    const data: GetMultipleCategoriesResponse = await this.client._api.browse.categories.get(requestData);
    return new Page(this.client, data.categories, Category);
  }
}
