import {
  Fuel,
  Habitation,
  LifeSupport,
  Power,
  Propulsion,
  Structural,
} from '@civ-clone/civ2-spaceship/Parts';
import {
  LuxuryHappiness,
  PopulationUnhappiness,
} from '@civ-clone/civ2-city-happiness/Yields';
import AIClient from '@civ-clone/core-ai-client/AIClient';
import City from '@civ-clone/core-city/City';
import GameResult from '@civ-clone/core-turn-based-game/GameResult';
import Part from '@civ-clone/core-spaceship/Part';
import PendingEffectRegistry from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import Player from '@civ-clone/core-player/Player';
import Pollution from '@civ-clone/base-tile-improvement-pollution/Pollution';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import SpaceshipLayout from '@civ-clone/civ2-spaceship/SpaceshipLayout';
import Tile from '@civ-clone/core-world/Tile';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import { expect } from 'chai';
import getRules from '../Rules/Player/score';
import { scoreTerms } from '@civ-clone/core-score/lib/score';

// The score rules over a stand-in game: a person and a computer player, each with cities, Wonders and a ship.
const setUp = (result: (person: Player) => GameResult | null) => {
  const rules = new RuleRegistry(),
    [person, computer] = [new Player(rules), new Player(rules)],
    [a, b, c, d] = [{}, {}, {}, {}] as Tile[],
    sizes = new Map<City, number>(),
    city = (
      player: Player,
      size: number,
      yields: unknown[],
      tiles: Tile[]
    ): City => {
      const stand = {
        player: () => player,
        yields: () => yields,
        tiles: () => ({ entries: () => tiles }),
        destroyed: () => false,
      } as unknown as City;

      sizes.set(stand, size);

      return stand;
    },
    cities = new Map<Player, City[]>([
      [
        person,
        [
          // 4 citizens, 2 born unhappy: 2 content, 2 unhappy.
          city(person, 4, [new PopulationUnhappiness(2)], [c, a]),
          // 3 content, 1 of them made happy by luxuries.
          city(person, 3, [new LuxuryHappiness(1)], [d]),
        ],
      ],
      [computer, [city(computer, 2, [], [a, b])]],
    ]),
    layout = new SpaceshipLayout(rules),
    standInCity = { player: () => person } as unknown as City;

  (
    [
      [Structural, 39],
      [Propulsion, 8],
      [Fuel, 8],
      [Habitation, 4],
      [LifeSupport, 4],
      [Power, 4],
    ] as [typeof Part, number][]
  ).forEach(([PartType, count]) => {
    for (let i = 0; i < count; i++) {
      layout
        .slots()
        .find(
          (slot) =>
            slot.empty() && slot.accepts(new PartType(standInCity, rules))
        )!
        .fill(new PartType(standInCity, rules));
    }
  });

  const ships = new Map<Player, unknown[]>([
      [
        person,
        [
          {
            player: () => person,
            successful: () => true,
            layout: () => layout,
          },
        ],
      ],
    ]),
    pollution = [a, b, c].map((tile) =>
      Object.assign(Object.create(Pollution.prototype), { tile: () => tile })
    ),
    turn = new Turn(),
    game = {
      cities: {
        getByPlayer: (player: Player) => cities.get(player) ?? [],
        entries: () => [...cities.values()].flat(),
      },
      cityGrowth: {
        getByCity: (city: City) => ({ size: () => sizes.get(city) }),
      },
      clients: {
        getBy: (key: string, player: Player) =>
          player === person ? [{}] : [Object.create(AIClient.prototype)],
      },
      gameResult: { get: () => result(person) },
      pendingEffects: new PendingEffectRegistry(),
      playerGovernments: {
        getByPlayer: () => {
          throw new TypeError('none');
        },
      },
      playerResearch: {
        getByPlayer: () => {
          throw new TypeError('none');
        },
      },
      spaceships: {
        getBy: (key: string, player: Player) => ships.get(player) ?? [],
      },
      specialists: { getByCity: () => [] },
      tileImprovements: {
        filter: (test: (improvement: unknown) => boolean) =>
          pollution.filter(test),
      },
      turn,
      wonders: {
        getByPlayer: (player: Player) =>
          player === person
            ? [
                { city: () => ({ destroyed: () => false }) },
                // Lost with its city: counts for nobody.
                { city: () => ({ destroyed: () => true }) },
              ]
            : [],
      },
      worldPeace: { turns: () => 0 },
    } as any;

  rules.register(...getRules(game, { activity: () => 3 }));

  const terms = (player: Player) =>
    Object.fromEntries(
      scoreTerms(player, rules).map(({ term, value }) => [term, value])
    );

  return { computer, person, terms };
};

describe('civ2-score: the terms', (): void => {
  it("counts the citizens, the standing Wonders, the pollution in computer players' city radii and the setting", (): void => {
    const { computer, person, terms } = setUp(() => null);

    expect(terms(person)).eql({
      // (4 + 0 − 2) + (3 + 1 − 0)
      citizens: 6,
      wonders: 20,
      spaceship: 0,
      // 3 polluted squares, 2 of them in the computer player's city's radius (the person's don't count): 3 − 2.
      pollution: -10,
      peace: 0,
      'future-technology': 0,
      barbarians: 25,
    });
    // 2 citizens, both content.
    expect(terms(computer).citizens).equal(2);
    expect(terms(computer).pollution).equal(-10);
  });

  it('counts the ship only for the player whose ship won', (): void => {
    const won = setUp((person) => new GameResult('spaceship', person, 300)),
      lostOut = setUp(() => new GameResult('spaceship', null, 300)),
      retired = setUp((person) => new GameResult('date', person, 300));

    // 4 habitation modules at 100%.
    expect(won.terms(won.person).spaceship).equal(400);
    expect(lostOut.terms(lostOut.person).spaceship).equal(0);
    expect(retired.terms(retired.person).spaceship).equal(0);
  });
});
