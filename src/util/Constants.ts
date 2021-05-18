import type { ClientOptions } from '../interfaces/Interfaces';

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
