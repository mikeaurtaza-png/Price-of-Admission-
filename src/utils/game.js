import { cards } from '../data/cards.js';
import { avatarPool, archetypes, hostLines, revealLines } from '../data/personality.js';

export function makeRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function sampleCard(used = []) {
  const available = cards.filter(c => !used.includes(c.id));
  return (available.length ? available : cards)[Math.floor(Math.random() * (available.length ? available.length : cards.length))];
}

export function createDemoPlayers() {
  const names = ['Mike','Melissa','Tony','Sarah','Chaos Chris','Jess','Rob','Nina'];
  return names.map((name, index) => ({
    id: `p-${index+1}`,
    name,
    avatar: avatarPool[index],
    score: 0,
    locked: false,
    vote: null,
    prediction: null,
    archetype: archetypes[index % archetypes.length],
    sellout: 0,
    chaos: 0
  }));
}

export function createInitialGame() {
  const firstCard = sampleCard();
  return {
    roomCode: makeRoomCode(),
    phase: 'landing',
    round: 1,
    maxRounds: 10,
    maxPlayers: 8,
    selectedDecks: ['bad-decisions','caught-4k','money-grab','red-flags','friendship-ender','down-horrendous'],
    players: createDemoPlayers(),
    card: firstCard,
    usedCards: [firstCard.id],
    hostLine: hostLines[Math.floor(Math.random() * hostLines.length)],
    revealLine: revealLines[0],
    floatingReactions: [],
    lastReveal: null
  };
}

export function resetVotes(players) {
  return players.map(p => ({ ...p, locked: false, vote: null, prediction: null }));
}

export function resolveRound(game) {
  const yesCount = game.players.filter(p => p.vote === 'deal').length;
  const updatedPlayers = game.players.map(p => {
    const exact = Number(p.prediction) === yesCount;
    const close = Math.abs(Number(p.prediction ?? -100) - yesCount) === 1;
    const voteBonus = p.vote === 'deal' ? 1 : 0;
    const points = exact ? 5 : close ? 3 : 0;
    return {
      ...p,
      score: p.score + points + voteBonus,
      sellout: p.sellout + (p.vote === 'deal' ? 1 : 0),
      chaos: p.chaos + (exact ? 0 : 1)
    };
  }).sort((a,b)=> b.score - a.score);
  return {
    yesCount,
    noCount: game.players.length - yesCount,
    updatedPlayers,
    revealLine: revealLines[Math.floor(Math.random() * revealLines.length)],
    roast: hostLines[Math.floor(Math.random() * hostLines.length)]
  };
}
