/**
 * Represents an HTTP error from a request
 */
export default class HTTPError extends Error {
  /**
   * The code of the error
   */
  code: string | null;

  /**
   * The HTTP method used for the request
   */
  method: string;

  /**
   * The relative path of the request
   */
  path: string;

  /**
   * The type of error
   */
  type: string;

  constructor(method: string, message: string, name: string, path: string, type: string, code?: string) {
    super(message);
    this.name = name;

    this.code = code ?? null;
    this.method = method;
    this.path = path;
    this.type = type;
  }
}
