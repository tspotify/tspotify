import BaseClient from './client/BaseClient.js';
import Client from './client/Client.js';

import AlbumManager from './managers/AlbumManager.js';
import ArtistManager from './managers/ArtistManager.js';
import BaseManager from './managers/BaseManager.js';
import EpisodeManager from './managers/EpisodeManager.js';
import ShowManager from './managers/ShowManager.js';
import TrackManager from './managers/TrackManager.js';

import Album from './structures/Album.js';
import Artist from './structures/Artist.js';
import BaseAlbum from './structures/BaseAlbum.js';
import BaseStructure from './structures/BaseStructure.js';
import Episode from './structures/Episode.js';
import LinkedTrack from './structures/LinkedTrack.js';
export * from './structures/Misc.js';
import Show from './structures/Show.js';
import SimplifiedAlbum from './structures/SimplifiedAlbum.js';
import SimplifiedArtist from './structures/SimplifiedArtist.js';
import SimplifiedEpisode from './structures/SimplifiedEpisode.js';
import SimplifiedShow from './structures/SimplifiedShow.js';
import SimplifiedTrack from './structures/SimplifiedTrack.js';
import Track from './structures/Track.js';

import Collection from './util/Collection.js';
export * from './util/Constants.js';
export * from './util/Interfaces.js';
export * from './util/Util.js';

export {
  BaseClient,
  Client,
  AlbumManager,
  ArtistManager,
  BaseManager,
  EpisodeManager,
  ShowManager,
  TrackManager,
  Album,
  Artist,
  BaseAlbum,
  BaseStructure,
  Episode,
  LinkedTrack,
  Show,
  SimplifiedAlbum,
  SimplifiedArtist,
  SimplifiedEpisode,
  SimplifiedShow,
  SimplifiedTrack,
  Track,
  Collection,
};
