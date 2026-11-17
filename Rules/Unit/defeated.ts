import {
  WorldPeaceRegistry,
  instance as worldPeaceRegistryInstance,
} from '@civ-clone/core-score/WorldPeaceRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Defeated from '@civ-clone/core-unit/Rules/Defeated';
import Effect from '@civ-clone/core-rule/Effect';
import RuleIds from '../../RuleIds';
import Unit from '@civ-clone/core-unit/Unit';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';

// Any fight between two civilizations, barbarians aside, ends the world's peace (OpenCiv2 `src/auto/unit_combat.cpp`
//  ~1531: `if (civ != 0 && civ2 != 0) game.peace_turns = 0`).
export const getRules = (
  worldPeaceRegistry: WorldPeaceRegistry = worldPeaceRegistryInstance
): Defeated[] => [
  new Defeated(
    RuleIds.peaceBroken,
    new Criterion(
      (unit: Unit, by: Unit): boolean =>
        !isBarbarian(unit.player()) && !(by && isBarbarian(by.player()))
    ),
    new Effect((): void => {
      if (worldPeaceRegistry.turns() > 0) {
        worldPeaceRegistry.get().reset();
      }
    })
  ),
];

export default getRules;
