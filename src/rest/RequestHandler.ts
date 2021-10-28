import { parseResponse } from '../util/Util.js';
import { AsyncQueue } from '@sapphire/async-queue';
import SpotifyAPIError from './SpotifyAPIError.js';
import type APIRequest from './APIRequest.js';
import type RESTManager from './RESTManager.js';
import type { AuthenticationErrorObject, RegularErrorObject } from 'spotify-api-types';

export default class RequestHandler {
  /**
   * The manager of that initiated this class
   */
  manager: RESTManager;

  /**
   * The queue for the requests
   */
  queue: AsyncQueue;

  constructor(manager: RESTManager) {
    this.manager = manager;
    this.queue = new AsyncQueue();
  }

  async push(request: APIRequest): Promise<unknown> {
    await this.queue.wait();
    try {
      return await this.execute(request);
    } finally {
      this.queue.shift();
    }
  }

  async execute(request: APIRequest): Promise<unknown> {
    const res = await request.make();

    if (res.ok) {
      return parseResponse(res);
    }

    const errorObject = (await parseResponse(res)) as AuthenticationErrorObject | RegularErrorObject;
    throw new SpotifyAPIError(request.method, request.path, res.status, errorObject);
  }
}
