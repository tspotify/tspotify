/**
 * Options with which the client gets initiated with
 */
export interface ClientOptions {
  /**
   * The details about API endpoint
   */
  api: ApiOptions;
}

/**
 * Information related to the API
 */
export interface ApiOptions {
  /**
   * Current default version of the API
   */
  version: number;

  /**
   * The base URL of the API
   */
  baseURL: string;

  /**
   * The base URL for account authorization and login
   */
  baseAccountServiceURL: string;
}

/**
 * The default options with which the client gets initiated
 */
export const DefaultClientOptions: ClientOptions = {
  api: {
    version: 1,
    baseURL: 'https://api.spotify.com',
    baseAccountServiceURL: 'https://accounts.spotify.com',
  },
};

/**
 * Object that holds all the client events
 */
export const Events = {
  READY: 'ready',
};
