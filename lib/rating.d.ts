import { GameResultRegistry } from '@civ-clone/core-turn-based-game/GameResultRegistry';
import Player from '@civ-clone/core-player/Player';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
/**
 * The conquest bonus `player` scores, or `null` unless they conquered the world (base-game-end's `conquestBonusFor`):
 *  `conquestBonus` of the turn the game ended on, the opponents (every other civilization that has been in the game),
 *  the map's size and whether eliminated civilizations restart, which they don't with civ2-game-end's respawn rule
 *  switched off. The score is the better of this and the score (`civ_rating_window_draw`).
 */
export declare const conquestBonusFor: (
  player: Player,
  gameResultRegistry: GameResultRegistry,
  playerWorldRegistry: PlayerWorldRegistry,
  ruleRegistry?: RuleRegistry | null
) => number | null;
export { rating, title, TITLES } from './scoring';
export default conquestBonusFor;
