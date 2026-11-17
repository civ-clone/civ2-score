# civ2-score

Civilization II's score, as `core-score` rules, with its conquest bonus and rating for a renderer, following OpenCiv2's
reconstruction of the original (`src/auto/civ.cpp` `civ_calc_score` and `civ_rating_window_draw`,
richardpenman/civ2@49f26ec): the Classic behaviour, numbers only.

## Terms (`Rules/Player/score`, the numbers in `lib/scoring`)

- **citizens:** each city's size, plus its happy citizens, less its unhappy ones (the angry among them), as they are
  now (civ2-city-happiness's stages). So 2 a happy citizen, 1 a content one or a specialist, 0 an unhappy one.
- **wonders:** 20 for each Wonder standing in the player's cities, obsolete or not.
- **spaceship:** the ship that arrived first and won: its colonists (habitation counted, in tens of thousands) × its
  chance of success in % (civ2-spaceship's `statsOf`), so 400 for four habitation modules at 100%.
- **pollution** (`RuleIds.pollution`): −10 × (polluted squares − those counted again for each computer player's city
  whose radius holds them), the same for every civilization: Classic counts the whole map. `lib/scoring`'s
  `pollutionScore(polluted, discounted)` and `lib/pollution`'s `worldPollution(pollution, computerCities)` are there
  for civ2-enhanced to pass a civilization's own instead.
- **peace:** after turn 199, 3 for each turn of the world's peace, at most 100.
- **future-technology:** 5 for each Future Technology.
- **barbarians:** the barbarian setting `a` (civ2-barbarians' `activityLevel`): 25a − 50, so −50 to +25.

The score adds them up, never below 0 (core-score).

## The world's peace

A turn of it at the start of each turn from turn 200 (`civ2-score:turn/start/world-peace`), ended by any fight between
two civilizations, barbarians aside (`civ2-score:unit/defeated/world-peace`). It's core-score's `WorldPeace`, saved.

## Conquest and rating (`lib/rating`, for a renderer)

- `conquestBonusFor(player, gameResults, playerWorlds, ruleRegistry?)`: the last civilization standing scores 100 for
  each opponent + 2 × (570 − the turn) + 400; ×5/4 on a large map and ×4/5 on a small one (civ2-rules' `mapSize`).
  With civ2-game-end's respawn rule switched off (no restart of eliminated civilizations), a turn before 251 counts as
  250. `null` for anyone else. The final score is the better of the two.
- `rating(score, level)`: the score × 4, 5, 6, 8, 10 or 13 by level (Chieftain to Deity), / 100: difficulty affects only
  the rating.
- `title(rating)`: the title it earns, 0 to 23 (`TITLES`): the largest i − 1 with i² / 3 at most the rating. The names
  are the renderer's own.

## Not as the original

- The opponents counted for the conquest bonus are every civilization that has been in the game (base-game-end), so a
  civilization that came back counts again; the original counts the civilizations the game started with.
- The pollution counted in computer players' city radii is read as the score is (every square of the 21), where the
  original counts it during their city processing and resets it each turn.
