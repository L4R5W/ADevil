import { RebuyableMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { SpeedrunMilestones } from "./speedrun";

export class BreakInfinityUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.infinityPoints;
  }

  get set() {
    return player.infinityUpgrades;
  }

  get isAvailableForPurchase() {
    if (player.ADevil.infUpgGridNames.includes(this.config.id)) return ADevil.canBuyInfUpgrade(this.config.id);
    return true;
  }

  onPurchased() {
    if (this.id === "postGalaxy") {
      SpeedrunMilestones(7).tryComplete();
      PelleStrikes.powerGalaxies.trigger();
    }
  }
}

class RebuyableBreakInfinityUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.infinityPoints;
  }

  get boughtAmount() {
    return player.infinityRebuyables[this.id];
  }

  set boughtAmount(value) {
    player.infinityRebuyables[this.id] = value;
  }

  get isCapped() {
    return this.boughtAmount === this.config.maxUpgrades;
  }

  get isAvailableForPurchase() {
    if (player.ADevil.infUpgGridNames.includes(this.config.id)) return ADevil.canBuyInfUpgrade(this.config.id);
    return true;
  }

  onPurchased() {
    this.config.onPurchased?.();
  }
}

export const BreakInfinityUpgrade = mapGameDataToObject(
  GameDatabase.infinity.breakUpgrades,
  config => (config.rebuyable
    ? new RebuyableBreakInfinityUpgradeState(config)
    : new BreakInfinityUpgradeState(config))
);
