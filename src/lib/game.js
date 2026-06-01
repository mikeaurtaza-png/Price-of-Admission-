export function makeRoomCode(){ return Math.random().toString(36).slice(2,6).toUpperCase(); }
export function shuffle(list){ return [...list].sort(()=>Math.random()-0.5); }
export function pick(list){ return list[Math.floor(Math.random()*list.length)]; }
export function getRandomCard(cards, usedIds = [], mode = 'party'){
  const pool = cards.filter(c => c.mode === mode && !usedIds.includes(c.id));
  const fallback = cards.filter(c => c.mode === mode);
  const source = pool.length ? pool : fallback;
  return pick(source);
}
export function scorePrediction(prediction, actualYes){
  const diff = Math.abs(Number(prediction) - Number(actualYes));
  if(diff === 0) return 5;
  if(diff === 1) return 3;
  if(diff === 2) return 1;
  return 0;
}
export function archetypeFor(player, history){
  const votes = history.map(r => r.votes?.[player.id]).filter(Boolean);
  const deals = votes.filter(v => v === 'deal').length;
  const rate = votes.length ? Math.round((deals / votes.length) * 100) : 50;
  if(rate >= 85) return { label:'Certified Menace', emoji:'😈', rate };
  if(rate >= 70) return { label:'For The Right Price', emoji:'💰', rate };
  if(rate >= 55) return { label:'Chaos Merchant', emoji:'🔥', rate };
  if(rate >= 40) return { label:'Wild Card', emoji:'🎲', rate };
  if(rate >= 20) return { label:'Surprisingly Sane', emoji:'👑', rate };
  return { label:'Morals Department', emoji:'🤓', rate };
}
export function playerList(room){
  if(!room?.players) return [];
  return Array.isArray(room.players) ? room.players : Object.values(room.players);
}
