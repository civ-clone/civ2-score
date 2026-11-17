"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const scoring_1 = require("../../lib/scoring");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const FutureTechnology_1 = require("@civ-clone/base-science-advance-future-technology/FutureTechnology");
const Pollution_1 = require("@civ-clone/base-tile-improvement-pollution/Pollution");
const RuleIds_1 = require("../../RuleIds");
const Score_1 = require("@civ-clone/core-score/Rules/Score");
const calculateCitizenState_1 = require("@civ-clone/base-city-happiness/lib/calculateCitizenState");
const isHuman_1 = require("@civ-clone/base-difficulty/lib/isHuman");
const stagedHappiness_1 = require("@civ-clone/civ2-city-happiness/lib/stagedHappiness");
const ship_1 = require("@civ-clone/civ2-spaceship/lib/ship");
const pollution_1 = require("../../lib/pollution");
const term = (name, value) => ({
    term: name,
    value,
});
/** Civilization II's score terms (OpenCiv2 `src/auto/civ.cpp` `civ_calc_score` ~4102, richardpenman/civ2@49f26ec). */
const getRules = (game, { activity }) => [
    // Each city's size, plus its happy citizens, less its unhappy ones, as they are now: no luxury rate is set for it.
    new Score_1.default(RuleIds_1.default.citizens, new Effect_1.default((player) => term('citizens', game.cities
        .getByPlayer(player)
        .reduce((total, city) => {
        const [unhappy, , happy] = (0, calculateCitizenState_1.citizenSummary)((0, stagedHappiness_1.default)(city, city.yields(), {
            cityGrowthRegistry: game.cityGrowth,
            playerGovernmentRegistry: game.playerGovernments,
            specialistRegistry: game.specialists,
        }).states);
        return (total +
            (0, scoring_1.citizensScore)(game.cityGrowth.getByCity(city).size(), happy, unhappy));
    }, 0)))),
    // 20 for each Wonder standing in the player's cities, obsolete or not; one lost with its city counts for nobody.
    new Score_1.default(RuleIds_1.default.wonders, new Effect_1.default((player) => term('wonders', (0, scoring_1.wondersScore)(game.wonders
        .getByPlayer(player)
        .filter((wonder) => !wonder.city().destroyed())
        .length)))),
    // The ship that arrived first and won (`SHIP_WON`): its colonists × its chance of success.
    new Score_1.default(RuleIds_1.default.spaceship, new Effect_1.default((player) => {
        const result = game.gameResult.get(), [landed] = result !== null &&
            result.reason() === 'spaceship' &&
            result.winner() === player
            ? game.spaceships
                .getBy('player', player)
                .filter((spaceship) => spaceship.successful() === true)
            : [];
        if (!landed) {
            return term('spaceship', 0);
        }
        const { population, success } = (0, ship_1.statsOf)(landed, {
            clientRegistry: game.clients,
            pendingEffectRegistry: game.pendingEffects,
            playerResearchRegistry: game.playerResearch,
            spaceshipRegistry: game.spaceships,
        });
        return term('spaceship', (0, scoring_1.spaceshipScore)(population, success));
    })),
    // The world's pollution, the same for every civilization (Classic): the polluted squares, less those counted in
    //  computer players' city radii.
    new Score_1.default(RuleIds_1.default.pollution, new Effect_1.default(() => {
        const { polluted, discounted } = (0, pollution_1.default)(game.tileImprovements.filter((improvement) => improvement instanceof Pollution_1.default), game.cities
            .entries()
            .filter((city) => !(0, isHuman_1.default)(city.player(), game.clients)));
        return term('pollution', (0, scoring_1.pollutionScore)(polluted, discounted));
    })),
    new Score_1.default(RuleIds_1.default.peace, new Effect_1.default(() => term('peace', (0, scoring_1.peaceScore)(game.turn.value(), game.worldPeace.turns())))),
    new Score_1.default(RuleIds_1.default.futureTechnology, new Effect_1.default((player) => {
        let futureTechnologies = 0;
        try {
            futureTechnologies = game.playerResearch
                .getByPlayer(player)
                .complete()
                .filter((advance) => advance instanceof FutureTechnology_1.default).length;
        }
        catch (e) {
            // A player with no research yet knows no Future Technology.
        }
        return term('future-technology', (0, scoring_1.futureTechnologyScore)(futureTechnologies));
    })),
    // The barbarian setting: −50 for villages only, up to +25 for raging hordes.
    new Score_1.default(RuleIds_1.default.barbarians, new Effect_1.default(() => term('barbarians', (0, scoring_1.barbariansScore)(activity())))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=score.js.map