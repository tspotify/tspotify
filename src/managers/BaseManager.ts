import Client from '../client/Client.js';
import Collection from '../util/Collection.js';
import type BaseStructure from '../structures/BaseStructure.js';

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
  protected _holds: T;

  /**
   * @param client The client that instantiated this manager
   * @param structureType The type of structure held by this manager
   */
  constructor(client: Client, structureType: T) {
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
    if (idOrInstance instanceof (this._holds as any)) return (idOrInstance as unknown) as T;
    if (typeof idOrInstance === 'string') return ((this.cache.get(idOrInstance) as unknown) as T) ?? null;
    return null;
  }

  /**
   * Resolves a structure resolvable to its id
   * @param idOrInstance The ID or instance of the strucutre held by this manager
   */
  resolveID(idOrInstance: string | R): string | null {
    if (idOrInstance instanceof (this._holds as any)) return ((idOrInstance as unknown) as T).id;
    if (typeof idOrInstance === 'string') return idOrInstance as string;
    return null;
  }

  /**
   * Converts raw data sent by the API to a structure and adds it to the cache
   * @param id The ID of the structure
   * @param cache Whether to cache the structure or not
   * @param data The raw data returned by the API for this structure
   */
  add(id: string, cache = true, data: unknown): T {
    // @ts-ignore
    const entry = new this._holds(this.client, data);
    if (cache) this.cache.set(id, entry);
    return entry;
  }
}
