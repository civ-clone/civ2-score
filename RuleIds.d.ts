export declare const prefix = 'civ2-score';
export declare const RuleIds: {
  citizens: string;
  wonders: string;
  spaceship: string;
  /** The pollution penalty: Classic counts the whole map's pollution for every civilization. */
  pollution: string;
  peace: string;
  futureTechnology: string;
  barbarians: string;
  worldPeace: string;
  peaceBroken: string;
};
/** civ2-game-end's respawn rule: switched off, eliminated civilizations don't restart (`RULE_NO_RESTART_ELIMINATED`). */
export declare const RESPAWN_RULE = 'civ2-game-end:player/defeated/respawn';
export default RuleIds;
