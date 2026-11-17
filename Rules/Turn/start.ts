import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import {
  WorldPeaceRegistry,
  instance as worldPeaceRegistryInstance,
} from '@civ-clone/core-score/WorldPeaceRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import RuleIds from '../../RuleIds';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';

// A turn of the world's peace, from turn 200 (OpenCiv2 `src/auto/game.cpp` `game_advance_turn` ~1684:
//  `if (199 < game.turn) game.peace_turns++`, after the turn has moved on). A fight resets it (`Rules/Unit/defeated`).
export const getRules = (
  worldPeaceRegistry: WorldPeaceRegistry = worldPeaceRegistryInstance,
  turn: Turn = turnInstance
): Start[] => [
  new Start(
    RuleIds.worldPeace,
    new Effect((): void => {
      if (turn.value() > 199) {
        worldPeaceRegistry.get().increment();
      }
    })
  ),
];

export default getRules;
