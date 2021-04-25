import Show from '../structures/Show.js';
import BaseManager from './BaseManager.js';
import type Client from '../client/Client.js';
import type SimplifiedShow from '../structures/SimplifiedShow.js';
import type { ShowResolvable } from '../util/Interfaces.js';

export default class ShowManager extends BaseManager<ShowResolvable, Show> {
  constructor(client: Client) {
    super(client, Show);
  }

  /**
   * Resolves a ShowResolvable to a Show object
   */
  resolve(showResolvable: ShowResolvable): Show | null {
    const show = super.resolve(showResolvable);
    if (show) return show;
    const showID = this.resolveID(showResolvable);
    if (showID) return super.resolve(showID);
    return null;
  }

  /**
   * Resolves a ShowResolvable to a Show ID
   */
  resolveID(showResolvable: ShowResolvable): string | null {
    const showID = super.resolveID(showResolvable);
    if (showID) return showID;
    if ((showResolvable as SimplifiedShow).id) {
      return (showResolvable as SimplifiedShow).id;
    }
    return null;
  }
}
