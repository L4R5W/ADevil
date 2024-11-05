/* eslint-disable max-len */


// Upgrade Rando! Breakdown:
//  - getRandomUpgradeOrder() includes all upgrade-data (the actual objects) and gives them in a random array/order
//      we dont do dupes because later on with 50+ upgrades and less than 10 on average per tab it would get too annoying to look for one
//      can always go back to consider dupes using smth like "let k = Math.random()*n; for i=1,..,n add upgrade[k] to grid"
//  - getInfinityUpgradeGrid() uses THE FIRST 16 for making the grid (needs to stay first 16 to check for purchaseable)
//  - getBreakUpgradeGrid() uses THE NEXT 12 for making the grid
//
//
//
//
// Antimatter
//    Random dim rows, check if we can have dups, try to get dims from all types in a single tab
//    Switch around galaxy and dimboost buttons
//
// Infinity   ---   done!
//    16+2 upgrades; 9+3 break upgrades
//
// Eternity
//    6+1 upgrades; lotta studies
//    Change study layout AND connections
//    Check if we can have duplicates in study tree, if not array all studies and get the list and layout from there
//    Dilation: 10+3 upgrades; @ GalGen another 2+3
//
// Reality
//    20+5 rupg; 15+10 iupg
//    BH: 6, but at some point it'll be only 2. Need to check if we can proof on BH[1/2].isPermanent
//    Perks will be a nightmare to switch around, ask spec maybe?
//    Alchemy nodes? Reaction drain&outcome amount? Check if we can have duplicates (Picture: 1A+200A=2B; 2B+10C=30A; etc, gwtting 25k each will be f u n)
//    Glyphs appearance is probably not feasible, if so disable cosmetics or dont save them
//
// Celestials
//    Teresa (pour unique styling, PP shop seems doable -> rebuyable!!),
//    Effarig (5, unique styling)
//    Enslaved (2)
//    V (6 or 8)
//    Ra (probably not feasible, just switch memory-milestones with each other + all pet spots)
//    Lai'tela (probably not feasible, just switch singularity-milestones with each other + DMD rows + Annihilation)
//    Pelle (5 rebuyables, lot of upgrades, 5/10 buyable/visible; @ GalGen another 5 rebuyables, also switch rift bar milestones?)
//
// Maybe change so automator commands are unlocked by default/from achievements/ressource amounts
// Potentially add chance of {prestige} yielding appropriate amount of {prestige-1}; picture eternity-ing gives IP
//
//
export const ADevil = {
  allUpgrades() {
    return [
      InfinityUpgrade.totalTimeMult, InfinityUpgrade.dim18mult, InfinityUpgrade.dim36mult, InfinityUpgrade.resetBoost,
      InfinityUpgrade.buy10Mult, InfinityUpgrade.dim27mult, InfinityUpgrade.dim45mult, InfinityUpgrade.galaxyBoost,
      InfinityUpgrade.thisInfinityTimeMult, InfinityUpgrade.unspentIPMult, InfinityUpgrade.dimboostMult,
      InfinityUpgrade.ipGen, InfinityUpgrade.skipReset1, InfinityUpgrade.skipReset2, InfinityUpgrade.skipReset3,
      InfinityUpgrade.skipResetGalaxy,
      InfinityUpgrade.ipOffline, InfinityUpgrade.ipMult,
      BreakInfinityUpgrade.totalAMMult, BreakInfinityUpgrade.currentAMMult, BreakInfinityUpgrade.galaxyBoost,
      BreakInfinityUpgrade.infinitiedMult, BreakInfinityUpgrade.achievementMult, BreakInfinityUpgrade.slowestChallengeMult,
      BreakInfinityUpgrade.infinitiedGen, BreakInfinityUpgrade.autobuyMaxDimboosts, BreakInfinityUpgrade.autobuyerSpeed,
      BreakInfinityUpgrade.tickspeedCostMult, BreakInfinityUpgrade.dimCostMult, BreakInfinityUpgrade.ipGen
    ];
  },
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
  getRandomUpgradeOrder() {
    let upgrades = ADevil.allUpgrades();
    upgrades = ADevil.shuffleArray(upgrades);

    return upgrades;
  },
  getInfinityUpgradeGrid() {
    const upgrades = ADevil.getRandomUpgradeOrder();
    const names = [];
    for (let i = 0; i < 16; i++) {
      names.push(upgrades[i].config.id);
    }
    player.ADevil.infUpgGridNames = names;

    const column1 = upgrades.splice(0, 4);
    const column2 = upgrades.splice(0, 4);
    const column3 = upgrades.splice(0, 4);
    const column4 = upgrades.splice(0, 4);

    const InfUpgGrid = [
      column1, column2, column3, column4
    ];
    return InfUpgGrid;
  },
  getBreakUpgradeGrid() {
    const upgrades = ADevil.getRandomUpgradeOrder();
    const row1 = upgrades.splice(0, 3);
    const row2 = upgrades.splice(0, 3);
    const row3 = upgrades.splice(0, 3);
    const row4 = upgrades.splice(0, 3);

    const InfUpgGrid = [
      row1, row2, row3, row4
    ];
    return InfUpgGrid;
  },
  canBuyInfUpgrade(upgradeConfig) {
    const upgrades = player.ADevil.infUpgGridNames;

    let number = 0;
    let rangeLow = 0;
    for (let i = 0; i < 16; i++) {
      if (upgrades[i] === upgradeConfig) {
        number = i;
        rangeLow = 4 * Math.floor(number / 4);
      }
    }
    const upgradesToCheck = [];
    for (let j = rangeLow; j < number; j++) {
      upgradesToCheck.push(upgrades[j]);
    }
    if (ADevil.allUpgrades().filter(u => upgradesToCheck.includes(u.id) && u.isBought).length === number - rangeLow) return true;
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