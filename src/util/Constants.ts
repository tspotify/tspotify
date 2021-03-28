export interface ClientOptions {
  api: ApiOptions;
}

export interface ApiOptions {
  version: number;
  baseURL: string;
  baseAccountServiceURL: string;
}

export const DefaultClientOptions: ClientOptions = {
  api: {
    version: 1,
    baseURL: 'https://api.spotify.com',
    baseAccountServiceURL: 'https://accounts.spotify.com',
  },
};
