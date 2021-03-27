import BaseClient from './BaseClient.js';
import type { ClientOptions } from '../util/Constants.js';
import fetch from 'node-fetch';

interface ClientCredentials {
  clientID: string;
  clientSecret: string;
}

export default class Client extends BaseClient {
  credentials: ClientCredentials | null;
  accessTokenDetails: AccessTokenDetails | null;

  constructor(options?: ClientOptions) {
    super(options);

    Object.defineProperty(this, 'credentials', { writable: true });
    this.credentials = null;

    Object.defineProperty(this, 'accessTokenDetails', { writable: true });
    this.accessTokenDetails = null;
  }

  async login(credentials: ClientCredentials): Promise<AccessTokenDetails> {
    this.credentials = credentials;
    const { clientID, clientSecret } = this.credentials;
    const authString = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
    const bodyContent = new URLSearchParams();
    bodyContent.append('grant_type', 'client_credentials');
    const res = await fetch('https://accounts.spotify.com/api/token', {
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyContent,
      method: 'post',
    });
    const data = await res.json();
    this.accessTokenDetails = new AccessTokenDetails(data);
    return this.accessTokenDetails;
  }
}

class AccessTokenDetails {
  accessToken: string;
  tokenType: string;
  expiresIn: number;

  /* eslint-disable */
  constructor(data: any) {
    this.accessToken = data?.access_token ?? null;

    this.tokenType = data?.token_type ?? null;

    this.expiresIn = data?.expires_in ?? null;
  }
}
