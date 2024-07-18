/* eslint-disable max-len */
export const ADevil = {
  randomIndex(array) {
    let type = array;
    // Start with infinity upgrades for now
    type = InfinityUpgrade.all;
    let current = type.length, random;

    while (current > 0) {

      random = Math.floor(Math.random() * current);
      current--;

      [type[current], type[random]] =
        [type[random], type[current]];
    }

    return type;
  },
  shuffleArray(array) {
    for (let i = 0; i < array.length - 1; i++) {
      const j = i + Math.floor(Math.random() * (array.length - i));
      const temporary = array[j];
      array[j] = array[i];
      array[i] = temporary;
    }
    return array;
  },
  getInfinityUpgradeGrid() {
    let upgrades = [
      InfinityUpgrade.totalTimeMult, InfinityUpgrade.dim18mult, InfinityUpgrade.dim36mult, InfinityUpgrade.resetBoost,
      InfinityUpgrade.buy10Mult, InfinityUpgrade.dim27mult, InfinityUpgrade.dim45mult, InfinityUpgrade.galaxyBoost,
      InfinityUpgrade.thisInfinityTimeMult, InfinityUpgrade.unspentIPMult, InfinityUpgrade.dimboostMult,
      InfinityUpgrade.ipGen, InfinityUpgrade.skipReset1, InfinityUpgrade.skipReset2, InfinityUpgrade.skipReset3,
      InfinityUpgrade.skipResetGalaxy
    ];
    upgrades = ADevil.shuffleArray(upgrades);
    const names = [];
    for (let i = 0; i < 16; i++) {
      names.push(upgrades[i].config.id);
    }
    player.ADevil.infUpgGridNames = names;
    const cl1 = upgrades.splice(0, 4);
    const cl2 = upgrades.splice(0, 4);
    const cl3 = upgrades.splice(0, 4);
    const cl4 = upgrades;

    return [
      cl1, cl2, cl3, cl4
    ];
  },
  canBuyInfUpgrade(array) {
    const upgrades = player.ADevil.infUpgGridNames;

    let number = 0;
    let rangeLow = 0;
    for (let i = 0; i < 16; i++) {
      if (upgrades[i] === array) {
        number = i;
        rangeLow = 4 * Math.floor(number / 4);
      }
    }
    const upgradesToCheck = [];
    for (let j = rangeLow; j < number; j++) {
      upgradesToCheck.push(upgrades[j]);
    }
    if (InfinityUpgrade.all.filter(u => upgradesToCheck.includes(u.id) && u.isBought).length === number - rangeLow) return true;
    return false;
  },
  randomDimTier(dimType) {
    // TODO: Disable vue warn for duplicated keys if possible
    const result = [];
    let unlockedTier = 0;
    if (dimType === "antimatter") {
      for (let i = 0; i < 8; i++) {
        if (AntimatterDimensions.all[i].isAvailableForPurchase) unlockedTier += 1;
      }
    }
    if (dimType === "infinity") {
      for (let i = 0; i < 8; i++) {
        if (InfinityDimensions.all[i].isUnlocked) unlockedTier += 1;
      }
    }
    if (dimType === "time") {
      for (let i = 0; i < 8; i++) {
        if (TimeDimensions.all[i].isUnlocked) unlockedTier += 1;
      }
    }
    for (let i = 0; i < unlockedTier; i++) {
      result.push(1 + Math.floor(Math.random() * unlockedTier));
    }
    return result;
  },
  prestigesAchieved() {
    // Gives four arrays: unlocked upgrades, achieved prestiges, all upgrades, all upgrade ID
    const u = [];
    const p = [];
    const a = [];
    let ids = [];
    const i = [];
    if (PlayerProgress.infinityUnlocked()) {
      u.push(InfinityUpgrade.all);
      p.push("InfinityUpgrade");
    }
    if (PlayerProgress.hasBroken()) {
      u.push(BreakInfinityUpgrade.all);
      p.push("BreakInfinityUpgrade");
    }
    if (PlayerProgress.eternityUnlocked()) {
      u.push(EternityUpgrade.all);
      p.push("EternityUpgrade");
    }
    if (PlayerProgress.dilationUnlocked()) {
      u.push(DilationUpgrade.all);
      p.push("DilationUpgrade");
    }
    if (PlayerProgress.realityUnlocked()) {
      u.push(RealityUpgrades.all);
      p.push("RealityUpgrades");
    }
    if (MachineHandler.isIMUnlocked) {
      u.push(ImaginaryUpgrades.all);
      p.push("ImaginaryUpgrades");
    }
    a.push(InfinityUpgrade.all, BreakInfinityUpgrade.all, EternityUpgrade.all, DilationUpgrade.all, RealityUpgrades.all, ImaginaryUpgrades.all);

    ids = a.filter(upg => u.includes(upg));

    for (let k = 0; k < ids.length; k++) {
      for (let j = 0; j < ids[k].length; j++) {
        i.push(ids[k][j]._config.id);
      }
    }

    return [u, p, a, i];
  },
  upgradesToBeRandomized() {
    const u = ADevil.prestigesAchieved()[0];
    const p = ADevil.prestigesAchieved()[1];
    let all = [InfinityUpgrade.all, BreakInfinityUpgrade.all, EternityUpgrade.all,
      DilationUpgrade.all, RealityUpgrades.all, ImaginaryUpgrades.all];
    all = all.filter(x => u.includes(x));

    let keys = ["InfinityUpgrade", "BreakInfinityUpgrade", "EternityUpgrade",
      "DilationUpgrade", "RealityUpgrades", "ImaginaryUpgrades"];
    keys = keys.filter(x => p.includes(x));

    const upgToRandom = all.reduce((acc, cur, index) => ({ ...acc,
      [keys[index]]: cur
    }), {});

    return upgToRandom;
  }
};