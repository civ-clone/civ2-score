import {
  barbariansScore,
  citizensScore,
  conquestBonus,
  futureTechnologyScore,
  peaceScore,
  pollutionScore,
  rating,
  ratingFactor,
  spaceshipScore,
  title,
  wondersScore,
} from '../lib/scoring';
import City from '@civ-clone/core-city/City';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import Tile from '@civ-clone/core-world/Tile';
import { expect } from 'chai';
import worldPollution from '../lib/pollution';

// OpenCiv2 `src/auto/civ.cpp` (richardpenman/civ2@49f26ec): `civ_calc_score` ~4102, `civ_rating_window_draw` ~2510.

describe('lib/scoring: the score terms', (): void => {
  it('counts a happy citizen 2, a content one 1 and an unhappy one 0', (): void => {
    expect(citizensScore(8, 3, 2)).equal(9);
    expect(citizensScore(1, 0, 1)).equal(0);
  });

  it('counts 20 a Wonder and 5 a Future Technology', (): void => {
    expect(wondersScore(0)).equal(0);
    expect(wondersScore(3)).equal(60);
    expect(futureTechnologyScore(4)).equal(20);
  });

  it("counts an arrived ship's colonists × its success", (): void => {
    expect(spaceshipScore(4, 100)).equal(400);
    expect(spaceshipScore(1, 56)).equal(56);
    expect(spaceshipScore(0, 100)).equal(0);
    expect(spaceshipScore(4, 0)).equal(0);
  });

  it('takes 10 for each polluted square less those counted in computer players’ cities, which can add', (): void => {
    expect(pollutionScore(0, 0)).equal(0);
    expect(pollutionScore(5, 2)).equal(-30);
    // A square in two computer players' city radii counts −1 net: +10.
    expect(pollutionScore(1, 2)).equal(10);
  });

  it('counts the peace only after turn 199, 3 a turn, at most 100', (): void => {
    expect(peaceScore(199, 50)).equal(0);
    expect(peaceScore(200, 10)).equal(30);
    expect(peaceScore(300, 33)).equal(99);
    expect(peaceScore(300, 34)).equal(100);
  });

  it('scores the barbarian setting 25a − 50', (): void => {
    expect([0, 1, 2, 3].map(barbariansScore)).eql([-50, -25, 0, 25]);
  });
});

describe('lib/scoring: the conquest bonus', (): void => {
  it('is 100 an enemy + 2 × (570 − turn) + 400', (): void => {
    expect(conquestBonus(300, 6)).equal(1540);
    expect(conquestBonus(570, 0)).equal(400);
    expect(conquestBonus(600, 1)).equal(440);
  });

  it('takes a turn before 251 as 250 when eliminated civilizations don’t restart', (): void => {
    expect(conquestBonus(200, 6, 'normal', false)).equal(1640);
    expect(conquestBonus(250, 6, 'normal', false)).equal(1640);
    expect(conquestBonus(251, 6, 'normal', false)).equal(1638);
    expect(conquestBonus(200, 6, 'normal', true)).equal(1740);
  });

  it('is ×5/4 on a large map and ×4/5 on a small one, rounded down', (): void => {
    expect(conquestBonus(300, 6, 'large')).equal(1925);
    expect(conquestBonus(301, 6, 'large')).equal(1922);
    expect(conquestBonus(300, 6, 'small')).equal(1232);
  });
});

describe('lib/scoring: the rating', (): void => {
  it('takes 4, 5, 6, 8, 10 or 13 percent of the score by level', (): void => {
    expect([0, 1, 2, 3, 4, 5].map(ratingFactor)).eql([4, 5, 6, 8, 10, 13]);
    expect(rating(1000, 0)).equal(40);
    expect(rating(1000, 5)).equal(130);
    expect(rating(99, 0)).equal(3);
  });

  it('gives the largest i − 1 with i² / 3 at most the rating, up to 23', (): void => {
    expect([0, 1, 2, 3, 5, 191, 192, 1000].map(title)).eql([
      0, 1, 1, 2, 3, 22, 23, 23,
    ]);
  });
});

describe('lib/pollution: worldPollution', (): void => {
  it("counts each polluted square once, and again for each computer player's city that holds it", (): void => {
    const [a, b, c] = [{}, {}, {}] as Tile[],
      pollution = [a, b, b].map(
        (tile) => ({ tile: () => tile } as unknown as TileImprovement)
      ),
      city = (...tiles: Tile[]) =>
        ({ tiles: () => ({ entries: () => tiles }) } as unknown as City);

    expect(worldPollution(pollution, [])).eql({ polluted: 2, discounted: 0 });
    expect(worldPollution(pollution, [city(a, c), city(a, b)])).eql({
      polluted: 2,
      discounted: 3,
    });
  });
});
