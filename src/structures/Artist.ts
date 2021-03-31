import Client from '../client/Client.js';
import BaseStructure from './BaseStructure.js';
import type { ArtistObject } from 'spotify-api-types';

/**
 * Represents an artist on Spotify
 */
export default class Artist extends BaseStructure {
  constructor(client: Client, data: ArtistObject) {
    super(client);
  }
}
