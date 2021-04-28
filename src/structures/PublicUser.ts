import BaseStructure from './BaseStructure.js';
import { ExternalUrl } from './Misc.js';
import type Client from '../client/Client.js';
import type { PublicUserObject } from 'spotify-api-types';

export default class PublicUser extends BaseStructure {
  /**
   * The name displayed on the user’s profile
   */
  displayName: string | null;

  /**
   * Known public external URLs for this user
   */
  externalUrls: ExternalUrl;

  /**
   * Information about the followers of this user
   */
  followers: any;

  /**
   * A link to the Web API endpoint for this user
   */
  href: string;

  /**
   * The user’s profile image
   */
  images: Array<any>;

  /**
   * The raw object type returned by the api: `user`
   */
  rawObjectType: string;

  /**
   * The Spotify URI for this user
   */
  uri: string;

  constructor(client: Client, data: PublicUserObject) {
    super(client, data.id);

    this.displayName = data.display_name;

    this.externalUrls = new ExternalUrl(data.external_urls);

    this.followers = data.followers;

    this.href = data.href;

    this.images = data.images;

    this.rawObjectType = data.type;

    this.uri = data.uri;
  }
}
