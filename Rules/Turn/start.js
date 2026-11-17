"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const WorldPeaceRegistry_1 = require("@civ-clone/core-score/WorldPeaceRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const RuleIds_1 = require("../../RuleIds");
const Start_1 = require("@civ-clone/core-turn-based-game/Rules/Start");
// A turn of the world's peace, from turn 200 (OpenCiv2 `src/auto/game.cpp` `game_advance_turn` ~1684:
//  `if (199 < game.turn) game.peace_turns++`, after the turn has moved on). A fight resets it (`Rules/Unit/defeated`).
const getRules = (worldPeaceRegistry = WorldPeaceRegistry_1.instance, turn = Turn_1.instance) => [
    new Start_1.default(RuleIds_1.default.worldPeace, new Effect_1.default(() => {
        if (turn.value() > 199) {
            worldPeaceRegistry.get().increment();
        }
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map