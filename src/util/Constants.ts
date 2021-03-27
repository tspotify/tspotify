export interface ClientOptions {
  http: HttpOptions;
}

export interface HttpOptions {
  version: number;
  api: string;
}

export const DefaultClientOptions: ClientOptions = {
  http: {
    version: 1,
    api: 'https://api.spotify.com',
  },
};
