import Collection from '../util/Collection.js';
import { RequestData } from '../structures/Misc.js';
import { GetSearchQuery, GetSearchResponse } from 'spotify-api-types';
import type Client from '../client/Client.js';
import type BaseStructure from '../structures/BaseStructure.js';
import type { SearchOptions, StructureConstructable } from '../interfaces/Interfaces.js';
import type { SearchItemType } from '../interfaces/Types.js';

/**
 * Base class for all managers
 */
export default class BaseManager<R, T extends BaseStructure> {
  /**
   * Client that instantiated this class
   */
  client: Client;

  /**
   * The cache of the structures held by this manager
   */
  cache: Collection<string, T>;

  /**
   * The type of structure held by this manager
   */
  protected _holds: StructureConstructable<T>;

  /**
   * @param client The client that instantiated this manager
   * @param structureType The type of structure held by this manager
   */
  constructor(client: Client, structureType: StructureConstructable<T>) {
    Object.defineProperty(this, 'client', { writable: true });
    this.client = client;

    this.cache = new Collection();

    Object.defineProperty(this, '_holds', { writable: true });
    this._holds = structureType;
  }

  /**
   * Resolves a structure resolvable to its respective structure
   * @param idOrInstance The ID or instance of the structure held by this manager
   */
  resolve(idOrInstance: string | R): T | null {
    if (idOrInstance instanceof this._holds) return idOrInstance;
    if (typeof idOrInstance === 'string') return this.cache.get(idOrInstance) ?? null;
    return null;
  }

  /**
   * Resolves a structure resolvable to its id
   * @param idOrInstance The ID or instance of the strucutre held by this manager
   */
  resolveID(idOrInstance: string | R): string | null {
    if (idOrInstance instanceof this._holds) return idOrInstance.id;
    if (typeof idOrInstance === 'string') return idOrInstance;
    return null;
  }

  /**
   * Converts raw data sent by the API to a structure and adds it to the cache
   * @param id The ID of the structure
   * @param cacheAfterFetching Whether to cache the structure or not
   * @param data The raw data returned by the API for this structure
   */
  add(id: string, cacheAfterFetching = true, data: unknown): T {
    const entry = new this._holds(this.client, data);
    if (cacheAfterFetching) this.cache.set(id, entry);
    return entry;
  }

  /**
   * Searches Spotify
   * @param options The options for searching
   * @param type The type of items to search
   */
  protected async _search(options: SearchOptions, type: SearchItemType): Promise<GetSearchResponse> {
    const query: GetSearchQuery = {
      include_external: options?.includeExternal,
      limit: options?.limit,
      market: options?.market,
      offset: options?.offset,
      q: options.query,
      type: [type],
    };
    const requestData = new RequestData('api', query, null);
    const data: GetSearchResponse = await this.client._api.search.get(requestData);
    return data;
  }
}
