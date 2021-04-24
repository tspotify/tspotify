import type { SubdomainType } from '../util/Interfaces.js';

export default class ApiOptions<Q, B> {
  /**
   * The subdomain of the endpoint being requested
   */
  subdomain: SubdomainType;

  /**
   * The query object for the request
   */
  query: Q;

  /**
   * The body of the request
   */
  body: B;

  constructor(subdomain: SubdomainType, query: Q, body: B) {
    this.subdomain = subdomain;
    this.query = query;
    this.body = body;
  }
}
