export interface DefaultClientOptionsInterface {
  http: httpInterface;
}

export interface httpInterface {
  version: number;
  api: string;
}

export const DefaultClientOptions: DefaultClientOptionsInterface = {
  http: {
    version: 1,
    api: 'https://api.spotify.com',
  },
};
