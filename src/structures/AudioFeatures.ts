import BaseStructure from './BaseStructure.js';
import type Client from '../client/Client.js';
import type { AudioFeaturesObject } from 'spotify-api-types';

export default class AudioFeatures extends BaseStructure {
  acousticness: number;

  analysisUrl: string;

  danceability: number;

  duration: number;

  energy: number;

  instrumentalness: number;

  key: number;

  liveness: number;

  loudness: number;

  mode: number;

  speechiness: number;

  tempo: number;

  timeSignature: number;

  trackHref: string;

  rawObjectType: string;

  uri: string;

  valence: number;

  constructor(client: Client, data: AudioFeaturesObject) {
    super(client, data.id);

    this.acousticness = data.acousticness;

    this.analysisUrl = data.analysis_url;

    this.danceability = data.danceability;

    this.duration = data.duration_ms;

    this.energy = data.energy;

    this.instrumentalness = data.instrumentalness;

    this.key = data.key;

    this.liveness = data.liveness;

    this.loudness = data.loudness;

    this.mode = data.mode;

    this.rawObjectType = data.type;

    this.speechiness = data.speechiness;

    this.tempo = data.tempo;

    this.timeSignature = data.time_signature;

    this.trackHref = data.track_href;

    this.uri = data.uri;

    this.valence = data.valence;
  }
}
