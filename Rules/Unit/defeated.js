"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const WorldPeaceRegistry_1 = require("@civ-clone/core-score/WorldPeaceRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Defeated_1 = require("@civ-clone/core-unit/Rules/Defeated");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const RuleIds_1 = require("../../RuleIds");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
// Any fight between two civilizations, barbarians aside, ends the world's peace (OpenCiv2 `src/auto/unit_combat.cpp`
//  ~1531: `if (civ != 0 && civ2 != 0) game.peace_turns = 0`).
const getRules = (worldPeaceRegistry = WorldPeaceRegistry_1.instance) => [
    new Defeated_1.default(RuleIds_1.default.peaceBroken, new Criterion_1.default((unit, by) => !(0, isBarbarian_1.default)(unit.player()) && !(by && (0, isBarbarian_1.default)(by.player()))), new Effect_1.default(() => {
        if (worldPeaceRegistry.turns() > 0) {
            worldPeaceRegistry.get().reset();
        }
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=defeated.js.map