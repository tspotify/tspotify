import BasePlaylist from './BasePlaylist.js';
import Collection from '../util/Collection.js';
import Episode from './Episode.js';
import Track from './Track.js';
import type Client from '../client/Client.js';
import type { PlaylistObject, TrackObject, EpisodeObject, PlaylistTrackObject } from 'spotify-api-types';

export default class Playlist extends BasePlaylist {
  /**
   * Tracks or Episodes of the playlist
   */
  tracks: Collection<string, Episode | Track>;

  constructor(client: Client, data: PlaylistObject) {
    super(client, data);

    this.tracks = this._patchTracksOrEpisodes(data.tracks.items);
  }

  private _patchTracksOrEpisodes(data: Array<PlaylistTrackObject>): Collection<string, Episode | Track> {
    const itemsCollection = new Collection<string, Episode | Track>();
    data.forEach(item => {
      const trackOrEpisode =
        item.track.type === 'track'
          ? new Track(this.client, item.track as TrackObject)
          : new Episode(this.client, item.track as EpisodeObject);
      itemsCollection.set(trackOrEpisode.id, trackOrEpisode);
    });
    return itemsCollection;
  }
}
