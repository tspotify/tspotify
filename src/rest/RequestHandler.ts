import { AsyncQueue } from '@sapphire/async-queue';
import type { Response } from 'node-fetch';
import type APIRequest from './APIRequest.js';
import type RESTManager from './RESTManager.js';

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

  async push(request: APIRequest): Promise<any> {
    await this.queue.wait();
    try {
      return await this.execute(request);
    } finally {
      this.queue.shift();
    }
  }

  async execute(request: APIRequest): Promise<any> {
    let res: Response;
    try {
      res = await request.make();
    } catch (error) {
      throw new Error(error);
    }

    if (res && res.headers) {
      if (res.ok) {
        return RequestHandler.parseResponse(res);
      }

      if (res.status >= 400 && res.status < 500) {
        let data;
        try {
          data = await RequestHandler.parseResponse(res);
        } catch (err) {
          throw new Error(err);
        }
        if (data?.error) {
          throw new Error(data?.error.message || `${data?.error}: ${data?.error_description}`);
        }
      }
    }
  }

  static async parseResponse(res: Response): Promise<any> {
    if (res.headers.get('content-type')?.startsWith('application/json')) return res.json();
    return res.buffer();
  }
}
