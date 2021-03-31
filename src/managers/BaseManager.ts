import Client from '../client/Client.js';

/**
 * Base class for all managers
 */
export default class BaseManager {
  /**
   * Client that instantiated this class
   */
  client: Client;

  constructor(client: Client) {
    Object.defineProperty(this, 'client', { writable: true });
    this.client = client;
  }
}
