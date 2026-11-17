"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const core_game_1 = require("@civ-clone/core-game");
const activity_1 = require("@civ-clone/civ2-barbarians/lib/activity");
const score_1 = require("./Rules/Player/score");
const start_1 = require("./Rules/Turn/start");
const defeated_1 = require("./Rules/Unit/defeated");
const register = (game) => game.rules.register(...(0, score_1.default)(game, { activity: () => (0, activity_1.default)(game) }), ...(0, start_1.default)(game.worldPeace, game.turn), ...(0, defeated_1.default)(game.worldPeace));
exports.register = register;
// The plugin loader imports each package for this side effect.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map