export function makeRoomCode(){ return Math.random().toString(36).slice(2,6).toUpperCase(); }
export function shuffle(list){ return [...list].sort(()=>Math.random()-0.5); }
export function getRandomCard(cards, usedIds, mode){
  const pool = cards.filter(c => c.mode === mode && !usedIds.includes(c.id));
  const fallback = cards.filter(c => c.mode === mode);
  const source = pool.length ? pool : fallback;
  return source[Math.floor(Math.random()*source.length)];
}
export function scorePrediction(prediction, actualYes){
  const diff = Math.abs(Number(prediction) - Number(actualYes));
  if(diff === 0) return 5;
  if(diff === 1) return 3;
  if(diff === 2) return 1;
  return 0;
}
export function summarizePlayer(player, rounds){
  const votes = rounds.map(r => r.votes?.[player.id]).filter(Boolean);
  const deals = votes.filter(v => v === 'deal').length;
  const dealRate = votes.length ? Math.round((deals / votes.length) * 100) : 0;
  if(dealRate >= 75) return 'Opportunist';
  if(dealRate <= 25) return 'Principled Menace';
  return 'Wildcard';
}
