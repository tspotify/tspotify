import { EventEmitter } from 'events';
import { mergeDefault } from '../util/Util.js';
import { DefaultClientOptions } from '../util/Constants.js';
import type { ClientOptions } from '../util/Constants.js';

export default class BaseClient extends EventEmitter {
  options: ClientOptions;

  constructor(options = {}) {
    super();

    this.options = mergeDefault(DefaultClientOptions, options);
  }
}
