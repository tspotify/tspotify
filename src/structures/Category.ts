import { Image } from './Misc.js';
import BaseStructure from './BaseStructure.js';
import type Client from '../client/Client.js';
import type { CategoryObject, ImageObject } from 'spotify-api-types';

export default class Category extends BaseStructure {
  /**
   * A link to the Web API endpoint returning full details of the category
   */
  href: string;

  /**
   * The category icons, in various sizes
   */
  icons: Array<Image>;

  /**
   * The name of the category
   */
  name: string;

  constructor(client: Client, data: CategoryObject) {
    super(client, data.id);

    this.href = data.href;

    this.icons = this._patchImages(data.icons);

    this.name = data.name;
  }

  private _patchImages(data: Array<ImageObject>): Array<Image> {
    const imagesArray: Array<Image> = [];
    data.forEach(imageObject => {
      imagesArray.push(new Image(imageObject));
    });
    return imagesArray;
  }
}
