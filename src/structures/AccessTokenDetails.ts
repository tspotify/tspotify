/**
 * The details about the access token returned by the API after logging in
 */
export default class AccessTokenDetails {
  /**
   * The access token for the client
   */
  accessToken: string;

  /**
   * The type of the token
   */
  tokenType: string;

  /**
   * The time of expiry of the token in seconds
   */
  expiresIn: number;

  /* eslint-disable */
  constructor(data: any) {
    this.accessToken = data?.access_token ?? null;

    this.tokenType = data?.token_type ?? null;

    this.expiresIn = data?.expires_in ?? null;
  }
}