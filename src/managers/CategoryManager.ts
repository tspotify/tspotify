import BaseManager from './BaseManager.js';
import Category from '../structures/Category.js';
import { RequestData } from '../structures/Misc.js';
import type Client from '../client/Client.js';
import type { CategoryResolvable, FetchCategoryOptions } from '../util/Interfaces.js';
import type { GetCategoryQuery, GetCategoryResponse } from 'spotify-api-types';

export default class CategoryManager extends BaseManager<CategoryResolvable, Category> {
  constructor(client: Client) {
    super(client, Category);
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
}
