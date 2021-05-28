import { regsiterErrorMessage } from './TSpotifyError.js';

const messages = {
  MISSING_MARKET: () => `Valid market must be provided.`,
};

for (const [key, message] of Object.entries(messages)) {
  regsiterErrorMessage(key, message);
}
