"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.worldPollution = void 0;
/**
 * The world's pollution as the score reads it: the polluted squares, and those counted again for each computer player's
 *  city whose radius holds them. The original counts the latter during the computer players' city processing and
 *  resets it every turn (`city.cpp` ~2460); this counts it as the score is read.
 */
const worldPollution = (pollution, computerCities) => {
    const squares = new Set(pollution.map((improvement) => improvement.tile()));
    let discounted = 0;
    computerCities.forEach((city) => {
        city
            .tiles()
            .entries()
            .forEach((tile) => {
            if (squares.has(tile)) {
                discounted++;
            }
        });
    });
    return { polluted: squares.size, discounted };
};
exports.worldPollution = worldPollution;
exports.default = exports.worldPollution;
//# sourceMappingURL=pollution.js.map