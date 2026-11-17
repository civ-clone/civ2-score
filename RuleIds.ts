// The ids of civ2-score's rules, for civ2-enhanced and a renderer to find.
export const prefix = 'civ2-score';

export const RuleIds = {
  citizens: `${prefix}:player/score/citizens`,
  wonders: `${prefix}:player/score/wonders`,
  spaceship: `${prefix}:player/score/spaceship`,
  /** The pollution penalty: Classic counts the whole map's pollution for every civilization. */
  pollution: `${prefix}:player/score/pollution`,
  peace: `${prefix}:player/score/peace`,
  futureTechnology: `${prefix}:player/score/future-technology`,
  barbarians: `${prefix}:player/score/barbarians`,
  worldPeace: `${prefix}:turn/start/world-peace`,
  peaceBroken: `${prefix}:unit/defeated/world-peace`,
};

/** civ2-game-end's respawn rule: switched off, eliminated civilizations don't restart (`RULE_NO_RESTART_ELIMINATED`). */
export const RESPAWN_RULE = 'civ2-game-end:player/defeated/respawn';

export default RuleIds;
