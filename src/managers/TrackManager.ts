import BaseManager from './BaseManager.js';
import Track from '../structures/Track.js';
import { Page, Recommendation, RequestData } from '../structures/Misc.js';
import Collection from '../util/Collection.js';
import AudioFeatures from '../structures/AudioFeatures.js';
import type Client from '../client/Client.js';
import type {
  FetchTrackOptions,
  FetchTracksOptions,
  FetchSingleAudioFeaturesOptions,
  FetchMultipleAudioFeaturesOptions,
  FetchRecommendationsOptions,
  SearchTracksOptions,
} from '../interfaces/Interfaces.js';
import type SimplifiedTrack from '../structures/SimplifiedTrack.js';
import type {
  TrackObject,
  GetTrackQuery,
  GetTrackResponse,
  GetMultipleTracksQuery,
  GetMultipleTracksResponse,
  GetTrackAudioFeaturesResponse,
  GetMultipleTracksAudioFeaturesQuery,
  GetMultipleTracksAudioFeaturesResponse,
  GetRecommendationsQuery,
  GetSearchResponse,
} from 'spotify-api-types';
import type { TrackResolvable, FetchedTrack, FetchedAudioFeatures, ArtistResolvable } from '../interfaces/Types.js';

export default class TrackManager extends BaseManager<TrackResolvable, Track> {
  constructor(client: Client) {
    super(client, Track);
  }

  /**
   * Resolves a TrackResolvable to a Track object
   */
  resolve(trackResolvable: TrackResolvable): Track | null {
    const track = super.resolve(trackResolvable);
    if (track) return track;
    const trackID = this.resolveID(trackResolvable);
    if (trackID) return super.resolve(trackID);
    return null;
  }

  /**
   * Resolves a TrackResolvable to a Track ID
   */
  resolveID(trackResolvable: TrackResolvable): string | null {
    const trackID = super.resolveID(trackResolvable);
    if (trackID) return trackID;
    if ((trackResolvable as SimplifiedTrack).id) {
      return (trackResolvable as SimplifiedTrack).id;
    }
    return null;
  }

  /**
   * Fetches track(s) from Spotify
   */
  async fetch<T extends TrackResolvable | FetchTrackOptions | FetchTracksOptions>(
    options: T,
  ): Promise<FetchedTrack<T> | null> {
    if (!options) throw new Error('No track IDs were provided');
    const trackId = this.resolveID(options as TrackResolvable);
    // @ts-ignore
    if (trackId) return this._fetchSingle(trackId);
    const track = (options as FetchTrackOptions)?.track;
    if (track) {
      const trackId = this.resolveID(track);
      // @ts-ignore
      if (trackId) return this._fetchSingle(trackId, options);
    }
    const tracks = (options as FetchTracksOptions)?.tracks;
    if (tracks) {
      if (Array.isArray(tracks)) {
        const trackIds = tracks.map(track => this.resolveID(track));
        // @ts-ignore
        if (trackIds) return this._fetchMany(trackIds, options);
      }
    }
    return null;
  }

  private async _fetchSingle(id: string, options?: FetchTrackOptions): Promise<Track> {
    if (!options?.skipCacheCheck) {
      const cachedTrack = this.resolve(id);
      if (cachedTrack) return cachedTrack;
    }
    const query: GetTrackQuery = {
      market: options?.market,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetTrackResponse = await this.client._api.tracks(id).get(requestData);
    return this.add(data.id, options?.cacheAfterFetching, data);
  }

  private async _fetchMany(ids: Array<string>, options?: FetchTracksOptions): Promise<Collection<string, Track>> {
    const tracks = new Collection<string, Track>();
    if (!options?.skipCacheCheck) {
      const cachedTracks: Array<string> = [];
      ids.forEach(id => {
        const track = this.resolve(id);
        if (track) {
          tracks.set(track.id, track);
          cachedTracks.push(id);
        }
      });
      ids = ids.filter(id => !cachedTracks.includes(id));
    }
    const query: GetMultipleTracksQuery = {
      ids,
      market: options?.market,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetMultipleTracksResponse = await this.client._api.tracks.get(requestData);
    data.tracks.forEach(trackObject => {
      const track = this.add((trackObject as TrackObject)?.id, options?.cacheAfterFetching, trackObject);
      tracks.set(track.id, track);
    });
    return tracks;
  }

  /**
   * Fetches audio features of a track
   * @param options Options for fetching audio features of a track
   * @returns An `AudioFeatures` object or an array of `AudioFeatures` as a Promise
   */
  async fetchAudioFeatures<
    T extends TrackResolvable | FetchSingleAudioFeaturesOptions | FetchMultipleAudioFeaturesOptions
  >(options: T): Promise<FetchedAudioFeatures<T> | null> {
    if (!options) throw new Error('No tracks were provided');
    const trackId = this.resolveID(options as TrackResolvable);
    // @ts-ignore
    if (trackId) return this._fetchSingleAudioFeatures(trackId, options);
    const track = (options as FetchSingleAudioFeaturesOptions)?.track;
    if (track) {
      const trackId = this.resolveID(track);
      // @ts-ignore
      if (trackId) return this._fetchSingleAudioFeatures(trackId, options);
    }
    const tracks = (options as FetchMultipleAudioFeaturesOptions).tracks;
    if (tracks) {
      if (Array.isArray(tracks)) {
        const trackIds = tracks.map(track => this.resolveID(track));
        // @ts-ignore
        if (trackIds) return this._fetchManyAudioFeatures(trackIds, options);
      }
    }
    return null;
  }

  private async _fetchSingleAudioFeatures(
    id: string,
    options?: FetchSingleAudioFeaturesOptions,
  ): Promise<AudioFeatures> {
    const track = this.cache.get(id);
    if (!options?.skipCacheCheck && track?.features) track.features;
    const requestData = new RequestData('api', null, null);
    const data: GetTrackAudioFeaturesResponse = await this.client._api('audio-features', id).get(requestData);
    const audioFeatures = new AudioFeatures(this.client, data);
    if ((options?.cacheAfterFetching ?? true) && track) {
      track.features = audioFeatures;
    }
    return audioFeatures;
  }

  private async _fetchManyAudioFeatures(
    ids: Array<string>,
    options?: FetchMultipleAudioFeaturesOptions,
  ): Promise<Array<AudioFeatures | null>> {
    const audioFeaturesList: Array<AudioFeatures | null> = [];
    if (!options?.skipCacheCheck) {
      const cachedAudioFeaturesList: Array<string> = [];
      ids.forEach(id => {
        const track = this.cache.get(id);
        if (track && track?.features) {
          audioFeaturesList.push(track.features);
          cachedAudioFeaturesList.push(id);
        }
      });
      ids = ids.filter(id => !cachedAudioFeaturesList.includes(id));
    }
    const query: GetMultipleTracksAudioFeaturesQuery = {
      ids,
    };
    const requestData = new RequestData('api', query, null);
    const data: GetMultipleTracksAudioFeaturesResponse = await this.client._api('audio-features').get(requestData);
    data.audio_features.forEach(audioFeaturesObject => {
      const audioFeatures = audioFeaturesObject?.id ? new AudioFeatures(this.client, audioFeaturesObject) : null;
      if ((options?.cacheAfterFetching ?? true) && audioFeatures) {
        const track = this.cache.get(audioFeatures.id);
        if (track) track.features = audioFeatures;
      }
      audioFeaturesList.push(audioFeatures);
    });
    return audioFeaturesList;
  }

  /**
   * Fetches recommended tracks on the basis of options provided
   * @param options The options for fetching recommendations
   * @returns A `Recommendation` object as a Promise
   */
  async fetchRecommendations(options: FetchRecommendationsOptions): Promise<Recommendation> {
    const query: GetRecommendationsQuery = {
      limit: options?.limit,
      market: options?.market,
      seed_artists: [],
      seed_genres: [],
      seed_tracks: [],
      max_acousticness: options?.acousticness?.max,
      min_acousticness: options?.acousticness?.min,
      target_acousticness: options?.acousticness?.target,
      max_danceability: options?.danceability?.max,
      min_danceability: options?.danceability?.min,
      target_danceability: options?.danceability?.target,
      max_duration_ms: options?.duration?.max,
      min_duration_ms: options?.duration?.min,
      target_duration_ms: options?.duration?.target,
      max_energy: options?.energy?.max,
      min_energy: options?.energy?.min,
      target_energy: options?.energy?.target,
      max_instrumentalness: options?.instrumentalness?.max,
      min_instrumentalness: options?.instrumentalness?.min,
      target_instrumentalness: options?.instrumentalness?.target,
      max_key: options?.key?.max,
      min_key: options?.key?.min,
      target_key: options?.key?.target,
      max_liveness: options?.liveness?.max,
      min_liveness: options?.liveness?.min,
      target_liveness: options?.liveness?.target,
      max_loudness: options?.loudness?.max,
      min_loudness: options?.loudness?.min,
      target_loudnes: options?.loudness?.target,
      max_mode: options?.mode?.max,
      min_mode: options?.mode?.min,
      target_mode: options?.mode?.target,
      max_popularity: options?.popularity?.max,
      min_popularity: options?.popularity?.min,
      target_popularity: options?.popularity?.target,
      max_speechiness: options?.speechiness?.max,
      min_speechiness: options?.speechiness?.min,
      target_speechiness: options?.speechiness?.target,
      max_tempo: options?.tempo?.max,
      min_tempo: options?.tempo?.min,
      target_tempo: options?.tempo?.target,
      max_time_signature: options?.timeSignature?.max,
      min_time_signature: options?.timeSignature?.min,
      target_time_signature: options?.timeSignature?.target,
      max_valence: options?.valence?.max,
      min_valence: options?.valence?.min,
      target_valence: options?.valence?.target,
    };
    if (!options?.seeds) throw new Error('No seeds were provided');
    options.seeds.forEach(seedData => {
      if (seedData?.type === 'ARTIST') {
        const artistId = this.client.artists.resolveID(seedData.seed as ArtistResolvable);
        if (artistId) query.seed_artists.push(artistId);
      } else if (seedData?.type === 'GENRE') {
        const genre = seedData?.seed;
        if (genre && typeof genre === 'string') query.seed_genres.push(genre);
      } else if (seedData?.type === 'TRACK') {
        const trackId = this.resolveID(seedData?.seed as TrackResolvable);
        if (trackId) query.seed_tracks.push(trackId);
      }
    });
    const { seed_artists, seed_genres, seed_tracks } = query;
    const totalSeeds = seed_artists.length + seed_genres.length + seed_tracks.length;
    if (totalSeeds < 1) throw new Error('Atleast one seed should be provided');
    if (totalSeeds > 5) throw new Error('Only upto 5 seeds can be provided');
    const requestData = new RequestData('api', query, null);
    const data = await this.client._api.recommendations.get(requestData);
    return new Recommendation(this.client, data);
  }

  /**
   * Fetches tracks from Spotify by searching
   * @param options The options provided for searching tracks
   * @returns A `Page` of `Track` objects as a Promise
   */
  async search(options: SearchTracksOptions): Promise<Page<TrackObject, Track>> {
    const data: GetSearchResponse = await super._search(options, 'track', options?.market);
    return new Page(this.client, data.tracks, Track);
  }
}
