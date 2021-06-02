import type { AuthenticationErrorObject, RegularErrorObject } from 'spotify-api-types';

/**
 * Represents a Spotify API error
 */
export default class SpotifyAPIError extends Error {
  /**
   * The HTTP method used for the request
   */
  method: string;

  /**
   * The path of the request relative to base API endpoint
   */
  path: string;

  /**
   * The HTTP status code of the response
   */
  httpStatusCode: number;

  constructor(
    method: string,
    path: string,
    httpStatusCode: number,
    errorObject: AuthenticationErrorObject | RegularErrorObject,
  ) {
    super();
    this.message = this._patchErrorMessage(errorObject);

    this.method = method;
    this.path = path;
    this.httpStatusCode = httpStatusCode;
  }

  private _patchErrorMessage(errorObject: AuthenticationErrorObject | RegularErrorObject) {
    if (typeof errorObject.error === 'string') {
      const authError = errorObject as AuthenticationErrorObject;
      this.name = `SpotifyAPIError [${authError.error}]`;
      return authError.error_description;
    }

    const regularError = (errorObject as RegularErrorObject).error;
    this.name = `SpotifyAPIError [${regularError.status}]`;
    return regularError.message;
  }
}
