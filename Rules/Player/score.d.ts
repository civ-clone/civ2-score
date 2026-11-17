import { Game } from '@civ-clone/core-game';
import Score from '@civ-clone/core-score/Rules/Score';
export type ScoreGame = Pick<
  Game,
  | 'cities'
  | 'cityGrowth'
  | 'clients'
  | 'gameResult'
  | 'pendingEffects'
  | 'playerGovernments'
  | 'playerResearch'
  | 'spaceships'
  | 'specialists'
  | 'tileImprovements'
  | 'turn'
  | 'wonders'
  | 'worldPeace'
>;
export interface ScoreOptions {
  /** The barbarian setting, 0 to 3 (civ2-barbarians' `activityLevel`). */
  activity: () => number;
}
/** Civilization II's score terms (OpenCiv2 `src/auto/civ.cpp` `civ_calc_score` ~4102, richardpenman/civ2@49f26ec). */
export declare const getRules: (
  game: ScoreGame,
  { activity }: ScoreOptions
) => Score[];
export default getRules;
