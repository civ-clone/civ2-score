import {
  barbariansScore,
  citizensScore,
  futureTechnologyScore,
  peaceScore,
  pollutionScore,
  spaceshipScore,
  wondersScore,
} from '../../lib/scoring';
import City from '@civ-clone/core-city/City';
import Effect from '@civ-clone/core-rule/Effect';
import FutureTechnology from '@civ-clone/base-science-advance-future-technology/FutureTechnology';
import { Game } from '@civ-clone/core-game';
import { IScoreTerm } from '@civ-clone/core-score/Rules/Score';
import Player from '@civ-clone/core-player/Player';
import Pollution from '@civ-clone/base-tile-improvement-pollution/Pollution';
import RuleIds from '../../RuleIds';
import Score from '@civ-clone/core-score/Rules/Score';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { citizenSummary } from '@civ-clone/base-city-happiness/lib/calculateCitizenState';
import isHuman from '@civ-clone/base-difficulty/lib/isHuman';
import stagedHappiness from '@civ-clone/civ2-city-happiness/lib/stagedHappiness';
import { statsOf } from '@civ-clone/civ2-spaceship/lib/ship';
import worldPollution from '../../lib/pollution';

export type ScoreGame = Pick<
  Game,
  | 'cities'
  | 'cityGrowth'
  | 'clients'
  | 'gameResult'
  | 'pendingEffects'
  | 'playerGovernments'
  | 'playerResearch'
  | 'spaceships'
  | 'specialists'
  | 'tileImprovements'
  | 'turn'
  | 'wonders'
  | 'worldPeace'
>;

export interface ScoreOptions {
  /** The barbarian setting, 0 to 3 (civ2-barbarians' `activityLevel`). */
  activity: () => number;
}

const term = (name: string, value: number): IScoreTerm => ({
  term: name,
  value,
});

/** Civilization II's score terms (OpenCiv2 `src/auto/civ.cpp` `civ_calc_score` ~4102, richardpenman/civ2@49f26ec). */
export const getRules = (
  game: ScoreGame,
  { activity }: ScoreOptions
): Score[] => [
  // Each city's size, plus its happy citizens, less its unhappy ones, as they are now: no luxury rate is set for it.
  new Score(
    RuleIds.citizens,
    new Effect(
      (player: Player): IScoreTerm =>
        term(
          'citizens',
          game.cities
            .getByPlayer(player)
            .reduce((total: number, city: City): number => {
              const [unhappy, , happy] = citizenSummary(
                stagedHappiness(city, city.yields(), {
                  cityGrowthRegistry: game.cityGrowth,
                  playerGovernmentRegistry: game.playerGovernments,
                  specialistRegistry: game.specialists,
                }).states
              );

              return (
                total +
                citizensScore(
                  game.cityGrowth.getByCity(city).size(),
                  happy,
                  unhappy
                )
              );
            }, 0)
        )
    )
  ),
  // 20 for each Wonder standing in the player's cities, obsolete or not; one lost with its city counts for nobody.
  new Score(
    RuleIds.wonders,
    new Effect(
      (player: Player): IScoreTerm =>
        term(
          'wonders',
          wondersScore(
            game.wonders
              .getByPlayer(player)
              .filter((wonder: Wonder): boolean => !wonder.city().destroyed())
              .length
          )
        )
    )
  ),
  // The ship that arrived first and won (`SHIP_WON`): its colonists × its chance of success.
  new Score(
    RuleIds.spaceship,
    new Effect((player: Player): IScoreTerm => {
      const result = game.gameResult.get(),
        [landed] =
          result !== null &&
          result.reason() === 'spaceship' &&
          result.winner() === player
            ? game.spaceships
                .getBy('player', player)
                .filter(
                  (spaceship: Spaceship): boolean =>
                    spaceship.successful() === true
                )
            : [];

      if (!landed) {
        return term('spaceship', 0);
      }

      const { population, success } = statsOf(landed, {
        clientRegistry: game.clients,
        pendingEffectRegistry: game.pendingEffects,
        playerResearchRegistry: game.playerResearch,
        spaceshipRegistry: game.spaceships,
      });

      return term('spaceship', spaceshipScore(population, success));
    })
  ),
  // The world's pollution, the same for every civilization (Classic): the polluted squares, less those counted in
  //  computer players' city radii.
  new Score(
    RuleIds.pollution,
    new Effect((): IScoreTerm => {
      const { polluted, discounted } = worldPollution(
        game.tileImprovements.filter(
          (improvement) => improvement instanceof Pollution
        ),
        game.cities
          .entries()
          .filter(
            (city: City): boolean => !isHuman(city.player(), game.clients)
          )
      );

      return term('pollution', pollutionScore(polluted, discounted));
    })
  ),
  new Score(
    RuleIds.peace,
    new Effect(
      (): IScoreTerm =>
        term('peace', peaceScore(game.turn.value(), game.worldPeace.turns()))
    )
  ),
  new Score(
    RuleIds.futureTechnology,
    new Effect((player: Player): IScoreTerm => {
      let futureTechnologies = 0;

      try {
        futureTechnologies = game.playerResearch
          .getByPlayer(player)
          .complete()
          .filter((advance) => advance instanceof FutureTechnology).length;
      } catch (e) {
        // A player with no research yet knows no Future Technology.
      }

      return term(
        'future-technology',
        futureTechnologyScore(futureTechnologies)
      );
    })
  ),
  // The barbarian setting: −50 for villages only, up to +25 for raging hordes.
  new Score(
    RuleIds.barbarians,
    new Effect(
      (): IScoreTerm => term('barbarians', barbariansScore(activity()))
    )
  ),
];

export default getRules;
