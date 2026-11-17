import { Game, defaultGame } from '@civ-clone/core-game';
import activityLevel from '@civ-clone/civ2-barbarians/lib/activity';
import playerScore from './Rules/Player/score';
import turnStart from './Rules/Turn/start';
import unitDefeated from './Rules/Unit/defeated';

export const register = (game: Game): void =>
  game.rules.register(
    ...playerScore(game, { activity: () => activityLevel(game) }),
    ...turnStart(game.worldPeace, game.turn),
    ...unitDefeated(game.worldPeace)
  );

// The plugin loader imports each package for this side effect.
register(defaultGame);

export default register;
