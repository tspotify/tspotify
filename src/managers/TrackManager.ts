import BaseManager from './BaseManager.js';
import Track from '../structures/Track';
import type Client from '../client/Client.js';
import type { TrackResolvable } from '../util/Interfaces.js';
import type SimplifiedTrack from '../structures/SimplifiedTrack.js';

export default class TrackManager extends BaseManager<TrackResolvable, Track> {
  constructor(client: Client) {
    super(client, Track as any);
  }

  /**
   * Resolves a TrackResolvable to a Track object
   */
  resolve(trackResolvable: TrackResolvable): Track | null {
    let track = super.resolve(trackResolvable);
    if (track) return track;
    if ((trackResolvable as SimplifiedTrack).id) {
      const id = (trackResolvable as SimplifiedTrack).id;
      track = super.resolve(id);
      if (track) return track;
    }
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
}
