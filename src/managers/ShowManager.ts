import Show from '../structures/Show.js';
import BaseManager from './BaseManager.js';
import APIOptions from '../structures/APIOptions.js';
import type Client from '../client/Client.js';
import type SimplifiedShow from '../structures/SimplifiedShow.js';
import type { ShowResolvable, FetchShowOptions } from '../util/Interfaces.js';
import type { GetShowQuery, GetShowResponse } from 'spotify-api-types';

export default class ShowManager extends BaseManager<ShowResolvable, Show> {
  constructor(client: Client) {
    super(client, Show);
  }

  /**
   * Resolves a ShowResolvable to a Show object
   */
  resolve(showResolvable: ShowResolvable): Show | null {
    const show = super.resolve(showResolvable);
    if (show) return show;
    const showID = this.resolveID(showResolvable);
    if (showID) return super.resolve(showID);
    return null;
  }

  /**
   * Resolves a ShowResolvable to a Show ID
   */
  resolveID(showResolvable: ShowResolvable): string | null {
    const showID = super.resolveID(showResolvable);
    if (showID) return showID;
    if ((showResolvable as SimplifiedShow).id) {
      return (showResolvable as SimplifiedShow).id;
    }
    return null;
  }

  private async _fetchSingle(id: string, options: FetchShowOptions): Promise<Show> {
    if (!options.skipCacheCheck) {
      const cachedShow = this.resolve(id);
      if (cachedShow) return cachedShow;
    }
    const query: GetShowQuery = {
      market: options?.market,
    };
    const apiOptions = new APIOptions('api', query, null);
    const data: GetShowResponse = await this.client._api.shows(id).get(apiOptions);
    return this.add(data.id, options?.cacheAfterFetching, data);
  }
}
