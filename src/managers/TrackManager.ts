import BaseManager from './BaseManager.js';
import Track from '../structures/Track.js';
import { RequestData } from '../structures/Misc.js';
import Collection from '../util/Collection.js';
import type Client from '../client/Client.js';
import type { TrackResolvable, FetchTrackOptions, FetchTracksOptions, FetchedTrack } from '../util/Interfaces.js';
import type SimplifiedTrack from '../structures/SimplifiedTrack.js';
import type {
  TrackObject,
  GetTrackQuery,
  GetTrackResponse,
  GetMultipleTracksQuery,
  GetMultipleTracksResponse,
} from 'spotify-api-types';

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
}
