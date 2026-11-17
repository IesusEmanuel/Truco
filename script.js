'use strict';

/* =====================================================================
   TRUCO - script.js
   Jogador 0 = Você (sul) | 1 = Adversário 1 (oeste)
   Jogador 2 = Parceiro (norte) | 3 = Adversário 2 (leste)
   Dupla 0 ("Nós") = jogadores 0 e 2 | Dupla 1 ("Eles") = jogadores 1 e 3
   ===================================================================== */

/* ===================== CONFIGURAÇÃO ===================== */
const CONFIG = {
  // 'fixa' = manilhas fixas, da mais fraca à mais forte: 7♦, A♠, 7♥, 4♣ (padrão)
  // 'vira' = manilha é a carta seguinte à vira
  MANILHA_MODE: 'fixa',
  WIN_SCORE: 12,
  VALUES: [2, 4, 6, 10, 12],
  RAISE_NAMES: { 4: 'Truco', 6: 'Seis', 10: 'Dez', 12: 'Doze' },
  BOT_DELAY: 900,
  ROUND_END_DELAY: 1500,

  // ===== IMAGENS DAS CARTAS =====
  // 1) Verso: troque CARD_BACK_URL pelo caminho da sua imagem (ex.: 'img/cartas/verso.png').
  // 2) Frente: em CUSTOM_CARD_IMAGES, cole o caminho de cada carta entre as aspas.
  //    Campo vazio ('') = usa a carta genérica de CARD_IMAGE_BASE.
  // Chave = <valor><naipe> | Valores: A 2 3 4 5 6 7 Q J K | Naipes: D=Ouros S=Espadas H=Copas C=Paus
  // Cartas genéricas: por padrão usa as cartas temáticas EXXO desenhadas em SVG (sem internet).
  // Para voltar às imagens genéricas online, troque para true.
  USE_GENERIC_CARD_URLS: false,
  CARD_IMAGE_BASE: 'https://deckofcardsapi.com/static/img/',
  CARD_BACK_URL: 'img/back.png',   // verso das cartas. Vazio = verso EXXO desenhado em SVG. Ex.: 'img/cartas/verso.png'
  CUSTOM_CARD_IMAGES: {
    // ---- Ouros (D) ----
    /* 'AD': 'img/1 diamonds.png', // Ás de Ouros
    '2D': 'img/2 diamonds.png', // 2 de Ouros
    '3D': 'img/3 diamonds.png', // 3 de Ouros
    '4D': 'img/4 diamonds.png', // 4 de Ouros
    '5D': 'img/5 diamonds.png', // 5 de Ouros
    '6D': 'img/6 diamonds.png', // 6 de Ouros
    '7D': 'img/7 diamonds.png', // 7 de Ouros (manilha)
    'QD': 'img/queen diamonds.png', // Dama de Ouros
    'JD': 'img/jack diamonds.png', // Valete de Ouros
    'KD': 'img/king diamonds.png', // Rei de Ouros

    // ---- Espadas (S) ----
    'AS': 'img/1 spades.png', // Ás de Espadas (manilha)
    '2S': 'img/2 spades.png', // 2 de Espadas
    '3S': 'img/3 spades.png', // 3 de Espadas
    '4S': 'img/4 spades.png', // 4 de Espadas
    '5S': 'img/5 spades.png', // 5 de Espadas
    '6S': 'img/6 spades.png', // 6 de Espadas
    '7S': 'img/7 spades.png', // 7 de Espadas
    'QS': 'img/queen spades.png', // Dama de Espadas
    'JS': 'img/jack spades.png', // Valete de Espadas
    'KS': 'img/king spades.png', // Rei de Espadas

    // ---- Copas (H) ----
    'AH': 'img/1 hearts.png', // Ás de Copas
    '2H': 'img/2 hearts.png', // 2 de Copas
    '3H': 'img/3 hearts.png', // 3 de Copas
    '4H': 'img/4 hearts.png', // 4 de Copas
    '5H': 'img/5 hearts.png', // 5 de Copas
    '6H': 'img/6 hearts.png', // 6 de Copas
    '7H': 'img/7 hearts.png', // 7 de Copas (manilha)
    'QH': 'img/queen hearts.png', // Dama de Copas
    'JH': 'img/jack hearts.png', // Valete de Copas
    'KH': 'img/king hearts.png', // Rei de Copas

    // ---- Paus (C) ----
    'AC': 'img/1 cubs.png', // Ás de Paus
    '2C': 'img/2 cubs.png', // 2 de Paus
    '3C': 'img/3 cubs.png', // 3 de Paus
    '4C': 'img/4 cubs.png', // 4 de Paus (manilha, a mais forte)
    '5C': 'img/5 cubs.png', // 5 de Paus
    '6C': 'img/6 cubs.png', // 6 de Paus
    '7C': 'img/7 cubs.png', // 7 de Paus
    'QC': 'img/queen cubs.png', // Dama de Paus
    'JC': 'img/jack cubs.png', // Valete de Paus
    'KC': 'img/king cubs.png', // Rei de Paus */
  },
};

const SUITS = [
  { id: 'D', name: 'Ouros', symbol: '♦' },
  { id: 'S', name: 'Espadas', symbol: '♠' },
  { id: 'H', name: 'Copas', symbol: '♥' },
  { id: 'C', name: 'Paus', symbol: '♣' },
];
const SUIT_ORDER = SUITS.map((s) => s.id); // do mais fraco ao mais forte
const BASE_ORDER = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const RANK_NAMES = { A: 'Ás', Q: 'Dama', J: 'Valete', K: 'Rei' };
const FIXED_MANILHAS = { '4C': 23, '7H': 22, 'AS': 21, '7D': 20 };
const PLAYER_NAMES = ['Você', 'Adversário 1', 'Parceiro', 'Adversário 2'];
const TEAM_NAMES = ['Nós', 'Eles'];
const HAND_TYPE_LABELS = { normal: 'Mão comum', ten: 'Mão de dez', iron: 'Mão de ferro' };

/* ===================== ESTADO ===================== */
const state = {
  scores: [0, 0],
  handNumber: 0,
  dealer: 2,
  hand: null,
  gameWinner: null,
  history: [],
  gen: 0, // invalida timers antigos
  announceTimer: null,
};

/* ===================== UTILITÁRIOS ===================== */
const $ = (id) => document.getElementById(id);
const teamOf = (p) => p % 2;
const playerName = (p) => PLAYER_NAMES[p];
const winnerPhrase = (t) => (t === 0 ? 'Sua dupla' : 'A dupla adversária');
const currentRound = () => state.hand.rounds[state.hand.rounds.length - 1];
const nextValue = (v) => {
  const i = CONFIG.VALUES.indexOf(v);
  return i >= 0 && i < CONFIG.VALUES.length - 1 ? CONFIG.VALUES[i + 1] : null;
};

function later(fn, ms) {
  const gen = state.gen;
  setTimeout(() => {
    if (state.gen === gen) fn();
  }, ms);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ===================== CARTAS ===================== */
function makeDeck() {
  const deck = [];
  SUITS.forEach((s) => BASE_ORDER.forEach((r) => deck.push({ rank: r, suit: s.id, key: r + s.id })));
  return deck;
}

function suitInfo(id) { return SUITS.find((s) => s.id === id); }

function cardLabel(card) {
  return `${RANK_NAMES[card.rank] || card.rank} de ${suitInfo(card.suit).name}`;
}

function cardImageUrl(card) {
  const custom = CONFIG.CUSTOM_CARD_IMAGES[card.key];
  if (custom) return custom;
  return CONFIG.USE_GENERIC_CARD_URLS ? `${CONFIG.CARD_IMAGE_BASE}${card.key}.png` : fallbackCardSvg(card);
}

// Carta temática EXXO (creme, laranja e azul-noite) desenhada em SVG
function fallbackCardSvg(card) {
  const sy = suitInfo(card.suit).symbol;
  const c = card.suit === 'D' || card.suit === 'H' ? '#E8450C' : '#0B1623';
  const corner = `<text x="12" y="27" font-size="20" font-family="Arial,sans-serif" font-weight="700" fill="${c}">${card.rank}</text><text x="12" y="44" font-size="16" font-family="Arial,sans-serif" fill="${c}">${sy}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140" width="100" height="140"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBF5E1"/><stop offset="1" stop-color="#E6DBB8"/></linearGradient></defs><rect width="100" height="140" rx="8" fill="url(#g)"/><rect x="4" y="4" width="92" height="132" rx="5" fill="none" stroke="#CDBF93" stroke-width="1"/><ellipse cx="50" cy="72" rx="36" ry="13" fill="none" stroke="${c}" stroke-opacity="0.22" stroke-width="1.3" transform="rotate(-18 50 72)"/>${corner}<text x="50" y="87" font-size="46" font-family="Arial,sans-serif" text-anchor="middle" fill="${c}">${sy}</text><g transform="rotate(180 50 70)">${corner}</g></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Verso EXXO: planeta com anel e brilho de estrela
function fallbackBackSvg() {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140" width="100" height="140"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBF5E1"/><stop offset="1" stop-color="#E6DBB8"/></linearGradient></defs><rect width="100" height="140" rx="8" fill="url(#g)"/><rect x="5" y="5" width="90" height="130" rx="5" fill="none" stroke="#E8450C" stroke-width="1.5"/><circle cx="50" cy="70" r="15" fill="#0B1623"/><ellipse cx="50" cy="70" rx="31" ry="10" fill="none" stroke="#E8450C" stroke-width="4" transform="rotate(-20 50 70)"/><path d="M50 71 a15 15 0 0 0 15 -6" fill="none"/><path d="M80 24 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#E8450C"/><path d="M22 112 l1.4 4 4 1.4 -4 1.4 -1.4 4 -1.4 -4 -4 -1.4 4 -1.4z" fill="#E8450C"/></svg>';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function createCardElement(card, faceUp) {
  const img = document.createElement('img');
  img.className = 'card';
  img.draggable = false;
  if (faceUp) {
    img.classList.add('card-face');
    img.src = cardImageUrl(card);
    img.alt = cardLabel(card);
    img.title = cardLabel(card);
    img.dataset.card = card.key;
    img.addEventListener('error', () => { img.src = fallbackCardSvg(card); }, { once: true });
  } else {
    img.classList.add('card-back');
    img.src = CONFIG.CARD_BACK_URL || fallbackBackSvg();
    img.alt = 'Carta virada';
    img.addEventListener('error', () => { img.src = fallbackBackSvg(); }, { once: true });
  }
  return img;
}

// Ângulo pequeno e estável (-9 a 9) para cada carta pousada na mesa
function stableAngle(str) {
  let n = 0;
  for (const ch of str) n = (n * 31 + ch.charCodeAt(0)) % 997;
  return (n % 19) - 9;
}

function strength(card) {
  const h = state.hand;
  if (CONFIG.MANILHA_MODE === 'fixa') {
    if (FIXED_MANILHAS[card.key] !== undefined) return FIXED_MANILHAS[card.key];
    return BASE_ORDER.indexOf(card.rank);
  }
  if (card.rank === h.manilhaRank) return 20 + SUIT_ORDER.indexOf(card.suit);
  return BASE_ORDER.indexOf(card.rank);
}

function power(cards) {
  const top = cards.map(strength).sort((a, b) => b - a).slice(0, 2);
  return top.reduce((a, b) => a + b, 0) / 23;
}

/* ===================== REGRA: RESULTADO DA MÃO ===================== */
// results: array com 'T' (empate), 0 ou 1 (dupla vencedora da rodada)
function resolveHand(r) {
  if (r.length < 2) return { decided: false };
  const [a, b, c] = r;
  if (a !== 'T' && b === a) {
    return { decided: true, winner: a, reason: 'A mesma dupla venceu a primeira e a segunda rodadas.' };
  }
  if (a !== 'T' && b === 'T') {
    return { decided: true, winner: a, reason: 'Uma dupla venceu a primeira rodada e a segunda empatou.' };
  }
  if (a === 'T' && b !== 'T') {
    return { decided: true, winner: b, reason: 'A primeira rodada empatou e a segunda foi vencida por esta dupla.' };
  }
  if (r.length < 3) return { decided: false };
  if (a === 'T') {
    if (c === 'T') return { decided: true, winner: null, reason: 'As três rodadas empataram.' };
    return { decided: true, winner: c, reason: 'A primeira e a segunda rodadas empataram; a terceira decidiu.' };
  }
  if (c === 'T') {
    return { decided: true, winner: a, reason: 'Cada dupla venceu uma rodada e a terceira empatou; vale a primeira rodada.' };
  }
  return { decided: true, winner: c, reason: 'Cada dupla venceu uma rodada; a terceira decidiu.' };
}

/* ===================== INÍCIO DE PARTIDA / MÃO ===================== */
function startGame() {
  state.gen++;
  state.scores = [0, 0];
  state.handNumber = 0;
  state.dealer = 2;
  state.hand = null;
  state.gameWinner = null;
  state.history = [];
  $('event-log').innerHTML = '';
  $('history-list').innerHTML = '';
  startHand();
}

function startHand() {
  state.gen++;
  state.handNumber++;
  state.dealer = (state.dealer + 1) % 4;
  $('event-log').innerHTML = '';

  const [s0, s1] = state.scores;
  let type = 'normal';
  let tenTeam = null;
  if (s0 === 10 && s1 === 10) type = 'iron';
  else if (s0 === 10) { type = 'ten'; tenTeam = 0; }
  else if (s1 === 10) { type = 'ten'; tenTeam = 1; }

  const deck = shuffle(makeDeck());
  const hands = [[], [], [], []];
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 4; k++) {
      hands[(state.dealer + 1 + k) % 4].push(deck.pop());
    }
  }
  const vira = CONFIG.MANILHA_MODE === 'vira' ? deck.pop() : null;
  const manilhaRank = vira ? BASE_ORDER[(BASE_ORDER.indexOf(vira.rank) + 1) % BASE_ORDER.length] : null;
  const first = (state.dealer + 1) % 4;

  state.hand = {
    number: state.handNumber,
    type,
    tenTeam,
    hands,
    dealt: hands.map((h) => h.map((c) => ({ ...c }))),
    vira,
    manilhaRank,
    rounds: [{ plays: [], winner: null }],
    results: [],
    turn: first,
    value: type === 'normal' ? 2 : type === 'ten' ? 4 : null,
    initialValue: type === 'normal' ? 2 : type === 'ten' ? 4 : null,
    pending: null,
    lastRaiser: null,
    raises: [],
    phase: 'play',
    revealPartner: false,
    ended: false,
  };

  const h = state.hand;
  logEvent(`Mão ${h.number} (${HAND_TYPE_LABELS[type]}) distribuída por ${playerName(state.dealer)}.`);
  if (vira) logEvent(`Vira: ${cardLabel(vira)}. Manilha: ${RANK_NAMES[manilhaRank] || manilhaRank}.`);

  if (type === 'ten') {
    h.phase = 'decision';
    h.revealPartner = tenTeam === 0;
    render();
    if (tenTeam === 0) {
      setMessage('Mão de dez! Decida com seu parceiro.');
    } else {
      setMessage('Mão de dez da dupla adversária: eles estão decidindo...');
      later(botTenDecision, CONFIG.BOT_DELAY * 1.5);
    }
    return;
  }

  if (type === 'iron') {
    logEvent('Mão de ferro: ninguém olha as próprias cartas e não há pedidos de aumento.');
    showAnnounce('Mão de Ferro');
  }
  render();
  startTurn();
}

/* ===================== MÃO DE DEZ ===================== */
function botTenDecision() {
  const h = state.hand;
  if (!h || h.ended || h.phase !== 'decision') return;
  const cards = [...h.hands[h.tenTeam], ...h.hands[h.tenTeam + 2]];
  const score = power(cards) + Math.random() * 0.4;
  resolveTen(score >= 1.5);
}

function resolveTen(play) {
  const h = state.hand;
  if (!h || h.phase !== 'decision') return;
  const who = h.tenTeam === 0 ? 'Você e seu parceiro' : 'A dupla adversária';
  h.revealPartner = false;
  if (!play) {
    logEvent(`${who} correu na mão de dez.`);
    endHand({
      winner: 1 - h.tenTeam,
      points: 2,
      reason: `${winnerPhrase(h.tenTeam)} correu na mão de dez; a dupla adversária marca 2 pontos.`,
    });
    return;
  }
  logEvent(`${who} decidiu jogar a mão de dez (vale 4 pontos).`);
  h.phase = 'play';
  startTurn();
}

/* ===================== TURNOS ===================== */
function startTurn() {
  const h = state.hand;
  if (!h || h.ended) return;
  h.phase = 'play';
  render();
  if (h.turn === 0) {
    setMessage(h.type === 'iron'
      ? 'Mão de ferro: jogue uma carta virada'
      : 'Sua vez');
    return;
  }
  setMessage(`Vez de ${playerName(h.turn)}...`);
  later(botTurn, CONFIG.BOT_DELAY);
}

function canHumanPlay() {
  const h = state.hand;
  return !!h && !h.ended && h.phase === 'play' && !h.pending && h.turn === 0;
}

function canRaise(p) {
  const h = state.hand;
  return !!h && !h.ended && h.type === 'normal' && h.phase === 'play' && !h.pending &&
    h.turn === p && h.lastRaiser !== teamOf(p) && nextValue(h.value) !== null;
}

function playCard(p, idx) {
  const h = state.hand;
  const handBox = $(`hand-${p}`);
  const srcRect = (handBox.children[idx] || handBox).getBoundingClientRect();
  const card = h.hands[p].splice(idx, 1)[0];
  const round = currentRound();
  round.plays.push({ player: p, card });
  logEvent(`${playerName(p)} jogou ${cardLabel(card)}.`);
  render();
  animatePlay(p, srcRect);

  if (round.plays.length < 4) {
    h.turn = (h.turn + 1) % 4;
    startTurn();
    return;
  }

  h.phase = 'between';
  const info = evaluateRound();
  render();
  const res = resolveHand(h.results);
  if (res.decided) {
    endHand({ winner: res.winner, reason: res.reason });
    return;
  }
  setMessage(info.text);
  later(() => {
    h.rounds.push({ plays: [], winner: null });
    h.turn = info.nextLeader;
    startTurn();
  }, CONFIG.ROUND_END_DELAY);
}

function evaluateRound() {
  const h = state.hand;
  const round = currentRound();
  const scored = round.plays.map((pl) => ({ ...pl, s: strength(pl.card) }));
  const max = Math.max(...scored.map((x) => x.s));
  const top = scored.filter((x) => x.s === max);
  const teams = new Set(top.map((x) => teamOf(x.player)));
  round.winner = teams.size === 2 ? 'T' : [...teams][0];
  round.winningPlayer = round.winner === 'T' ? null : top[0].player;
  h.results.push(round.winner);

  const n = h.rounds.length;
  let text;
  if (round.winner === 'T') {
    text = `Rodada ${n} empatada.`;
  } else {
    text = `Rodada ${n}: ${winnerPhrase(round.winner)} venceu com ${cardLabel(top[0].card)}.`;
  }
  logEvent(text);
  return { text, nextLeader: top[0].player };
}

/* ===================== PEDIDOS DE AUMENTO ===================== */
function requestRaise(p) {
  const h = state.hand;
  if (!canRaise(p)) return;
  const t = teamOf(p);
  const nv = nextValue(h.value);
  h.pending = { fromTeam: t, fromPlayer: p, value: nv, prevValue: h.value };
  h.lastRaiser = t;
  h.raises.push({ by: playerName(p), team: t, value: nv, response: 'sem resposta' });
  logEvent(`${playerName(p)} pediu ${CONFIG.RAISE_NAMES[nv]} (${nv} pontos).`);
  showAnnounce(`${CONFIG.RAISE_NAMES[nv]}!`);
  render();
  askResponse();
}

function askResponse() {
  const h = state.hand;
  const pd = h.pending;
  const responder = 1 - pd.fromTeam;
  if (responder === 0) {
    setMessage(`${playerName(pd.fromPlayer)} pediu ${CONFIG.RAISE_NAMES[pd.value]}! Responda.`);
    render();
  } else {
    setMessage(`Você pediu ${CONFIG.RAISE_NAMES[pd.value]}! Aguardando resposta...`);
    later(botRespond, CONFIG.BOT_DELAY * 1.3);
  }
}

function respond(decision) {
  const h = state.hand;
  const pd = h && h.pending;
  if (!pd) return;
  const responder = 1 - pd.fromTeam;
  const rec = h.raises[h.raises.length - 1];
  const who = responder === 0 ? 'Sua dupla' : 'A dupla adversária';

  if (decision === 'accept') {
    rec.response = `${who} aceitou`;
    logEvent(`${who} aceitou ${CONFIG.RAISE_NAMES[pd.value]}. A mão vale ${pd.value}.`);
    h.value = pd.value;
    h.pending = null;
    startTurn();
    return;
  }

  if (decision === 'run') {
    rec.response = `${who} correu`;
    logEvent(`${who} correu.`);
    endHand({
      winner: pd.fromTeam,
      points: pd.prevValue,
      reason: `${who} correu do pedido de ${CONFIG.RAISE_NAMES[pd.value]}; ${winnerPhrase(pd.fromTeam).toLowerCase()} marca ${pd.prevValue} (valor aceito antes do pedido).`,
    });
    return;
  }

  if (decision === 'raise') {
    const nv = nextValue(pd.value);
    if (!nv) return;
    rec.response = `${who} aumentou`;
    h.value = pd.value;
    const speaker = responder === 0 ? 0 : pickBotSpeaker(responder);
    h.pending = { fromTeam: responder, fromPlayer: speaker, value: nv, prevValue: pd.value };
    h.lastRaiser = responder;
    h.raises.push({ by: playerName(speaker), team: responder, value: nv, response: 'sem resposta' });
    logEvent(`${playerName(speaker)} aumentou: ${CONFIG.RAISE_NAMES[nv]} (${nv} pontos).`);
    showAnnounce(`${CONFIG.RAISE_NAMES[nv]}!`);
    render();
    askResponse();
  }
}

/* ===================== IA DOS ADVERSÁRIOS ===================== */
function pickBotSpeaker(team) {
  const h = state.hand;
  const cands = [team, team + 2].filter((p) => p !== 0 && p !== 2);
  cands.sort((a, b) => power(h.hands[b]) - power(h.hands[a]));
  return cands[0];
}

function botTurn() {
  const h = state.hand;
  if (!h || h.ended || h.phase !== 'play' || h.pending || h.turn === 0) return;
  const p = h.turn;
  if (canRaise(p) && botWantsToRaise(p)) {
    requestRaise(p);
    return;
  }
  botPlayCard(p);
}

function botWantsToRaise(p) {
  const h = state.hand;
  const own = power(h.hands[p]);
  const roundsWon = h.results.filter((r) => r === teamOf(p)).length;
  const chance = (own >= 1.1 ? 0.3 : 0.04) + roundsWon * 0.1;
  return Math.random() < chance;
}

function botRespond() {
  const h = state.hand;
  if (!h || h.ended || !h.pending) return;
  const pd = h.pending;
  const team = 1 - pd.fromTeam;
  if (team === 0) return;
  const cards = [...h.hands[1], ...h.hands[3]];
  const bonus = h.results.filter((r) => r === team).length * 0.3;
  const score = power(cards) + bonus + Math.random() * 0.35;
  const threshold = 0.85 + (pd.value >= 10 ? 0.2 : 0);
  if (nextValue(pd.value) && score >= threshold + 0.65 && Math.random() < 0.5) respond('raise');
  else if (score >= threshold) respond('accept');
  else respond('run');
}

function botPlayCard(p) {
  const h = state.hand;
  const hand = h.hands[p];
  const round = currentRound();
  const order = hand.map((c, i) => ({ i, s: strength(c) })).sort((a, b) => a.s - b.s);
  let idx;

  if (round.plays.length === 0) {
    idx = h.rounds.length === 1 && order.length === 3 ? order[1].i : order[order.length - 1].i;
  } else {
    const best = (team) => Math.max(-1, ...round.plays.filter((pl) => teamOf(pl.player) === team).map((pl) => strength(pl.card)));
    const mine = best(teamOf(p));
    const opp = best(1 - teamOf(p));
    if (mine > opp) {
      idx = order[0].i;
    } else {
      const beats = order.filter((o) => o.s > opp);
      const ties = order.filter((o) => o.s === opp);
      if (beats.length) idx = beats[0].i;
      else if (ties.length) idx = ties[0].i;
      else idx = order[0].i;
    }
  }
  playCard(p, idx);
}

/* ===================== FIM DA MÃO ===================== */
function endHand({ winner, points, reason }) {
  const h = state.hand;
  h.ended = true;
  h.phase = 'ended';
  h.pending = null;
  h.revealPartner = false;

  let added = 0;
  let finalValue = h.value;
  let gameWinner = null;

  if (winner !== null) {
    if (h.type === 'iron') {
      added = 0;
      gameWinner = winner;
    } else if (points !== undefined) {
      added = points;
      finalValue = points;
    } else {
      added = h.type === 'ten' ? 4 : h.value;
    }
    state.scores[winner] += added;
    if (gameWinner === null && state.scores[winner] >= CONFIG.WIN_SCORE) gameWinner = winner;
  }
  state.gameWinner = gameWinner;

  const winnerText = winner === null ? 'Mão empatada, ninguém marca pontos' : `${winnerPhrase(winner)} venceu`;
  logEvent(`${winnerText}${added ? ` (+${added})` : ''}.`);

  const record = {
    number: h.number,
    typeLabel: HAND_TYPE_LABELS[h.type],
    dealt: h.dealt,
    vira: h.vira,
    manilhaRank: h.manilhaRank,
    rounds: h.rounds.filter((r) => r.plays.length > 0),
    initialValue: h.initialValue,
    raises: h.raises,
    finalValue,
    winner,
    winnerText,
    added,
    scoreAfter: [...state.scores],
    gameWinner,
    reason,
  };
  state.history.push(record);
  addHistoryEntry(record);

  render();
  if (gameWinner !== null) {
    if (gameWinner === 0) showAnnounce('Vitória!', 'win');
    else showAnnounce('Derrota', 'lose');
  }

  let msg = `${winnerText}${added ? ` e marca ${added} ponto(s)` : ''}. ${reason}`;
  if (gameWinner !== null) msg = `Fim de partida! ${winnerPhrase(gameWinner)} venceu. ${reason}`;
  else if (winner === null && h.type === 'iron') msg += ' Será distribuída uma nova mão de ferro.';
  setMessage(msg);
  showEndPanel(msg, gameWinner !== null);
}

/* ===================== RENDERIZAÇÃO ===================== */
function setMessage(text) { $('message').textContent = text; }

function logEvent(text) {
  const li = document.createElement('li');
  li.textContent = text;
  const list = $('event-log');
  list.prepend(li);
  while (list.children.length > 120) list.removeChild(list.lastChild);
}

function render() {
  $('score-us').textContent = state.scores[0];
  $('score-them').textContent = state.scores[1];
  const h = state.hand;
  if (!h) return;

  $('hand-number').textContent = h.number;
  $('hand-type').textContent = HAND_TYPE_LABELS[h.type];
  $('hand-value').textContent = h.type === 'iron' ? 'Partida' : h.value;
  $('manilha-info').textContent = h.vira
    ? `${RANK_NAMES[h.manilhaRank] || h.manilhaRank}`
    : 'Fixas: 4♣ > 7♥ > A♠ > 7♦';

  const viraSlot = $('vira-slot');
  viraSlot.innerHTML = '';
  if (h.vira) viraSlot.appendChild(createCardElement(h.vira, true));
  $('vira-area').hidden = !h.vira;

  const humanCanPlay = canHumanPlay();
  for (let p = 0; p < 4; p++) {
    renderPlayerHand(p, humanCanPlay);
    renderPlayedSlot(p);
    $(`player-${p}`).classList.toggle('is-turn', !h.ended && h.phase === 'play' && h.turn === p);
  }

  renderRoundTracker();
  renderControls();
  $('message-bar').classList.toggle('is-your-turn', !h.ended && h.phase === 'play' && !h.pending && h.turn === 0);
}

// A mão só é reconstruída quando as cartas (ou o lado visível) mudam.
// Assim as imagens não recarregam nem piscam a cada atualização da tela.
function renderPlayerHand(p, humanCanPlay) {
  const h = state.hand;
  const box = $(`hand-${p}`);
  const faceUp = (p === 0 && h.type !== 'iron') || (p === 2 && h.revealPartner);
  const sig = `${h.number}|${faceUp}|${h.hands[p].map((c) => c.key).join(',')}`;
  if (box.dataset.sig !== sig) {
    box.innerHTML = '';
    h.hands[p].forEach((card) => box.appendChild(createCardElement(card, faceUp)));
    box.dataset.sig = sig;
  }
  if (p === 0) {
    [...box.children].forEach((el) => el.classList.toggle('playable', humanCanPlay));
  }
}

// Clique nas suas cartas (um único ouvinte; descobre qual carta pela posição)
$('hand-0').addEventListener('click', (ev) => {
  const el = ev.target.closest('.card');
  if (!el || !canHumanPlay()) return;
  const idx = [...$('hand-0').children].indexOf(el);
  if (idx >= 0) playCard(0, idx);
});

// Cartas jogadas permanecem na mesa até o fim da mão (uma por rodada).
// A atualização é incremental para não interromper a animação das cartas.
function renderPlayedSlot(p) {
  const h = state.hand;
  const slot = $(`played-${p}`);
  const list = [];
  h.rounds.forEach((r, ri) => {
    const pl = r.plays.find((x) => x.player === p);
    if (pl) list.push({ card: pl.card, old: ri < h.rounds.length - 1, win: r.winningPlayer === p });
  });

  const current = [...slot.children];
  const sameSoFar = current.length <= list.length && current.every((el, i) =>
    el.dataset.card === list[i].card.key && el.dataset.hand === String(h.number));
  if (!sameSoFar) slot.innerHTML = '';

  for (let i = sameSoFar ? current.length : 0; i < list.length; i++) {
    const el = createCardElement(list[i].card, true);
    el.dataset.hand = h.number;
    el.classList.add('played-card');
    el.style.setProperty('--r', `${stableAngle(list[i].card.key + h.number + p)}deg`);
    slot.appendChild(el);
  }

  [...slot.children].forEach((el, i) => {
    el.classList.toggle('is-old', list[i].old);
    el.classList.toggle('round-winner', list[i].win);
  });
}

// Inclinação das cartas ao pousar (0 = planas; a arena é o espaço aberto)
const TABLE_TILT = 0;

// A carta voa da mão até a mesa e pousa deitada, acompanhando a perspectiva
function animatePlay(p, srcRect) {
  const real = $(`played-${p}`).lastElementChild;
  if (!real || !srcRect) return;
  const dst = real.getBoundingClientRect();
  if (!dst.width) return;
  const w = real.offsetWidth;
  const h = real.offsetHeight;
  const dcx = dst.left + dst.width / 2;
  const dcy = dst.top + dst.height / 2;
  const r = parseFloat(real.style.getPropertyValue('--r')) || 0;
  const tilt = p === 1 ? -14 : p === 3 ? 14 : 0;

  const clone = real.cloneNode(true);
  clone.removeAttribute('id');
  clone.className = 'card card-flying';
  clone.src = real.currentSrc || real.src;
  const key = real.dataset.card;
  if (key) {
    clone.addEventListener('error', () => {
      clone.src = fallbackCardSvg({ rank: key.slice(0, -1), suit: key.slice(-1) });
    }, { once: true });
  }
  clone.style.cssText = `position:fixed;left:${dcx - w / 2}px;top:${dcy - h / 2}px;width:${w}px;height:${h}px;margin:0;z-index:60;pointer-events:none;`;
  document.body.appendChild(clone);
  real.style.visibility = 'hidden';

  const sx = srcRect.left + srcRect.width / 2 - dcx;
  const sy = srcRect.top + srcRect.height / 2 - dcy;
  const sc = srcRect.width / w;
  const finish = () => { real.style.visibility = ''; clone.remove(); };
  const anim = clone.animate([
    { transform: `translate(${sx}px, ${sy}px) scale(${sc}) rotate(${tilt}deg) perspective(900px) rotateX(0deg)`, opacity: 0.9 },
    { transform: `translate(0px, 0px) scale(1) rotate(${r}deg) perspective(900px) rotateX(${TABLE_TILT}deg)`, opacity: 1 },
  ], { duration: 620, easing: 'cubic-bezier(0.22, 0.9, 0.3, 1)', fill: 'forwards' });
  anim.onfinish = finish;
  anim.oncancel = finish;
  setTimeout(finish, 900);
}

// Texto animado no centro da mesa (letra por letra)
function showAnnounce(text, kind = 'default') {
  const box = $('announce');
  box.innerHTML = '';
  box.className = `announce announce--${kind}`;

  const backdrop = document.createElement('div');
  backdrop.className = 'announce-backdrop';
  const label = document.createElement('div');
  label.className = 'announce-text';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'announce-letter';
    span.style.setProperty('--i', i);
    span.textContent = ch === ' ' ? ' ' : ch;
    label.appendChild(span);
  });
  box.append(backdrop, label);

  clearTimeout(state.announceTimer);
  state.announceTimer = setTimeout(() => {
    box.innerHTML = '';
    box.className = 'announce';
  }, 2200);
}

function renderRoundTracker() {
  const h = state.hand;
  for (let i = 0; i < 3; i++) {
    const box = $(`round-${i + 1}`);
    const out = $(`round-${i + 1}-result`);
    box.classList.remove('round-us', 'round-them');
    const r = h.results[i];
    if (r === undefined) out.textContent = '';
    else if (r === 'T') out.textContent = 'Emp.';
    else {
      out.textContent = TEAM_NAMES[r];
      box.classList.add(r === 0 ? 'round-us' : 'round-them');
    }
  }
}

function renderControls() {
  const h = state.hand;
  const raiseBtn = $('btn-raise');
  const showRaise = h.type === 'normal' && !h.ended;
  $('raise-panel').hidden = !showRaise;
  if (showRaise) {
    const nv = nextValue(h.value);
    raiseBtn.textContent = nv ? `Pedir ${CONFIG.RAISE_NAMES[nv]}` : 'Sem aumento disponível';
    raiseBtn.disabled = !canRaise(0);
  }

  const pd = h.pending;
  const respondingHuman = !!pd && pd.fromTeam === 1;
  $('response-panel').hidden = !respondingHuman;
  if (respondingHuman) {
    $('response-text').textContent =
      `${playerName(pd.fromPlayer)} pediu ${CONFIG.RAISE_NAMES[pd.value]} (${pd.value} pontos). Se correr, eles marcam ${pd.prevValue}.`;
    const nv = nextValue(pd.value);
    $('btn-counter').hidden = !nv;
    if (nv) $('btn-counter').textContent = `Aumentar: ${CONFIG.RAISE_NAMES[nv]} (${nv})`;
  }

  const showTen = h.phase === 'decision' && h.tenTeam === 0;
  $('ten-panel').hidden = !showTen;
  if (showTen) {
    $('ten-text').textContent =
      'Mão de dez! Você e seu parceiro estão com 10 pontos e podem ver as cartas um do outro. Jogar (vale 4 pontos, sem aumentos) ou correr (eles marcam 2)?';
  }

  if (!h.ended) $('end-panel').hidden = true;
}

function showEndPanel(text, gameOver) {
  $('end-text').textContent = text;
  $('btn-next-hand').textContent = gameOver ? 'Nova partida' : 'Próxima mão';
  $('end-panel').hidden = false;
}

/* ===================== REGISTRO DAS MÃOS ===================== */
function addHistoryEntry(rec) {
  const list = $('history-list');
  list.querySelectorAll('details').forEach((d) => { d.open = false; });

  const entry = document.createElement('details');
  entry.className = 'history-entry';
  entry.open = true;

  const summary = document.createElement('summary');
  summary.textContent = `Mão ${rec.number} (${rec.typeLabel}) - ${rec.winnerText}${rec.added ? ` (+${rec.added})` : ''}`;
  entry.appendChild(summary);

  const body = document.createElement('div');
  body.className = 'history-body';
  const addLine = (t) => {
    const p = document.createElement('p');
    p.textContent = t;
    body.appendChild(p);
  };

  addLine(rec.vira
    ? `Vira: ${cardLabel(rec.vira)} | Manilha: ${RANK_NAMES[rec.manilhaRank] || rec.manilhaRank}`
    : 'Manilhas fixas.');
  addLine('Cartas distribuídas: ' + rec.dealt.map((cards, p) => `${playerName(p)}: ${cards.map(cardLabel).join(', ')}`).join(' | '));
  rec.rounds.forEach((r, i) => {
    const plays = r.plays.map((pl) => `${playerName(pl.player)}: ${cardLabel(pl.card)}`).join(' | ');
    const res = r.winner === null ? 'não concluída' : r.winner === 'T' ? 'empate' : `venceu ${TEAM_NAMES[r.winner]}`;
    addLine(`Rodada ${i + 1}: ${plays} -> ${res}`);
  });
  addLine(`Valor inicial da mão: ${rec.initialValue === null ? 'vale a partida' : rec.initialValue}`);
  addLine('Pedidos: ' + (rec.raises.length
    ? rec.raises.map((r) => `${r.by} pediu ${CONFIG.RAISE_NAMES[r.value]} (${r.value}) - ${r.response}`).join('; ')
    : 'nenhum'));
  addLine(`Valor aceito final: ${rec.finalValue === null ? '-' : rec.finalValue}`);
  addLine(`Vencedora da mão: ${rec.winner === null ? 'empate' : TEAM_NAMES[rec.winner]}`);
  addLine(`Pontos adicionados: ${rec.added}`);
  addLine(`Placar atualizado: Nós ${rec.scoreAfter[0]} x ${rec.scoreAfter[1]} Eles`);
  if (rec.gameWinner !== null) addLine(`Vencedora da partida: ${TEAM_NAMES[rec.gameWinner]}`);
  addLine(`Motivo: ${rec.reason}`);

  entry.appendChild(body);
  list.prepend(entry);
}

/* ===================== EVENTOS DA INTERFACE ===================== */
$('btn-new-game').addEventListener('click', startGame);
$('btn-raise').addEventListener('click', () => requestRaise(0));
$('btn-accept').addEventListener('click', () => respond('accept'));
$('btn-run').addEventListener('click', () => respond('run'));
$('btn-counter').addEventListener('click', () => respond('raise'));
$('btn-ten-play').addEventListener('click', () => resolveTen(true));
$('btn-ten-run').addEventListener('click', () => resolveTen(false));
$('btn-next-hand').addEventListener('click', () => {
  if (state.gameWinner !== null) startGame();
  else startHand();
});

// Campo de estrelas que cintila sobre a imagem de fundo
function initStarfield() {
  const cv = $('starfield');
  if (!cv) return;
  const ctx = cv.getContext && cv.getContext('2d');
  if (!ctx) return; // sem canvas: o fundo estrelado em imagem continua funcionando
  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let w = 0;
  let h = 0;
  let stars = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth;
    h = cv.clientHeight;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(220, Math.round((w * h) / 9000));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      p: Math.random() * 6.28,
      s: Math.random() * 1.2 + 0.3,
      c: Math.random() < 0.16 ? '232,69,12' : '239,230,200',
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (const st of stars) {
      const a = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin((t / 1000) * st.s + st.p));
      ctx.fillStyle = `rgba(${st.c},${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, 6.283);
      ctx.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
}

initStarfield();
startGame();