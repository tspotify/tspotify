import BaseManager from './BaseManager.js';
import PublicUser from '../structures/PublicUser.js';
import type Client from '../client/Client.js';
import type { GetUserResponse } from 'spotify-api-types';
import type { UserResolvable } from '../typings/Types.js';
import type { FetchUserOptions } from '../typings/Interfaces.js';

export default class UserManager extends BaseManager<UserResolvable, PublicUser> {
  constructor(client: Client) {
    super(client, PublicUser);
  }

  /**
   * Fetches a user from Spotify
   * @param options The options for fetching a user
   * @returns A `PublicUser` object as a Promise
   */
  async fetch<T extends UserResolvable | FetchUserOptions>(options: T): Promise<PublicUser | null> {
    if (!options) throw new Error('Invalid argument');
    const userId = this.resolveId(options as UserResolvable);
    if (userId) return this._fetchSingle(userId);
    const user = (options as FetchUserOptions)?.user;
    if (user) {
      const userId = this.resolveId(user);
      if (userId) return this._fetchSingle(userId, options as FetchUserOptions);
    }
    return null;
  }

  private async _fetchSingle(id: string, options?: FetchUserOptions): Promise<PublicUser> {
    if (!options?.skipCacheCheck) {
      const cachedUser = this.cache.get(id);
      if (cachedUser) return cachedUser;
    }
    const data: GetUserResponse = await this.client._api.users(id).get();
    return this.add(data.id, options?.cacheAfterFetching, data);
  }
}
