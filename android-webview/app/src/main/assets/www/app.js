const boardEl = document.getElementById("numberBoard");
const creditsEl = document.getElementById("credits");
const peakCreditsEl = document.getElementById("peakCredits");
const lastResultEl = document.getElementById("lastResult");
const pickCountEl = document.getElementById("pickCount");
const activeCardLabelEl = document.getElementById("activeCardLabel");
const denominationValueEl = document.getElementById("denominationValue");
const cardCreditSummaryEl = document.getElementById("cardCreditSummary");
const quickPickBtn = document.getElementById("quickPick");
const clearPicksBtn = document.getElementById("clearPicks");
const playRoundBtn = document.getElementById("playRound");
const betOneBtn = document.getElementById("betOne");
const betMaxBtn = document.getElementById("betMax");
const resetGameBtn = document.getElementById("resetGame");
const drawNumbersEl = document.getElementById("drawNumbers");
const drawSummaryEl = document.getElementById("drawSummary");
const paytableEl = document.getElementById("paytable");
const paytableTitleEl = document.getElementById("paytableTitle");
const roundsEl = document.getElementById("rounds");
const bestHitEl = document.getElementById("bestHit");
const biggestWinEl = document.getElementById("biggestWin");
const coreChargeEl = document.getElementById("coreCharge");
const missionTextEl = document.getElementById("missionText");
const historyEl = document.getElementById("history");
const smashLogoEl = document.getElementById("smashLogo");
const themeHeroEl = document.getElementById("themeHero");
const coreMeterFillEl = document.getElementById("coreMeterFill");
const coreChargeStatEl = document.querySelector(".core-charge-stat");
const flameLegendIconEl = document.querySelector(".flame-legend-icon");
const cardTabEls = document.querySelectorAll("[data-card-tab]");
const coinPackEls = document.querySelectorAll("[data-coin-pack]");
const checkoutCoinsBtn = document.getElementById("checkoutCoins");
const cartCoinsEl = document.getElementById("cartCoins");
const cartTotalEl = document.getElementById("cartTotal");
const receiptTitleEl = document.getElementById("receiptTitle");
const receiptDetailEl = document.getElementById("receiptDetail");
const donationChoiceEls = document.querySelectorAll("[data-donation]");
const denominationEls = document.querySelectorAll("[data-denomination]");
const proofStatusEl = document.getElementById("proofStatus");
const proofSeedEl = document.getElementById("proofSeed");
const proofHashEl = document.getElementById("proofHash");
const proofExportEl = document.getElementById("proofExport");
const proofImportEl = document.getElementById("proofImport");
const copyProofBtn = document.getElementById("copyProof");
const verifyProofBtn = document.getElementById("verifyProof");

const STORAGE_KEY = "atom-bitz-keno-reactor-v1";
const PROOF_VERSION = "atom-bitz-keno-proof-v1";
const STARTING_CREDITS = 2500;
const MAX_PICKS = 10;
const DRAW_COUNT = 20;
const DENOMINATIONS = [1, 5, 25, 50, 100];
const DEFAULT_DENOMINATION = 1;
const MAX_CARD_CREDITS = 10;
const FREE_COIN_PACKS = [1000, 5000, 25000];
const DONATION_PRESETS = [0, 1, 5, 10];
const CARD_THEMES = ["red", "yellow", "green", "pink"];
const CARD_LABELS = ["A", "B", "C", "D"];
const VIEW_ALL_THEME = "purple";
var themeMode = CARD_THEMES[0];
var selectedCoinPack = FREE_COIN_PACKS[0];
var selectedDonation = DONATION_PRESETS[0];
var activeCardIndex = 0;
var viewAllCards = false;

const THEME_ASSETS = {
  red: {
    hero: "./assets/theme-red-header.png",
    flame: "./assets/flame-mini-red.png",
  },
  yellow: {
    hero: "./assets/theme-yellow-header.png",
    flame: "./assets/flame-mini-yellow.png",
  },
  green: {
    hero: "./assets/theme-green-header.png",
    flame: "./assets/flame-mini-green.png",
  },
  purple: {
    hero: "./assets/theme-purple-header.png",
    flame: "./assets/flame-mini-purple.png",
  },
  pink: {
    hero: "./assets/theme-pink-header.png",
    flame: "./assets/flame-mini-pink.png",
  },
};
const PAYTABLES = {
  1: { 1: 3 },
  2: { 2: 12 },
  3: { 2: 2, 3: 50 },
  4: { 2: 1, 3: 5, 4: 100 },
  5: { 3: 2, 4: 20, 5: 400 },
  6: { 3: 1, 4: 7, 5: 75, 6: 1000 },
  7: { 3: 1, 4: 3, 5: 20, 6: 250, 7: 2500 },
  8: { 4: 2, 5: 10, 6: 75, 7: 1000, 8: 5000 },
  9: { 4: 1, 5: 5, 6: 50, 7: 400, 8: 4000, 9: 10000 },
  10: { 4: 1, 5: 3, 6: 20, 7: 200, 8: 1200, 9: 8000, 10: 20000 },
};

const state = loadState();
let cardSelections = state.cards.map((card) => new Set(card));
let drawn = new Set();
let cardHits = state.cards.map(() => new Set());
let isDrawing = false;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Number.isFinite(saved.credits)) {
      const savedCards = Array.isArray(saved.cards)
        ? saved.cards
        : [Array.isArray(saved.selected) ? saved.selected : []];
      const cards = Array.from({ length: 4 }, (_, index) => (
        Array.isArray(savedCards[index]) ? savedCards[index].filter(isBoardNumber).slice(0, MAX_PICKS) : []
      ));
      return {
        credits: Math.max(0, Math.floor(saved.credits)),
        peakCredits: Math.max(STARTING_CREDITS, Math.floor(saved.peakCredits || STARTING_CREDITS)),
        rounds: Math.max(0, Math.floor(saved.rounds || 0)),
        bestHit: Math.max(0, Math.floor(saved.bestHit || 0)),
        biggestWin: Math.max(0, Math.floor(saved.biggestWin || 0)),
        coreCharge: Math.max(0, Math.min(100, Math.floor(saved.coreCharge || 0))),
        cards,
        cardCredits: normalizeCardCredits(saved.cardCredits),
        denomination: DENOMINATIONS.includes(saved.denomination) ? saved.denomination : DEFAULT_DENOMINATION,
        history: Array.isArray(saved.history) ? saved.history.slice(0, 8) : [],
        receipts: Array.isArray(saved.receipts) ? saved.receipts.slice(0, 5) : [],
        proofSeed: typeof saved.proofSeed === "string" && saved.proofSeed ? saved.proofSeed : createLocalProofSeed(),
        proofRound: Math.max(0, Math.floor(saved.proofRound || 0)),
        lastProof: saved.lastProof && typeof saved.lastProof === "object" ? saved.lastProof : null,
      };
    }
  } catch {
    // Ignore damaged browser save data and start clean.
  }
  return {
    credits: STARTING_CREDITS,
    peakCredits: STARTING_CREDITS,
    rounds: 0,
    bestHit: 0,
    biggestWin: 0,
    coreCharge: 0,
    cards: [[], [], [], []],
    cardCredits: [1, 1, 1, 1],
    denomination: DEFAULT_DENOMINATION,
    history: [],
    receipts: [],
    proofSeed: createLocalProofSeed(),
    proofRound: 0,
    lastProof: null,
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...state,
    cards: cardSelections.map((card) => [...card].sort((a, b) => a - b)),
    cardCredits: normalizeCardCredits(state.cardCredits),
    denomination: DENOMINATIONS.includes(state.denomination) ? state.denomination : DEFAULT_DENOMINATION,
  }));
}

function applyTheme(nextTheme) {
  themeMode = THEME_ASSETS[nextTheme] ? nextTheme : "red";
  const assets = THEME_ASSETS[themeMode];
  document.documentElement.dataset.theme = themeMode;
  if (themeHeroEl) themeHeroEl.src = assets.hero;
  if (flameLegendIconEl) flameLegendIconEl.src = assets.flame;
  cardTabEls.forEach((button) => {
    const tab = button.dataset.cardTab;
    const isActive = viewAllCards ? tab === "all" : Number(tab) === activeCardIndex;
    button.classList.toggle("active", isActive);
  });
}

function isBoardNumber(value) {
  return Number.isInteger(value) && value >= 1 && value <= 80;
}

function normalizeCardCredits(value) {
  return Array.from({ length: 4 }, (_, index) => {
    const credits = Array.isArray(value) ? Math.floor(Number(value[index])) : 1;
    return Math.max(1, Math.min(MAX_CARD_CREDITS, Number.isFinite(credits) ? credits : 1));
  });
}

function createLocalProofSeed() {
  const values = new Uint32Array(4);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(values);
  } else {
    values.forEach((_, index) => {
      values[index] = Math.floor(Math.random() * 0xffffffff);
    });
  }
  return Array.from(values, (value) => value.toString(16).padStart(8, "0")).join("");
}

function canonicalJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function fallbackHash(text) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const left = (h2 >>> 0).toString(16).padStart(8, "0");
  const right = (h1 >>> 0).toString(16).padStart(8, "0");
  return `${left}${right}${right}${left}`;
}

async function sha256Hex(text) {
  if (!window.crypto?.subtle) {
    return fallbackHash(text);
  }
  const encoded = new TextEncoder().encode(text);
  const digest = await window.crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBoardNumber(hex) {
  return (Number.parseInt(hex.slice(0, 12), 16) % 80) + 1;
}

async function deterministicDraw(seed, proofRound, playedCards, cards) {
  const draw = [];
  const used = new Set();
  let nonce = 0;
  const pickSnapshot = cards.map((card) => [...card].sort((a, b) => a - b));
  while (draw.length < DRAW_COUNT) {
    const input = canonicalJson({
      version: PROOF_VERSION,
      seed,
      proofRound,
      playedCards,
      pickSnapshot,
      drawIndex: draw.length,
      nonce,
    });
    const candidate = hexToBoardNumber(await sha256Hex(input));
    if (!used.has(candidate)) {
      used.add(candidate);
      draw.push(candidate);
    }
    nonce += 1;
  }
  return draw.sort((a, b) => a - b);
}

function proofPayloadWithoutHash(proof) {
  const { sessionHash: _sessionHash, ...payload } = proof;
  return payload;
}

async function hashProof(proof) {
  return sha256Hex(canonicalJson(proofPayloadWithoutHash(proof)));
}

async function buildRoundProof({ proofRound, playedCards, draw, summaries, totalWin, totalWager }) {
  const proof = {
    version: PROOF_VERSION,
    app: "Atom BitZ Keno Reactor",
    chainPlan: "Base Sepolia VRF later; local deterministic seed now",
    seedSource: "browser-local",
    proofSeed: state.proofSeed,
    proofRound,
    drawCount: DRAW_COUNT,
    boardMax: 80,
    playedCards,
    denomination: currentDenomination(),
    cardCredits: normalizeCardCredits(state.cardCredits),
    cardWagers: playedCards.map((cardIndex) => ({ cardIndex, wager: cardWager(cardIndex) })),
    totalWager,
    totalWin,
    cards: cardSelections.map((card) => [...card].sort((a, b) => a - b)),
    draw,
    summaries,
    createdAt: new Date().toISOString(),
  };
  proof.sessionHash = await hashProof(proof);
  return proof;
}

function proofExportText(proof) {
  return proof ? JSON.stringify(proof, null, 2) : "";
}

function shortHash(value) {
  return value ? `${value.slice(0, 10)}...${value.slice(-8)}` : "Pending";
}

function renderProof() {
  if (!proofSeedEl || !proofHashEl || !proofStatusEl || !proofExportEl || !proofImportEl) return;
  proofSeedEl.textContent = shortHash(state.proofSeed);
  const latestProof = state.lastProof;
  proofHashEl.textContent = latestProof?.sessionHash ? shortHash(latestProof.sessionHash) : "Pending";
  proofStatusEl.textContent = latestProof ? `Round ${latestProof.proofRound}` : "No proof yet";
  proofExportEl.value = proofExportText(latestProof);
  if (!proofImportEl.value && latestProof) {
    proofImportEl.value = proofExportEl.value;
  }
}

async function verifyProofText(text) {
  const proof = JSON.parse(text);
  if (!proof || proof.version !== PROOF_VERSION) {
    throw new Error("Proof version mismatch");
  }
  const cards = proof.cards.map((card) => new Set(card.filter(isBoardNumber)));
  const replayDraw = await deterministicDraw(proof.proofSeed, proof.proofRound, proof.playedCards, cards);
  if (replayDraw.join(",") !== proof.draw.join(",")) {
    throw new Error("Draw replay mismatch");
  }
  const replayHash = await hashProof(proof);
  if (replayHash !== proof.sessionHash) {
    throw new Error("Hash mismatch");
  }
  return proof;
}

function randomInt(max) {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function shuffledNumbers() {
  const nums = Array.from({ length: 80 }, (_, index) => index + 1);
  for (let index = nums.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [nums[index], nums[swapIndex]] = [nums[swapIndex], nums[index]];
  }
  return nums;
}

function formatCredits(value) {
  return Math.floor(value).toLocaleString("en-US");
}

function formatReceiptDate(value) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "just now";
  }
}

function payoutMultiplier(picks, hitCount) {
  return PAYTABLES[picks]?.[hitCount] || 0;
}

function currentDenomination() {
  return DENOMINATIONS.includes(state.denomination) ? state.denomination : DEFAULT_DENOMINATION;
}

function cardCreditCount(cardIndex) {
  state.cardCredits = normalizeCardCredits(state.cardCredits);
  return state.cardCredits[cardIndex] || 1;
}

function cardWager(cardIndex) {
  return cardCreditCount(cardIndex) * currentDenomination();
}

function targetCardIndexesForBet() {
  if (!viewAllCards) return [activeCardIndex];
  const playable = playableCardIndexes();
  return playable.length ? playable : [0, 1, 2, 3];
}

function addOneCredit() {
  if (isDrawing) return;
  state.cardCredits = normalizeCardCredits(state.cardCredits);
  targetCardIndexesForBet().forEach((cardIndex) => {
    state.cardCredits[cardIndex] = Math.min(MAX_CARD_CREDITS, state.cardCredits[cardIndex] + 1);
  });
  saveState();
  render();
}

function setBetMax() {
  if (isDrawing) return;
  const targets = targetCardIndexesForBet();
  const affordableCredits = Math.floor(state.credits / Math.max(1, currentDenomination() * targets.length));
  const maxCredits = Math.max(1, Math.min(MAX_CARD_CREDITS, affordableCredits || 1));
  targets.forEach((cardIndex) => {
    state.cardCredits[cardIndex] = maxCredits;
  });
  saveState();
  render();
}

function selectDenomination(value) {
  if (isDrawing || !DENOMINATIONS.includes(value)) return;
  state.denomination = value;
  saveState();
  render();
}

function activeSelection() {
  return cardSelections[activeCardIndex];
}

function selectedCardsForNumber(number) {
  return cardSelections
    .map((card, index) => (card.has(number) ? index : null))
    .filter((index) => index !== null);
}

function hitsForNumber(number) {
  return cardHits
    .map((hits, index) => (hits.has(number) ? index : null))
    .filter((index) => index !== null);
}

function visibleHitCardsForNumber(number) {
  if (viewAllCards) return hitsForNumber(number);
  return cardHits[activeCardIndex].has(number) ? [activeCardIndex] : [];
}

function hitClassForCards(hitCards) {
  if (!hitCards.length) return "";
  if (hitCards.length > 1) return " hit-multi";
  return ` hit-card-${hitCards[0] + 1}`;
}

function playableCardIndexes() {
  if (!viewAllCards) return activeSelection().size ? [activeCardIndex] : [];
  return cardSelections
    .map((card, index) => (card.size ? index : null))
    .filter((index) => index !== null);
}

function buildBoard() {
  boardEl.innerHTML = "";
  for (let number = 1; number <= 80; number += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "number-cell";
    button.dataset.number = String(number);
    button.innerHTML = `<span class="number-label">${number}</span><span class="card-markers" aria-hidden="true"></span>`;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => togglePick(number));
    boardEl.append(button);
  }
}

function togglePick(number) {
  if (isDrawing || viewAllCards) return;
  const selected = activeSelection();
  if (selected.has(number)) {
    selected.delete(number);
  } else if (selected.size < MAX_PICKS) {
    selected.add(number);
  }
  drawn.clear();
  cardHits = cardSelections.map(() => new Set());
  saveState();
  render();
}

function quickPick() {
  if (isDrawing || viewAllCards) return;
  cardSelections[activeCardIndex] = new Set(shuffledNumbers().slice(0, MAX_PICKS));
  drawn.clear();
  cardHits = cardSelections.map(() => new Set());
  saveState();
  render();
}

function clearPicks() {
  if (isDrawing || viewAllCards) return;
  activeSelection().clear();
  drawn.clear();
  cardHits = cardSelections.map(() => new Set());
  drawSummaryEl.textContent = "Awaiting draw";
  drawNumbersEl.innerHTML = "";
  lastResultEl.textContent = "Ready";
  saveState();
  render();
}

function renderBoard() {
  boardEl.querySelectorAll(".number-cell").forEach((button) => {
    const number = Number(button.dataset.number);
    const activeSelected = !viewAllCards && activeSelection().has(number);
    const selectedCards = selectedCardsForNumber(number);
    const hitCards = hitsForNumber(number);
    const visibleHitCards = visibleHitCardsForNumber(number);
    button.classList.remove("hit-card-1", "hit-card-2", "hit-card-3", "hit-card-4", "hit-multi");
    button.classList.toggle("selected", activeSelected);
    button.classList.toggle("multi-selected", viewAllCards && selectedCards.length > 0);
    button.classList.toggle("drawn", drawn.has(number));
    button.classList.toggle("hit", visibleHitCards.length > 0);
    visibleHitCards.forEach((cardIndex) => button.classList.add(`hit-card-${cardIndex + 1}`));
    button.classList.toggle("hit-multi", visibleHitCards.length > 1);
    button.setAttribute("aria-pressed", activeSelected || selectedCards.length ? "true" : "false");
    button.dataset.cardCount = String(selectedCards.length);
    const markers = button.querySelector(".card-markers");
    if (markers) {
      markers.innerHTML = "";
      selectedCards.forEach((cardIndex) => {
        const marker = document.createElement("span");
        marker.className = `card-marker card-${cardIndex + 1}${hitCards.includes(cardIndex) ? " hit-marker" : ""}`;
        markers.append(marker);
      });
    }
  });
}

function renderPaytable(activeHit = null) {
  const picks = viewAllCards ? 0 : activeSelection().size;
  paytableEl.innerHTML = "";
  if (viewAllCards) {
    paytableTitleEl.textContent = "4-card view";
    cardSelections.forEach((card, index) => {
      const row = document.createElement("div");
      row.className = "pay-row card-summary-row";
      row.innerHTML = `<span>Card ${CARD_LABELS[index]}</span><strong>${card.size}/10</strong>`;
      paytableEl.append(row);
    });
    return;
  }
  if (!picks) {
    paytableTitleEl.textContent = "Pick numbers";
    const empty = document.createElement("div");
    empty.className = "pay-row";
    empty.innerHTML = "<span>Select numbers to show payouts</span><strong>-</strong>";
    paytableEl.append(empty);
    return;
  }

  paytableTitleEl.textContent = `${picks}-spot`;
  const table = PAYTABLES[picks] || {};
  for (let hit = 0; hit <= picks; hit += 1) {
    const multiplier = table[hit] || 0;
    if (hit === 0 || multiplier > 0 || hit === activeHit) {
      const row = document.createElement("div");
      row.className = `pay-row${hit === activeHit ? " active" : ""}`;
      row.innerHTML = `<span>${hit} hit${hit === 1 ? "" : "s"}</span><strong>${multiplier}x</strong>`;
      paytableEl.append(row);
    }
  }
}

function renderHistory() {
  historyEl.innerHTML = "";
  const items = state.history.length ? state.history : [{ text: "No rounds yet. Warm up the reactor.", win: 0 }];
  items.forEach((item) => {
    const row = document.createElement("li");
    row.innerHTML = item.win > 0 ? `<strong>${item.text}</strong>` : item.text;
    historyEl.append(row);
  });
}

function renderStats() {
  creditsEl.textContent = formatCredits(state.credits);
  peakCreditsEl.textContent = formatCredits(state.peakCredits);
  if (viewAllCards) {
    const totalPicks = cardSelections.reduce((sum, card) => sum + card.size, 0);
    pickCountEl.textContent = `${totalPicks} total picks`;
    activeCardLabelEl.textContent = "View All";
  } else {
    pickCountEl.textContent = `${activeSelection().size} selected`;
    activeCardLabelEl.textContent = `Card ${CARD_LABELS[activeCardIndex]} / ${cardCreditCount(activeCardIndex)} credit${cardCreditCount(activeCardIndex) === 1 ? "" : "s"}`;
  }
  roundsEl.textContent = formatCredits(state.rounds);
  bestHitEl.textContent = String(state.bestHit);
  biggestWinEl.textContent = formatCredits(state.biggestWin);
  coreChargeEl.textContent = `${state.coreCharge}%`;
  if (coreMeterFillEl) {
    coreMeterFillEl.style.width = `${state.coreCharge}%`;
  }
  if (coreChargeStatEl) {
    coreChargeStatEl.classList.toggle("charged", state.coreCharge >= 100);
  }
  missionTextEl.textContent = state.coreCharge >= 100
    ? "Core charged. Big hit mode engaged."
    : "Hit 3+ to charge the core";
}

function renderDenomination() {
  if (denominationValueEl) {
    denominationValueEl.textContent = formatCredits(currentDenomination());
  }
  denominationEls.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.denomination) === currentDenomination());
  });
  if (!cardCreditSummaryEl) return;
  if (viewAllCards) {
    cardCreditSummaryEl.textContent = cardSelections
      .map((_card, index) => `${CARD_LABELS[index]} ${cardCreditCount(index)}c/${formatCredits(cardWager(index))}`)
      .join(" / ");
  } else {
    cardCreditSummaryEl.textContent = `Card ${CARD_LABELS[activeCardIndex]}: ${cardCreditCount(activeCardIndex)} credit${cardCreditCount(activeCardIndex) === 1 ? "" : "s"} / wager ${formatCredits(cardWager(activeCardIndex))}`;
  }
}

function renderCheckout() {
  if (!cartCoinsEl || !receiptTitleEl || !receiptDetailEl) return;
  coinPackEls.forEach((button) => {
    const pack = Number(button.dataset.coinPack);
    button.classList.toggle("active", pack === selectedCoinPack);
  });
  donationChoiceEls.forEach((button) => {
    const donation = Number(button.dataset.donation);
    button.classList.toggle("active", donation === selectedDonation);
  });
  cartCoinsEl.textContent = `${formatCredits(selectedCoinPack)} AB App Coins`;
  if (cartTotalEl) {
    cartTotalEl.textContent = `$0.00 AB App Coins / $${selectedDonation.toFixed(2)} optional support`;
  }

  const latest = state.receipts[0];
  if (!latest) {
    receiptTitleEl.textContent = "No checkout yet";
    receiptDetailEl.textContent = "Pick a pack and complete the free cart.";
    return;
  }

  receiptTitleEl.textContent = `${formatCredits(latest.coins)} AB App Coins added`;
  const support = Number(latest.donation || 0);
  receiptDetailEl.textContent = `${latest.id} / support pledge $${support.toFixed(2)} / ${formatReceiptDate(latest.createdAt)}`;
}

function render(activeHit = null) {
  const playable = playableCardIndexes();
  const roundCost = playable.reduce((sum, cardIndex) => sum + cardWager(cardIndex), 0);
  const canFundRound = playable.length > 0 && roundCost > 0 && state.credits >= roundCost;
  renderBoard();
  renderPaytable(activeHit);
  renderHistory();
  renderStats();
  renderDenomination();
  renderCheckout();
  renderProof();
  playRoundBtn.disabled = isDrawing || !canFundRound;
  quickPickBtn.disabled = isDrawing || viewAllCards;
  clearPicksBtn.disabled = isDrawing || viewAllCards;
  if (checkoutCoinsBtn) checkoutCoinsBtn.disabled = isDrawing;
  if (copyProofBtn) copyProofBtn.disabled = isDrawing || !state.lastProof;
  if (verifyProofBtn) verifyProofBtn.disabled = isDrawing;
}

function renderDrawNumber(number) {
  const pill = document.createElement("span");
  const hitCards = visibleHitCardsForNumber(number);
  const hitCount = hitCards.length;
  pill.className = `draw-pill${hitCount ? " hit" : ""}${hitClassForCards(hitCards)}`;
  pill.textContent = number;
  drawNumbersEl.append(pill);
  if (hitCount) {
    triggerLogoSmash();
  }
}

function triggerLogoSmash() {
  const stage = smashLogoEl?.parentElement;
  if (!stage) return;
  stage.classList.remove("smashing");
  void stage.offsetWidth;
  stage.classList.add("smashing");
}

async function finishRound(draw, playedCards, proofRound) {
  let totalWin = 0;
  let bestRoundHit = 0;
  const summaries = playedCards.map((cardIndex) => {
    const card = cardSelections[cardIndex];
    const hits = new Set(draw.filter((number) => card.has(number)));
    cardHits[cardIndex] = hits;
    const hitCount = hits.size;
    const multiplier = payoutMultiplier(card.size, hitCount);
    const wager = cardWager(cardIndex);
    const win = wager * multiplier;
    totalWin += win;
    bestRoundHit = Math.max(bestRoundHit, hitCount);
    return { cardIndex, picks: card.size, credits: cardCreditCount(cardIndex), denomination: currentDenomination(), wager, hitCount, win };
  });

  const totalWager = summaries.reduce((sum, item) => sum + item.wager, 0);
  state.credits = state.credits - totalWager + totalWin;
  state.peakCredits = Math.max(state.peakCredits, state.credits);
  state.rounds += 1;
  state.bestHit = Math.max(state.bestHit, bestRoundHit);
  state.biggestWin = Math.max(state.biggestWin, totalWin);
  state.coreCharge = Math.min(100, state.coreCharge + (bestRoundHit >= 3 ? bestRoundHit * 8 : bestRoundHit * 2));

  const sign = totalWin > totalWager ? "+" : totalWin === totalWager ? "Even" : "-";
  const net = totalWin - totalWager;
  const resultText = viewAllCards
    ? `${playedCards.length} cards, paid ${formatCredits(totalWin)}`
    : `${summaries[0].hitCount}/${summaries[0].picks} hit, paid ${formatCredits(totalWin)}`;
  lastResultEl.textContent = sign === "Even" ? "Even" : `${sign}${formatCredits(Math.abs(net))}`;
  drawSummaryEl.textContent = resultText;

  const summaryText = summaries
    .map((item) => `${CARD_LABELS[item.cardIndex]} ${item.hitCount}/${item.picks}`)
    .join(", ");
  state.history.unshift({
    text: `Round ${state.rounds}: ${summaryText}, wager ${formatCredits(totalWager)}, paid ${formatCredits(totalWin)}`,
    win: totalWin,
  });
  state.history = state.history.slice(0, 8);

  if (state.credits === 0) {
    state.credits = STARTING_CREDITS;
    state.history.unshift({ text: "Refilled free-play AB App Coins back to 2,500.", win: 0 });
  }

  state.lastProof = await buildRoundProof({
    proofRound,
    playedCards,
    draw,
    summaries,
    totalWin,
    totalWager,
  });

  saveState();
  isDrawing = false;
  render(viewAllCards ? null : summaries[0].hitCount);
}

async function playRound() {
  const playedCards = playableCardIndexes();
  if (isDrawing || playedCards.length === 0) return;
  const totalWager = playedCards.reduce((sum, cardIndex) => sum + cardWager(cardIndex), 0);
  if (totalWager < 1 || totalWager > state.credits) return;
  isDrawing = true;
  drawn.clear();
  cardHits = cardSelections.map(() => new Set());
  drawNumbersEl.innerHTML = "";
  drawSummaryEl.textContent = "Drawing...";
  lastResultEl.textContent = "Spinning";
  render();

  const proofRound = state.proofRound + 1;
  state.proofRound = proofRound;
  const draw = await deterministicDraw(state.proofSeed, proofRound, playedCards, cardSelections);
  let index = 0;
  const timer = window.setInterval(() => {
    const number = draw[index];
    drawn.add(number);
    playedCards.forEach((cardIndex) => {
      if (cardSelections[cardIndex].has(number)) {
        cardHits[cardIndex].add(number);
      }
    });
    renderDrawNumber(number);
    renderBoard();
    index += 1;
    if (index >= draw.length) {
      window.clearInterval(timer);
      finishRound(draw, playedCards, proofRound);
    }
  }, 65);
}

function resetGame() {
  if (isDrawing) return;
  localStorage.removeItem(STORAGE_KEY);
  state.credits = STARTING_CREDITS;
  state.peakCredits = STARTING_CREDITS;
  state.rounds = 0;
  state.bestHit = 0;
  state.biggestWin = 0;
  state.coreCharge = 0;
  state.history = [];
  state.receipts = [];
  state.proofSeed = createLocalProofSeed();
  state.proofRound = 0;
  state.lastProof = null;
  state.cardCredits = [1, 1, 1, 1];
  state.denomination = DEFAULT_DENOMINATION;
  cardSelections = [new Set(), new Set(), new Set(), new Set()];
  state.cards = [[], [], [], []];
  drawn.clear();
  cardHits = cardSelections.map(() => new Set());
  drawSummaryEl.textContent = "Awaiting draw";
  drawNumbersEl.innerHTML = "";
  lastResultEl.textContent = "Ready";
  saveState();
  render();
}

async function copyProof() {
  if (!state.lastProof || !proofExportEl) return;
  const text = proofExportText(state.lastProof);
  proofExportEl.value = text;
  try {
    await navigator.clipboard.writeText(text);
    proofStatusEl.textContent = "Proof copied";
  } catch {
    proofExportEl.select();
    proofStatusEl.textContent = "Proof selected";
  }
}

async function verifyImportedProof() {
  if (!proofImportEl || !proofStatusEl) return;
  try {
    const proof = await verifyProofText(proofImportEl.value || proofExportEl.value);
    proofStatusEl.textContent = `Verified R${proof.proofRound}`;
    proofHashEl.textContent = shortHash(proof.sessionHash);
  } catch (error) {
    proofStatusEl.textContent = "Verify failed";
    proofHashEl.textContent = error.message;
  }
}

function selectCardTab(tab) {
  if (isDrawing) return;
  viewAllCards = tab === "all";
  if (!viewAllCards) {
    activeCardIndex = Math.max(0, Math.min(3, Number(tab)));
  }
  drawn.clear();
  cardHits = cardSelections.map(() => new Set());
  drawSummaryEl.textContent = viewAllCards ? "All cards" : `Card ${CARD_LABELS[activeCardIndex]}`;
  drawNumbersEl.innerHTML = "";
  lastResultEl.textContent = "Ready";
  applyTheme(viewAllCards ? VIEW_ALL_THEME : CARD_THEMES[activeCardIndex]);
  render();
}

function selectCoinPack(coins) {
  if (isDrawing || !FREE_COIN_PACKS.includes(coins)) return;
  selectedCoinPack = coins;
  renderCheckout();
}

function selectDonation(amount) {
  if (isDrawing || !DONATION_PRESETS.includes(amount)) return;
  selectedDonation = amount;
  renderCheckout();
}

function completeFreeCheckout() {
  if (isDrawing) return;
  const coins = selectedCoinPack;
  const receipt = {
    id: `AB-FREE-${Date.now().toString(36).toUpperCase()}`,
    coins,
    total: 0,
    donation: selectedDonation,
    createdAt: new Date().toISOString(),
  };

  state.credits += coins;
  state.peakCredits = Math.max(state.peakCredits, state.credits);
  state.receipts.unshift(receipt);
  state.receipts = state.receipts.slice(0, 5);
  state.history.unshift({
    text: `Free checkout ${receipt.id}: added ${formatCredits(coins)} AB App Coins; support pledge $${selectedDonation.toFixed(2)}.`,
    win: 0,
  });
  state.history = state.history.slice(0, 8);
  lastResultEl.textContent = "Coins Added";
  saveState();
  render();
}

denominationEls.forEach((button) => {
  button.addEventListener("click", () => selectDenomination(Number(button.dataset.denomination)));
});

cardTabEls.forEach((button) => {
  button.addEventListener("click", () => selectCardTab(button.dataset.cardTab));
});

coinPackEls.forEach((button) => {
  button.addEventListener("click", () => selectCoinPack(Number(button.dataset.coinPack)));
});

donationChoiceEls.forEach((button) => {
  button.addEventListener("click", () => selectDonation(Number(button.dataset.donation)));
});

quickPickBtn.addEventListener("click", quickPick);
clearPicksBtn.addEventListener("click", clearPicks);
playRoundBtn.addEventListener("click", playRound);
betOneBtn.addEventListener("click", addOneCredit);
betMaxBtn.addEventListener("click", setBetMax);
resetGameBtn.addEventListener("click", resetGame);
checkoutCoinsBtn.addEventListener("click", completeFreeCheckout);
copyProofBtn.addEventListener("click", copyProof);
verifyProofBtn.addEventListener("click", verifyImportedProof);

window.themeMode = themeMode;
applyTheme(CARD_THEMES[activeCardIndex]);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {
    // The game still works normally if install/offline support is unavailable.
  });
}

buildBoard();
render();
