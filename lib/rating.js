"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TITLES = exports.title = exports.rating = exports.conquestBonusFor = void 0;
const RuleIds_1 = require("../RuleIds");
const scoring_1 = require("./scoring");
const conquest_1 = require("@civ-clone/base-game-end/lib/conquest");
const mapSize_1 = require("@civ-clone/civ2-rules/lib/mapSize");
/**
 * The conquest bonus `player` scores, or `null` unless they conquered the world (base-game-end's `conquestBonusFor`):
 *  `conquestBonus` of the turn the game ended on, the opponents (every other civilization that has been in the game),
 *  the map's size and whether eliminated civilizations restart, which they don't with civ2-game-end's respawn rule
 *  switched off. The score is the better of this and the score (`civ_rating_window_draw`).
 */
const conquestBonusFor = (player, gameResultRegistry, playerWorldRegistry, ruleRegistry = null) => {
    var _a;
    const [playerWorld] = playerWorldRegistry.entries(), size = playerWorld
        ? (0, mapSize_1.default)(playerWorld.width() * playerWorld.height())
        : 'normal', respawn = (_a = ruleRegistry === null || ruleRegistry === void 0 ? void 0 : ruleRegistry.getById(RuleIds_1.RESPAWN_RULE)) !== null && _a !== void 0 ? _a : null, restarts = respawn === null || respawn.enabled();
    return (0, conquest_1.conquestBonusFor)(player, gameResultRegistry, playerWorldRegistry, (turn, opponents) => (0, scoring_1.conquestBonus)(turn, opponents, size, restarts));
};
exports.conquestBonusFor = conquestBonusFor;
var scoring_2 = require("./scoring");
Object.defineProperty(exports, "rating", { enumerable: true, get: function () { return scoring_2.rating; } });
Object.defineProperty(exports, "title", { enumerable: true, get: function () { return scoring_2.title; } });
Object.defineProperty(exports, "TITLES", { enumerable: true, get: function () { return scoring_2.TITLES; } });
exports.default = exports.conquestBonusFor;
//# sourceMappingURL=rating.js.map