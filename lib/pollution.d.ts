import City from '@civ-clone/core-city/City';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
export interface WorldPollution {
  /** The polluted squares (`game.polluted_tiles`). */
  polluted: number;
  /** Each polluted square once for each computer player's city whose radius holds it (`game.warming_pollution`). */
  discounted: number;
}
/**
 * The world's pollution as the score reads it: the polluted squares, and those counted again for each computer player's
 *  city whose radius holds them. The original counts the latter during the computer players' city processing and
 *  resets it every turn (`city.cpp` ~2460); this counts it as the score is read.
 */
export declare const worldPollution: (
  pollution: TileImprovement[],
  computerCities: City[]
) => WorldPollution;
export default worldPollution;
