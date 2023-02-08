/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IntoTheOddActor extends Actor {
  /** @override */
  static async create(data, options = {}) {
    if (data.type === 'character') {
      mergeObject(
        data,
        {
          prototypeToken: {
            disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
            actorLink: true,
          },
        },
        { override: false }
      );
    }
    return super.create(data, options);
  }

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;
    data.armour = actorData
      .items
      .map(item => item.data.data.armour * item.data.data.equipped)
      .reduce((a,b) => a + b, 0);
  }

  
  /** @override */
  getRollData() {
    const data = super.getRollData();
    // Let us do @str etc, instead of @abilities.str.value
    for ( let [k, v] of Object.entries(data.abilities) ) {
      if ( !(k in data) ) data[k] = v.value;
    }
    return data
  }

  /** @override */
  deleteOneItem(itemId) {
    const item = this.items.get(itemId);
    if (item.data.data.quantity > 1) {
      item.data.data.quantity--;
    } else {
      item.delete();
    }
  }

  rest(full) {
    this.system.hp.value = this.system.hp.max;

    if (full) {
      this.system.abilities.dex.value = this.system.abilities.dex.max;
      this.system.abilities.str.value = this.system.abilities.str.max;
      this.system.abilities.wil.value = this.system.abilities.wil.max;
    }
  }
}
