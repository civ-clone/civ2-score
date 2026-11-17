import { MapSize } from '@civ-clone/civ2-rules/lib/mapSize';
/** A city's citizens: its size, plus its happy citizens, less its unhappy ones (the angry among them). */
export declare const citizensScore: (
  size: number,
  happy: number,
  unhappy: number
) => number;
/** 20 for each Wonder standing in the civilization's cities. */
export declare const wondersScore: (wonders: number) => number;
/** A ship that arrived first: its colonists (habitation counted, in tens of thousands) × its chance of success in %. */
export declare const spaceshipScore: (
  population: number,
  success: number
) => number;
/**
 * The pollution penalty: −10 for each polluted square, less those in computer players' city radii
 *  (`game.polluted_tiles − game.warming_pollution`). Classic counts the whole map for every civilization; civ2-enhanced
 *  may pass a civilization's own.
 */
export declare const pollutionScore: (
  polluted: number,
  discounted: number
) => number;
/** The world's peace, after turn 199: 3 for each turn of it, at most 100. */
export declare const peaceScore: (turn: number, peaceTurns: number) => number;
/** 5 for each Future Technology. */
export declare const futureTechnologyScore: (
  futureTechnologies: number
) => number;
/** The barbarian setting, 0 to 3: −50, −25, 0 or +25. */
export declare const barbariansScore: (activity: number) => number;
/**
 * The conquest bonus of the last civilization standing: 100 for each enemy the game started with, + 2 × (570 − turn),
 *  + 400; with eliminated civilizations not restarting, a turn before 251 counts as 250. ×5/4 on a large map, ×4/5 on a
 *  small one.
 */
export declare const conquestBonus: (
  turn: number,
  enemies: number,
  size?: MapSize,
  restarts?: boolean
) => number;
/** The rating's factor by level, 0 Chieftain to 5 Deity: 4, 5, 6, 8, 10, 13. */
export declare const ratingFactor: (level: number) => number;
/** The rating in %: the better of the score and the conquest bonus, × the level's factor, / 100. */
export declare const rating: (score: number, level: number) => number;
/** The most titles there are, 24: `title` gives 0 to 23. */
export declare const TITLES = 24;
/** The title a rating earns, 0 to 23: the largest i − 1, for i from 1 to 24, with i² / 3 ≤ the rating. */
export declare const title: (ratingValue: number) => number;
