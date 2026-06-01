import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Flame, QrCode, Smartphone, Tv, Users, Lock, Zap, Trophy, Skull } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CARDS, MODES } from './data/cards';
import { getRandomCard, makeRoomCode, scorePrediction, summarizePlayer } from './lib/game';

const MAX_PLAYERS = 8;
const STARTERS = ['Mike','Melissa','Chaos Chris','Sarah','Tony','Jess','Rob','Nina'];

export default function App(){
  const [view,setView] = useState('home');
  const [room,setRoom] = useState(null);
  const [playerName,setPlayerName] = useState('');
  const [activePlayerId,setActivePlayerId] = useState(null);

  function createRoom(){
    const code = makeRoomCode();
    setRoom({ code, mode:'party', phase:'lobby', round:0, players:[], usedIds:[], card:null, votes:{}, predictions:{}, scores:{}, history:[] });
    setView('tv');
  }

  function demoRoom(){
    const players = STARTERS.map((name,i)=>({ id:'p'+i, name, avatar:['🦹','😈','🤑','🫣','🔥','💀','👑','🍸'][i], locked:false }));
    const code = makeRoomCode();
    setRoom({ code, mode:'party', phase:'lobby', round:0, players, usedIds:[], card:null, votes:{}, predictions:{}, scores:Object.fromEntries(players.map(p=>[p.id,0])), history:[] });
    setView('tv');
  }

  function joinDemo(){
    if(!room || !playerName.trim()) return;
    if(room.players.length >= MAX_PLAYERS) return alert('Room is full.');
    const id = crypto.randomUUID();
    const player = { id, name:playerName.trim(), avatar:'🔥', locked:false };
    setRoom(r=>({ ...r, players:[...r.players, player], scores:{...r.scores,[id]:0} }));
    setActivePlayerId(id); setView('phone');
  }

  function setMode(mode){ setRoom(r=>({...r, mode})); }
  function startRound(){
    setRoom(r=>{ const card = getRandomCard(CARDS, r.usedIds, r.mode); return { ...r, phase:'voting', round:r.round+1, card, votes:{}, predictions:{}, usedIds:[...r.usedIds, card.id] }; });
  }
  function submitVote(pid, vote, prediction){
    setRoom(r=>({ ...r, votes:{...r.votes,[pid]:vote}, predictions:{...r.predictions,[pid]:Number(prediction)} }));
  }
  function reveal(){
    setRoom(r=>{
      const yesCount = Object.values(r.votes).filter(v=>v==='deal').length;
      const nextScores = {...r.scores};
      r.players.forEach(p=>{ nextScores[p.id] = (nextScores[p.id]||0) + scorePrediction(r.predictions[p.id] ?? 0, yesCount); });
      const entry = { card:r.card, votes:r.votes, predictions:r.predictions, yesCount, scores:nextScores };
      return { ...r, phase:'reveal', scores:nextScores, history:[entry,...r.history].slice(0,20) };
    });
  }

  if(view==='home') return <Home onCreate={createRoom} onDemo={demoRoom} />;
  if(view==='tv') return <TV room={room} setView={setView} setMode={setMode} startRound={startRound} reveal={reveal} />;
  return <Phone room={room} playerId={activePlayerId} setView={setView} submitVote={submitVote} joinDemo={joinDemo} playerName={playerName} setPlayerName={setPlayerName} />;
}

function Home({onCreate,onDemo}){
  return <main className="home"><div className="hero"><div className="badge"><Skull size={18}/> 18+ private party MVP</div><h1>The Price<br/>of Admission</h1><p>A premium TV + phone party game where friends make terrible deals, predict each other, and expose the room.</p><div className="actions"><button onClick={onCreate}>Create Empty Room</button><button className="ghost" onClick={onDemo}>Launch 8-Player Demo</button></div></div><div className="glass"><h2>Built for</h2><p><Tv/> TV game board</p><p><Smartphone/> phone controllers</p><p><Users/> up to 8 players</p><p><Flame/> Party / NSFW / Chaos / Apocalypse</p></div></main>
}

function TV({room,setView,setMode,startRound,reveal}){
  const joinUrl = `${location.origin}?room=${room.code}`;
  const locked = Object.keys(room.votes).length;
  const yesCount = Object.values(room.votes).filter(v=>v==='deal').length;
  const sorted = [...room.players].sort((a,b)=>(room.scores[b.id]||0)-(room.scores[a.id]||0));
  return <main className="tv"><header><div><div className="eyebrow">ROOM {room.code}</div><h1>The Price of Admission</h1></div><div className="topActions"><button onClick={()=>setView('phone')}>Phone View</button><button onClick={()=>setView('home')}>Exit</button></div></header>
    <section className="layout"><aside className="panel"><div className="qr"><QRCodeSVG value={joinUrl} size={130}/><span>Scan to join</span></div><h3>Players {room.players.length}/8</h3>{room.players.map(p=><div className="player" key={p.id}><span>{p.avatar}</span>{p.name}<b>{room.scores[p.id]||0}</b></div>)}<div className="modes">{MODES.map(m=><button key={m.key} className={room.mode===m.key?'active':''} onClick={()=>setMode(m.key)}>{m.label}<small>{m.sub}</small></button>)}</div></aside>
    <section className="stage"><AnimatePresence mode="wait">{room.phase==='lobby' && <motion.div className="card big" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} exit={{opacity:0}}><Crown/><h2>Lobby Ready</h2><p>Choose a mode, fill the room, then start the first dilemma.</p><button onClick={startRound}>Start Round</button></motion.div>}
      {room.phase==='voting' && <motion.div className="card dilemma" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}><div className="category">{room.card.category}</div><h2>{room.card.perk}</h2><div className="but">BUT</div><p>{room.card.price}</p><div className="lockbar"><Lock/> {locked}/{room.players.length} locked in</div><button disabled={locked<room.players.length} onClick={reveal}>Reveal the Room</button></motion.div>}
      {room.phase==='reveal' && <motion.div className="card reveal" initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} exit={{opacity:0}}><Zap/><h2>{yesCount} of {room.players.length} took the deal</h2><p>{Math.round((yesCount/Math.max(room.players.length,1))*100)}% room acceptance rate</p><div className="votegrid">{room.players.map(p=><div className={room.votes[p.id]==='deal'?'yes':'no'} key={p.id}>{p.name}<b>{room.votes[p.id]==='deal'?'DEAL':'NO DEAL'}</b><small>guessed {room.predictions[p.id] ?? 0}</small></div>)}</div><button onClick={startRound}>Next Round</button></motion.div>}</AnimatePresence></section>
    <aside className="panel"><h3><Trophy/> Scoreboard</h3>{sorted.map((p,i)=><div className="rank" key={p.id}><b>#{i+1}</b><span>{p.name}</span><strong>{room.scores[p.id]||0}</strong></div>)}<h3>Night Profiles</h3>{room.players.slice(0,4).map(p=><p className="profile" key={p.id}>{p.name}: {summarizePlayer(p,room.history)}</p>)}</aside></section></main>
}

function Phone({room,playerId,setView,submitVote,joinDemo,playerName,setPlayerName}){
  const player = room?.players.find(p=>p.id===playerId);
  const [vote,setVote] = useState('deal');
  const [prediction,setPrediction] = useState(4);
  if(!player) return <main className="phone"><div className="phoneCard"><h1>Join Room</h1><p>Demo local join. In Firebase mode this joins by room code.</p><input value={playerName} onChange={e=>setPlayerName(e.target.value)} placeholder="Your name"/><button onClick={joinDemo}>Join Game</button><button className="ghost" onClick={()=>setView('tv')}>Back to TV</button></div></main>;
  const submitted = room.votes[player.id];
  return <main className="phone"><div className="phoneTop"><b>{player.avatar} {player.name}</b><span>Room {room.code}</span></div>{room.phase==='voting'?<div className="phoneCard"><div className="category">{room.card.category}</div><h2>Make the call</h2><p>{room.card.perk}</p><p><b>BUT</b> {room.card.price}</p><div className="choice"><button className={vote==='deal'?'pick':''} onClick={()=>setVote('deal')}>DEAL</button><button className={vote==='no'?'pick':''} onClick={()=>setVote('no')}>NO DEAL</button></div><label>How many players take it? <b>{prediction}</b></label><input type="range" min="0" max={room.players.length} value={prediction} onChange={e=>setPrediction(e.target.value)}/><button disabled={submitted} onClick={()=>submitVote(player.id,vote,prediction)}>{submitted?'Locked In':'Lock It In'}</button></div>:<div className="phoneCard"><h2>Waiting for TV</h2><p>Score: {room.scores[player.id]||0}</p><button className="ghost" onClick={()=>setView('tv')}>Open TV View</button></div>}</main>
}
