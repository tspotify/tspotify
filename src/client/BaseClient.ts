import { EventEmitter } from 'events';
import { mergeDefault } from '../util/Util.js';
import { DefaultClientOptions } from '../util/Constants.js';
import type { ClientOptions } from '../interfaces/Interfaces.js';

/**
 * Base class for client
 */
export default class BaseClient extends EventEmitter {
  /**
   * Options to pass when initiating the client
   */
  options: ClientOptions;

  constructor(options = {}) {
    super();

    this.options = mergeDefault(DefaultClientOptions, options);
  }
}
