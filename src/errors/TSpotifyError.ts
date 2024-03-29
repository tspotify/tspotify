import type { ErrorMessageBuilder } from '../typings/Interfaces.js';

const errorMessagesMap = new Map<string, string | ErrorMessageBuilder>();

export function makeTspotifyError(Base: ErrorConstructor): any {
  return class TspotifyError extends Base {
    code: string;

    constructor(key: string, ...args: Array<string>) {
      super(formatErrorMessage(key, args));
      this.code = key;
      if (Error.captureStackTrace) Error.captureStackTrace(this, TspotifyError);
    }

    override get name() {
      return `${super.name} [${this.code}]`;
    }
  };
}

export function formatErrorMessage(key: string, args: Array<string>): string {
  if (typeof key !== 'string') throw new Error('Error message key must be a string');
  const errorMessage = errorMessagesMap.get(key);
  if (!errorMessage) throw new Error(`An invalid error message key was used: ${key}.`);
  if (typeof errorMessage === 'function') return errorMessage(...args);
  if (typeof args === 'undefined' || args.length === 0) return errorMessage;
  args.unshift(errorMessage);
  return args.toString();
}

export function regsiterErrorMessage(
  key: string,
  message: string | ErrorMessageBuilder,
): Map<string, string | ErrorMessageBuilder> {
  return errorMessagesMap.set(key, typeof message === 'function' ? message : String(message));
}

export const CustomErrors = {
  CustomError: makeTspotifyError(Error),
  CustomTypeError: makeTspotifyError(TypeError),
  CustomRangeError: makeTspotifyError(RangeError),
};
