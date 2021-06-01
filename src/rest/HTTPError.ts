/**
 * Represents an HTTP error from a request
 */
export default class HTTPError extends Error {
  /**
   * The HTTP status code of the response
   */
  httpStatusCode: number;

  /**
   * The HTTP method used for the request
   */
  method: string;

  /**
   * The path of the request relative to base API endpoint
   */
  path: string;

  constructor(httpStatusCode: number, method: string, message: string, name: string, path: string) {
    super(message);
    this.name = name;

    this.httpStatusCode = httpStatusCode;
    this.method = method;
    this.path = path;
  }
}
