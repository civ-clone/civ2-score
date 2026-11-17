import AIClient from '@civ-clone/core-ai-client/AIClient';
import Barbarian from '@civ-clone/base-civilization-barbarian/Barbarian';
import Defeated from '@civ-clone/core-unit/Rules/Defeated';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game';
import GameResult from '@civ-clone/core-turn-based-game/GameResult';
import Player from '@civ-clone/core-player/Player';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Rule from '@civ-clone/core-rule/Rule';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Unit from '@civ-clone/core-unit/Unit';
import { conquestBonusFor } from '../lib/rating';
import { expect } from 'chai';
import { register } from '../registerRules';
import { scoreTerms } from '@civ-clone/core-score/lib/score';

const setUp = () => {
  const rules = new RuleRegistry(),
    turn = new Turn(),
    game = new Game({ rules, turn }),
    player = new Player(rules),
    barbarians = new Player(rules);

  barbarians.setCivilization(new Barbarian());
  register(game);
  game.players.register(player, barbarians);
  game.clients.register(new AIClient(player));

  const unitOf = (owner: Player) =>
      ({ player: () => owner } as unknown as Unit),
    startTurn = (value: number): void => {
      turn.set(value);
      rules.process(Start, turn);
    };

  return { barbarians, game, player, rules, startTurn, unitOf };
};

describe('civ2-score rules', (): void => {
  it('scores every term, with nothing built: only the barbarian setting', (): void => {
    const { game, player, rules } = setUp();

    expect(
      scoreTerms(player, rules).map(({ term, value }) => [term, value])
    ).eql([
      ['citizens', 0],
      ['wonders', 0],
      ['spaceship', 0],
      ['pollution', 0],
      ['peace', 0],
      ['future-technology', 0],
      // No civ2-barbarians rules: the default setting, 2.
      ['barbarians', 0],
    ]);
    expect(game.worldPeace.turns()).equal(0);
  });

  it('counts a turn of peace from turn 200, and ends it with any fight but the barbarians’', (): void => {
    const { barbarians, game, player, rules, startTurn, unitOf } = setUp(),
      peace = () =>
        scoreTerms(player, rules).find(({ term }) => term === 'peace')!.value;

    startTurn(199);
    expect(game.worldPeace.turns()).equal(0);

    startTurn(200);
    startTurn(201);
    expect(game.worldPeace.turns()).equal(2);
    expect(peace()).equal(6);

    rules.process(Defeated, unitOf(barbarians), unitOf(player), null);
    rules.process(Defeated, unitOf(player), unitOf(barbarians), null);
    expect(game.worldPeace.turns()).equal(2);

    rules.process(Defeated, unitOf(player), unitOf(player), null);
    expect(game.worldPeace.turns()).equal(0);
  });
});

describe('lib/rating: conquestBonusFor', (): void => {
  it("scores the conqueror only, by the game's end turn, opponents, map and restarts", (): void => {
    const rules = new RuleRegistry(),
      [winner, loser, other] = [
        new Player(rules),
        new Player(rules),
        new Player(rules),
      ],
      worlds = {
        entries: () =>
          [winner, loser, other].map((player) => ({
            player: () => player,
            width: () => 80,
            height: () => 50,
          })),
      } as unknown as PlayerWorldRegistry,
      result = (reason: string) =>
        ({
          get: () => new GameResult(reason, winner, 200),
        } as any),
      respawn = new Rule(
        'civ2-game-end:player/defeated/respawn',
        new Effect(() => null)
      );

    expect(conquestBonusFor(loser, result('conquest'), worlds)).null;
    expect(conquestBonusFor(winner, result('date'), worlds)).null;
    // 2 opponents, turn 200: 200 + 740 + 400.
    expect(conquestBonusFor(winner, result('conquest'), worlds)).equal(1340);

    rules.register(respawn);
    respawn.disable();
    // Turn 200 counts as 250 with no restarts: 200 + 640 + 400.
    expect(conquestBonusFor(winner, result('conquest'), worlds, rules)).equal(
      1240
    );
  });
});
