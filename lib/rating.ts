import { GameResultRegistry } from '@civ-clone/core-turn-based-game/GameResultRegistry';
import Player from '@civ-clone/core-player/Player';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import { RESPAWN_RULE } from '../RuleIds';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { conquestBonus } from './scoring';
import { conquestBonusFor as baseConquestBonusFor } from '@civ-clone/base-game-end/lib/conquest';
import mapSize from '@civ-clone/civ2-rules/lib/mapSize';

/**
 * The conquest bonus `player` scores, or `null` unless they conquered the world (base-game-end's `conquestBonusFor`):
 *  `conquestBonus` of the turn the game ended on, the opponents (every other civilization that has been in the game),
 *  the map's size and whether eliminated civilizations restart, which they don't with civ2-game-end's respawn rule
 *  switched off. The score is the better of this and the score (`civ_rating_window_draw`).
 */
export const conquestBonusFor = (
  player: Player,
  gameResultRegistry: GameResultRegistry,
  playerWorldRegistry: PlayerWorldRegistry,
  ruleRegistry: RuleRegistry | null = null
): number | null => {
  const [playerWorld]: PlayerWorld[] = playerWorldRegistry.entries(),
    size = playerWorld
      ? mapSize(playerWorld.width() * playerWorld.height())
      : 'normal',
    respawn = ruleRegistry?.getById(RESPAWN_RULE) ?? null,
    restarts = respawn === null || respawn.enabled();

  return baseConquestBonusFor(
    player,
    gameResultRegistry,
    playerWorldRegistry,
    (turn: number, opponents: number): number =>
      conquestBonus(turn, opponents, size, restarts)
  );
};

export { rating, title, TITLES } from './scoring';

export default conquestBonusFor;
