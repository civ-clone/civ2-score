import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import { WorldPeaceRegistry } from '@civ-clone/core-score/WorldPeaceRegistry';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
export declare const getRules: (
  worldPeaceRegistry?: WorldPeaceRegistry,
  turn?: Turn
) => Start[];
export default getRules;
