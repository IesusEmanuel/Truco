# EXXO Space Truco

A browser version of **Truco** (Brazilian card game, 4 players in 2 teams) with a space theme. You play with your partner against two computer-controlled opponents.

It is a **static site**: plain HTML, CSS and JavaScript. No framework, no build step, no backend, no dependencies to install.

> The interface text is in Brazilian Portuguese (pt-BR). This README is in English.

---

## Table of contents

1. [Features](#features)
2. [Quick start](#quick-start)
3. [Deploying to Vercel](#deploying-to-vercel)
4. [Project structure](#project-structure)
5. [How to play](#how-to-play)
6. [Rules implemented](#rules-implemented)
7. [Customization](#customization)
8. [How the code is organized](#how-the-code-is-organized)
9. [The computer players](#the-computer-players)
10. [Hand record](#hand-record)
11. [Known limitations and roadmap](#known-limitations-and-roadmap)
12. [Troubleshooting](#troubleshooting)

---

## Features

- Full Truco match: rounds, hand resolution, raises (Truco, Seis, Dez, Doze), **mão de dez**, **mão de ferro**, scoring up to 12.
- Space theme: starry background (with a subtle twinkling layer), orange and cream palette, mono labels, orbit ring where cards land.
- Your hand is large and fanned at the bottom of the arena; the partner and opponents hold floating, fanned hands of card backs.
- Played cards fly from the hand to the table and **stay there** until the hand ends (one per round, stacked).
- Animated center text for key moments: `TRUCO!`, `SEIS!`, `DEZ!`, `DOZE!`, `MÃO DE FERRO`, `VITÓRIA!`, `DERROTA`.
- Fill-style hover on every button.
- A written record of every hand: cards dealt, cards played, raises and answers, points, reason for the result.
- Card images are fully replaceable: use your own artwork for the 40 cards and the card back.
- Responsive layout (desktop, tablet, phone).
- Respects `prefers-reduced-motion` (no floating or twinkling).

---

## Quick start

No installation needed.

**Option A: open the file.** Double-click `index.html`. The game runs entirely in the browser.

**Option B: local server** (recommended if you edit the code, since some browsers treat `file://` pages differently):

```bash
# from the project folder
npx serve .
# or
python3 -m http.server 8000
```

Then open the address it prints (for example `http://localhost:8000`).

Keep the `img/` and `fonts/` folders next to the three main files, otherwise the background, logo and fonts will not load.

---

## Deploying to Vercel

The project is a static site, so Vercel needs no special configuration.

**With the dashboard:** create a new project (from a Git repository, or drag the folder in) and use these settings:

| Setting | Value |
|---|---|
| Framework preset | Other |
| Build command | *(leave empty)* |
| Output directory | *(leave empty / project root)* |

**With the CLI:**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

Everything is served as static files. Make sure `img/` and `fonts/` are included in the upload, along with any folder where you keep your custom card images.

---

## Project structure

```
.
├── index.html          Page structure (every component has an id and class)
├── styles.css          All styling: theme, layout, animations, responsive rules
├── script.js           Game rules, computer players, rendering, animations
├── img/
│   ├── space-bg.jpg    Starry background
│   └── logo-exxo.png   EXXO Space Truco logo (also used as favicon)
├── fonts/              Space Mono (400, 700) and Outfit (300, 500), served locally
└── README.md
```

Your own card images are not included. Put them anywhere you like (for example `img/cartas/`) and point to them in `CONFIG` (see [Using your own cards](#using-your-own-cards)).

---

## How to play

### The table

| Seat | Who | Team |
|---|---|---|
| Bottom | **You** | Nós (us) |
| Top | Partner (computer) | Nós (us) |
| Left | Opponent 1 (computer) | Eles (them) |
| Right | Opponent 2 (computer) | Eles (them) |

Play goes around the table. The player after the dealer leads the first round, and the dealer rotates every hand.

### Controls

- **Play a card:** click one of the cards in your hand when the bar below the arena says `SUA VEZ` (the orange marker lights up). Cards rise and straighten when you hover over them.
- **Ask for a raise:** press the big orange button (`PEDIR TRUCO`, then `PEDIR SEIS`, and so on). It is only enabled on your turn, before you play your card, and only if your team was not the last to raise.
- **Answer a raise:** when the opponents raise, a panel appears with **Aceitar** (accept), **Aumentar** (raise again, when available) and **Correr** (fold).
- **Mão de dez:** when your team has 10 points, you see your partner's cards and choose **Jogar** (play, hand is worth 4) or **Correr** (fold, they score 2).
- **Next hand / new match:** after each hand a panel offers `PRÓXIMA MÃO`; after the match it offers `NOVA PARTIDA`. The `NOVA PARTIDA` button in the side column restarts at any time.

### Screen guide

| Area | What it shows |
|---|---|
| Info strip | Hand type, current value, and the three round results (orange = your team, dark = opponents, `Emp.` = tie) |
| Arena, top-left corner | Hand number and the manilha order |
| Message bar | Whose turn it is, and prompts |
| Right column | Registro das mãos (hand record), Eventos da mão (event log), Placar (scoreboard), Regras assumidas (assumed rules) |

---

## Rules implemented

### Teams, deck and card order

- 4 players, 2 teams of 2. Each player receives 3 cards.
- 40-card deck: the 8s, 9s and 10s are removed.
- Order of ordinary cards, from weakest to strongest:

  `4 < 5 < 6 < 7 < Q < J < K < A < 2 < 3`

- **The suit never breaks a tie between ordinary cards.** Two cards of the same rank tie.

### Manilhas

Four fixed manilhas beat every ordinary card. From strongest to weakest:

| Position | Card |
|---|---|
| 1 (strongest) | 4 of clubs (♣) |
| 2 | 7 of hearts (♥) |
| 3 | Ace of spades (♠) |
| 4 | 7 of diamonds (♦) |

There is also an alternative mode (`MANILHA_MODE: 'vira'`) where a card is turned up and the manilha is the next rank; suits then rank diamonds < spades < hearts < clubs. See [Settings](#settings-reference).

### Rounds and who wins the hand

A hand is played over up to three rounds. In each round the strongest card wins; if the strongest cards belong to opposite teams, the round is tied. The winner of a round leads the next one. After a tie, the player who played first among the strongest cards leads.

The hand ends as soon as one of these rules decides it:

| Situation | Result |
|---|---|
| Same team wins rounds 1 and 2 | That team wins |
| A team wins round 1 and round 2 is tied | The round-1 winner wins |
| Round 1 is tied | The winner of round 2 wins |
| Rounds 1 and 2 are tied | The winner of round 3 wins |
| One team wins round 1, the other wins round 2, round 3 is tied | The round-1 winner wins |
| One team wins round 1, the other wins round 2 | The winner of round 3 wins |
| All three rounds are tied | Nobody wins, nobody scores |

### Raises

A normal hand starts worth **2** points. Raises must follow this order, with no skipping:

| State | Value |
|---|---|
| No raise | 2 |
| Truco | 4 |
| Seis | 6 |
| Dez | 10 |
| Doze | 12 |

- A raise can only be requested on your turn, before playing your card for that round.
- While a raise is waiting for an answer, nobody plays a card.
- The other team can **accept**, **fold**, or **raise again** to the next level.
- **Accept:** the proposed value becomes the hand's value and play continues.
- **Fold:** the hand ends immediately and the team that asked scores the value accepted **before** that request (for example, if the hand is worth 4 and a team asks for 6, folding gives them 4 points).
- After a raise is accepted, the team that just accepted is the one allowed to raise next. The team that made the last raise cannot raise again before the other team has had the chance.
- Doze (12) is the last request: the other team can only accept or fold.

### Mão de dez (ten hand)

Happens when **exactly one team** has 10 points at the start of a hand.

1. Cards are dealt normally.
2. The partners on the 10-point team may look at each other's cards.
3. That team chooses to play or fold.
4. **Fold:** the other team scores 2 and the hand ends.
5. **Play:** the hand is worth 4. No raises are allowed.
6. The winner scores 4. If all three rounds tie, nobody scores.

### Mão de ferro (iron hand)

Happens when **both teams** have exactly 10 points.

- Nobody may look at their own cards (yours are shown face down; you play by position) or at a partner's.
- No raises.
- Played until a team wins by the normal hand-resolution rules, and **that team wins the match**.
- If all three rounds tie, nobody wins and a new iron hand is dealt.

### Scoring and end of the match

- A team that wins a normal hand scores the accepted value of the hand.
- A team that wins a mão de dez scores 4; folding a mão de dez gives the opponents 2.
- A score may exceed 12.
- After every score update, a team with **12 points or more wins the match immediately**.
- A tied hand with no points does not change the score.

### Assumptions

The rules document used for this project started at the round-resolution section. These points were not specified, so the following were assumed:

- 40-card deck and the card order above.
- Fixed manilhas in the order above (default mode).
- After a tied round, the lead goes to whoever played first among the strongest cards.
- The first leader of a match is the player after the first dealer; the dealer then rotates clockwise.

If your house rules differ, these are the places to change them (see [Code organization](#how-the-code-is-organized)).

---

## Customization

### Using your own cards

Open `script.js` and find the `CONFIG` object at the top.

**Card faces.** `CUSTOM_CARD_IMAGES` has one line per card, grouped by suit. Paste the path of your image between the quotes:

```js
CUSTOM_CARD_IMAGES: {
  'AS': 'img/cartas/AS.png',   // Ace of spades (manilha)
  '7H': 'img/cartas/7H.png',   // 7 of hearts (manilha)
  '4C': 'img/cartas/4C.png',   // 4 of clubs (strongest manilha)
  // ...
}
```

A card whose line is left empty (`''`) keeps using the built-in EXXO-style card, so you can replace cards one at a time without breaking the game.

**Key format:** `<rank><suit>`

| Part | Values |
|---|---|
| Rank | `A 2 3 4 5 6 7 Q J K` |
| Suit | `D` diamonds (Ouros), `S` spades (Espadas), `H` hearts (Copas), `C` clubs (Paus) |

Example: `'QH'` is the Queen of hearts, `'3S'` is the 3 of spades. There are 40 keys in total.

**Card back.** Set `CARD_BACK_URL` to your image (for example `'img/cartas/verso.png'`). Left empty, the built-in planet-and-ring back is used.

**Tips for card images**

- Any proportion works. Each card box adapts to the real proportion of its image once it loads, so there are no empty edges.
- PNG with transparent rounded corners works well (no background is painted behind the card).
- Use the same size for all cards so the hand looks uniform.
- Name the files like the keys (`AS.png`, `7H.png`, ...) to make filling the list easy.

**Generic online cards.** To use the free generic images from `deckofcardsapi.com` instead of the built-in cards, set `USE_GENERIC_CARD_URLS: true`.

### Settings reference

All in the `CONFIG` object at the top of `script.js`.

| Setting | Default | Meaning |
|---|---|---|
| `MANILHA_MODE` | `'fixa'` | `'fixa'` = four fixed manilhas. `'vira'` = a card is turned up and the manilha is the next rank (the "vira" card is then shown in the arena) |
| `WIN_SCORE` | `12` | Points needed to win the match |
| `VALUES` | `[2, 4, 6, 10, 12]` | Hand values, in raise order |
| `RAISE_NAMES` | Truco, Seis, Dez, Doze | Names used in buttons, log and center text |
| `BOT_DELAY` | `900` | Milliseconds the computer players "think" before acting |
| `ROUND_END_DELAY` | `1500` | Pause after a round before the next one starts |
| `USE_GENERIC_CARD_URLS` | `false` | Use online generic cards when no custom image is set |
| `CARD_IMAGE_BASE` | deckofcardsapi URL | Base address for the generic cards |
| `CARD_BACK_URL` | `''` | Your card back image |
| `CUSTOM_CARD_IMAGES` | all empty | Your 40 card faces |

### Colors, sizes and look

In `styles.css`, the `:root` block holds the design tokens:

| Variable | Used for |
|---|---|
| `--orange` / `--orange-hi` | EXXO orange (buttons, frame, accents) |
| `--cream` / `--cream-dim` | Cream (cards, buttons, text) |
| `--ink` | Dark blue (text on orange, panels) |
| `--panel` | Translucent panel background |
| `--card-w` | Width of your cards |
| `--card-w-small` | Width of the partner's and opponents' cards |
| `--card-w-played` | Width of cards on the table |
| `--card-ratio` | Temporary card proportion while an image loads |

### Background, logo and fonts

- **Background:** replace `img/space-bg.jpg` (keep the name, or change the `url()` in the `body` rule).
- **Logo:** replace `img/logo-exxo.png` (keep the same height or adjust `.logo`).
- **Fonts:** Space Mono and Outfit are served from `fonts/`; the `@font-face` rules are at the top of `styles.css`.
- **Starfield:** `initStarfield()` in `script.js` controls the twinkling stars (count, size, colors).

---

## How the code is organized

### `index.html`

A single page. Every component has both an `id` and a `class`. Main blocks:

| id | What it is |
|---|---|
| `#starfield` | Canvas with the twinkling stars |
| `#game-header`, `#logo` | Logo |
| `#hand-info`, `#hand-type`, `#hand-value`, `#round-tracker` | Info strip |
| `#table` | The arena (frame) |
| `#player-0` ... `#player-3` | The four seats; each has `#hand-N` (cards in hand) and `#name-N` (label) |
| `#played-0` ... `#played-3` | Slots for the cards each player put on the table |
| `#announce` | Center text animations |
| `#message-bar`, `#message` | Turn bar |
| `#raise-panel`, `#response-panel`, `#ten-panel`, `#end-panel` | Controls (shown as needed) |
| `#btn-raise`, `#btn-accept`, `#btn-counter`, `#btn-run`, `#btn-ten-play`, `#btn-ten-run`, `#btn-next-hand`, `#btn-new-game` | Buttons |
| `#history-list`, `#event-log` | Hand record and event log |
| `#scoreboard`, `#score-us`, `#score-them` | Scoreboard |

Seat numbers: `0` = you, `1` = opponent 1 (left), `2` = partner (top), `3` = opponent 2 (right). Team 0 is seats 0 and 2; team 1 is seats 1 and 3.

### `styles.css`

Organized in labeled sections: fonts, variables, base, logo, info strip, arena, hands, cards, played cards, announcements, controls and buttons, side column, responsive rules. Layout uses CSS grid for the page and absolute positioning for the seats inside the arena.

### `script.js`

Sections, top to bottom:

1. **`CONFIG`**: all settings and card image paths.
2. **Constants**: suits, rank order, manilhas, labels.
3. **`state`**: the single source of truth (scores, current hand, history).
4. **Cards**: deck creation, image URLs, built-in SVG cards, card elements.
5. **Rule engine**: `strength()` (card power), `evaluateRound()` (who wins a round), `resolveHand()` (the hand-resolution table above, kept as a pure function), `endHand()` (scoring and match end).
6. **Flow**: `startGame()`, `startHand()`, `startTurn()`, `playCard()`.
7. **Raises**: `requestRaise()`, `respond()`, `nextValue()`; mão de dez in `resolveTen()`.
8. **Computer players**: `botTurn()`, `botPlayCard()`, `botRespond()`, `botTenDecision()`.
9. **Rendering**: `render()` and helpers; hands are rebuilt only when their cards change.
10. **Animations**: `animatePlay()` (card flight), `showAnnounce()` (center text), `initStarfield()`.
11. **Event wiring**: buttons and card clicks.

The rules are kept separate from the drawing code. This matters if you later add multiplayer: the functions that decide results (`strength`, `evaluateRound`, `resolveHand`, `endHand`, the raise logic) are the part that would move to a server.

---

## The computer players

Opponents and partner use simple, readable heuristics, not a search algorithm:

- **Playing cards:** when leading, they open the first round with their middle-strength card and later rounds with their strongest. When following, they try to win with the weakest card that still beats the table, and play their weakest card when they cannot win or their team is already winning the round.
- **Raising:** they sometimes ask for a raise, more often with a strong hand or after winning a round.
- **Answering raises:** they estimate the strength of their combined hand, add a bonus for rounds already won and some randomness, then accept, fold or raise.
- **Mão de dez:** they decide to play or fold by the strength of the best cards of the pair.

The computer players never read hidden information from you; they only use their own hand, the table and the score. To make them stronger or weaker, edit `botWantsToRaise()`, `botRespond()`, `botPlayCard()` and `botTenDecision()`.

---

## Hand record

After every hand, the **Registro das mãos** panel adds an entry (newest first, click to expand) with:

- hand number and type
- cards dealt and who received each
- cards played in each round, and who won each round (or tie)
- initial value of the hand
- every raise and its answer
- final accepted value
- winning team (or tie)
- points added to the score
- updated score
- match winner, if any
- the reason for the result

The result is decided only by the cards played, the order of rounds, the accepted or refused raises, the score and the rules above. Bluffing, intentions or signals between players do not influence it.

---

## Known limitations and roadmap

- **Single player only.** You play with a computer partner against two computer opponents. Multiplayer is planned (see below).
- **No saved games.** Refreshing the page starts a new match.
- **Mouse and touch input.** Cards are clickable images; there is no keyboard control for playing cards yet.
- **Simple opponents.** They are intentionally easy to read and modify.
- **No sound.**

### Multiplayer (planned)

Vercel serves the static site well, but its functions do not keep long-lived connections, which real-time play needs. Two approaches were considered:

1. **Small Node server with rooms and WebSockets** (recommended). The site stays on Vercel and the server runs on a service such as Render, Railway or Fly. The server shuffles, deals and validates plays, so each player only receives their own cards.
2. **Peer-to-peer (WebRTC/PeerJS), no server.** Simpler, but the host's browser sees every card, so it only suits friends who trust each other.

Either way: one player creates a room and shares a link, up to four people take seats, and empty seats are filled by the existing computer players.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Fonts, logo or background do not appear | Keep `img/` and `fonts/` next to `index.html`. If you open the file directly and a browser blocks something, use a local server (`npx serve .`) |
| A card shows the built-in card instead of mine | The path in `CUSTOM_CARD_IMAGES` is wrong, or the file name differs (paths are case-sensitive on Vercel). Check the browser console for a 404 |
| White or colored edges around cards | Make sure you are on the latest `styles.css` and `script.js` (no background is painted behind cards and each card adapts to its image proportion) |
| Cards look stretched | Use the same proportion for all card images; each card follows its own image's proportion |
| Cards don't animate or float | The system setting "reduce motion" is on; the game honors it |
| Changes don't show after deploying | Hard refresh (Ctrl/Cmd + Shift + R) to bypass the cache |

---

## Credits

- Design: EXXO Space Truco layout and logo.
- Fonts: [Space Mono](https://fonts.google.com/specimen/Space+Mono) and [Outfit](https://fonts.google.com/specimen/Outfit), both under the SIL Open Font License, served from `fonts/`.
