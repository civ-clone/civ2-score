import { MapSize } from '@civ-clone/civ2-rules/lib/mapSize';

// Civilization II's score, its conquest bonus and its rating, with C's integer arithmetic (OpenCiv2 `src/auto/civ.cpp`
//  `civ_calc_score` ~4102 and `civ_rating_window_draw` ~2510, richardpenman/civ2@49f26ec).

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** A city's citizens: its size, plus its happy citizens, less its unhappy ones (the angry among them). */
export const citizensScore = (
  size: number,
  happy: number,
  unhappy: number
): number => size + happy - unhappy;

/** 20 for each Wonder standing in the civilization's cities. */
export const wondersScore = (wonders: number): number => wonders * 20;

/** A ship that arrived first: its colonists (habitation counted, in tens of thousands) × its chance of success in %. */
export const spaceshipScore = (population: number, success: number): number =>
  success !== 0 && population !== 0 ? population * success : 0;

/**
 * The pollution penalty: −10 for each polluted square, less those in computer players' city radii
 *  (`game.polluted_tiles − game.warming_pollution`). Classic counts the whole map for every civilization; civ2-enhanced
 *  may pass a civilization's own.
 */
export const pollutionScore = (polluted: number, discounted: number): number =>
  0 - 10 * (polluted - discounted);

/** The world's peace, after turn 199: 3 for each turn of it, at most 100. */
export const peaceScore = (turn: number, peaceTurns: number): number =>
  turn > 199 ? clamp(peaceTurns * 3, 0, 100) : 0;

/** 5 for each Future Technology. */
export const futureTechnologyScore = (futureTechnologies: number): number =>
  futureTechnologies * 5;

/** The barbarian setting, 0 to 3: −50, −25, 0 or +25. */
export const barbariansScore = (activity: number): number => activity * 25 - 50;

/**
 * The conquest bonus of the last civilization standing: 100 for each enemy the game started with, + 2 × (570 − turn),
 *  + 400; with eliminated civilizations not restarting, a turn before 251 counts as 250. ×5/4 on a large map, ×4/5 on a
 *  small one.
 */
export const conquestBonus = (
  turn: number,
  enemies: number,
  size: MapSize = 'normal',
  restarts: boolean = true
): number => {
  const endTurn = !restarts && turn < 251 ? 250 : turn;
  let bonus = enemies * 100 + (570 - endTurn) * 2 + 400;

  if (size === 'large') {
    bonus = Math.trunc((bonus * 5) / 4);
  }

  if (size === 'small') {
    bonus = Math.trunc((bonus * 4) / 5);
  }

  return bonus;
};

/** The rating's factor by level, 0 Chieftain to 5 Deity: 4, 5, 6, 8, 10, 13. */
export const ratingFactor = (level: number): number => {
  let factor = level + 4;

  if (level > 2) {
    factor = level + 5;
  }

  if (level > 3) {
    factor++;
  }

  if (level > 4) {
    factor += 2;
  }

  return factor;
};

/** The rating in %: the better of the score and the conquest bonus, × the level's factor, / 100. */
export const rating = (score: number, level: number): number =>
  Math.trunc((ratingFactor(level) * score) / 100);

/** The most titles there are, 24: `title` gives 0 to 23. */
export const TITLES = 24;

/** The title a rating earns, 0 to 23: the largest i − 1, for i from 1 to 24, with i² / 3 ≤ the rating. */
export const title = (ratingValue: number): number => {
  let index = 0;

  for (let i = 1; i < 25; i++) {
    if (Math.trunc((i * i) / 3) <= ratingValue) {
      index = i - 1;
    }
  }

  return Math.min(index, TITLES - 1);
};
