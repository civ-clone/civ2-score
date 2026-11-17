"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPAWN_RULE = exports.RuleIds = exports.prefix = void 0;
// The ids of civ2-score's rules, for civ2-enhanced and a renderer to find.
exports.prefix = 'civ2-score';
exports.RuleIds = {
    citizens: `${exports.prefix}:player/score/citizens`,
    wonders: `${exports.prefix}:player/score/wonders`,
    spaceship: `${exports.prefix}:player/score/spaceship`,
    /** The pollution penalty: Classic counts the whole map's pollution for every civilization. */
    pollution: `${exports.prefix}:player/score/pollution`,
    peace: `${exports.prefix}:player/score/peace`,
    futureTechnology: `${exports.prefix}:player/score/future-technology`,
    barbarians: `${exports.prefix}:player/score/barbarians`,
    worldPeace: `${exports.prefix}:turn/start/world-peace`,
    peaceBroken: `${exports.prefix}:unit/defeated/world-peace`,
};
/** civ2-game-end's respawn rule: switched off, eliminated civilizations don't restart (`RULE_NO_RESTART_ELIMINATED`). */
exports.RESPAWN_RULE = 'civ2-game-end:player/defeated/respawn';
exports.default = exports.RuleIds;
//# sourceMappingURL=RuleIds.js.map