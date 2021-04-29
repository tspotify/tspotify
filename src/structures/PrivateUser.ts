import PublicUser from './PublicUser.js';
import { ExplicitContentSettings } from './Misc.js';
import type Client from '../client/Client.js';
import type { PrivateUserObject } from 'spotify-api-types';

export default class PrivateUser extends PublicUser {
  /**
   * The country of the user, as set in the user’s account profile. An `ISO 3166-1 alpha-2` country code. This field is only available when the current user has granted access to the `user-read-private` scope
   */
  country: string | null;

  /**
   * The user’s email address, as entered by the user when creating their account. This field is only available when the current user has granted access to the `user-read-email` scope.
   *
   * **⚠️Important**: This email address is unverified, there is no proof that it actually belongs to the user
   */
  email: string | null;

  /**
   * The user’s explicit content settings. This field is only available when the current user has granted access to the `user-read-private` scope.
   */
  explicitContent: ExplicitContentSettings | null;

  /**
   * The user’s Spotify subscription level: `premium`, `free`, etc. This field is only available when the current user has granted access to the `user-read-private` scope.
   *
   * **⚠️Note**: The subscription level `open` can be considered the same as `free`
   */
  product: string;

  constructor(client: Client, data: PrivateUserObject) {
    super(client, data);

    this.country = data?.country ?? null;

    this.email = data?.email ?? null;

    this.explicitContent = data?.explicit_content ? new ExplicitContentSettings(data?.explicit_content) : null;

    this.product = data.product;
  }
}
