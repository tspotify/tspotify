import Client from '../client/Client.js';
import BaseStructure from './BaseStructure.js';
import { ExternalUrl, Image } from './Misc.js';
import type { Copyright } from './Misc.js';
import type { SimplifiedShowObject, ImageObject } from 'spotify-api-types';

export default class SimplifiedShow extends BaseStructure {
  /**
   * A list of the countries in which the show can be played, identified by their `ISO 3166-1 alpha-2` code
   */
  availableMarkets: Array<string>;

  /**
   * The copyright statements of the show
   */
  copyrights: Array<Copyright>;

  /**
   * A description of the show
   */
  description: string;

  /**
   * Whether or not the show has explicit content (`true` = yes it does; `false` = no it does not OR unknown)
   */
  explicit: boolean;

  /**
   * External URLs for this show
   */
  externalUrls: ExternalUrl;

  /**
   * A link to the Web API endpoint providing full details of the show
   */
  href: string;

  /**
   * The cover art for the show in various sizes, widest first
   */
  images: Array<Image>;

  /**
   * Whether all of the show’s episodes are hosted outside of Spotify’s CDN
   */
  isExternallyHosted: boolean | null;

  /**
   * A list of the languages used in the show, identified by their `ISO 639` code
   */
  languages: Array<string>;

  /**
   * The media type of the show
   */
  mediaType: string;

  /**
   * The name of the show
   */
  name: string;

  /**
   * The publisher of the show
   */
  publisher: string;

  /**
   * The object type: `show`
   */
  rawObjectType: string;

  /**
   * The Spotify URI for the show
   */
  uri: string;

  constructor(client: Client, data: SimplifiedShowObject) {
    super(client, data.id);

    this.availableMarkets = data.available_markets;

    this.copyrights = data.copyrights;

    this.description = data.description;

    this.explicit = data.explicit;

    this.externalUrls = new ExternalUrl(data.external_urls);

    this.href = data.href;

    this.images = this._patchImages(data.images);

    this.isExternallyHosted = data.is_externally_hosted;

    this.languages = data.languages;

    this.mediaType = data.media_type;

    this.name = data.name;

    this.publisher = data.publisher;

    this.rawObjectType = data.type;

    this.uri = data.uri;
  }

  private _patchImages(data: Array<ImageObject>): Array<Image> {
    const imagesArray: Array<Image> = [];
    data.forEach(imageObject => {
      imagesArray.push(new Image(imageObject));
    });
    return imagesArray;
  }
}
