import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, QrCode, Smartphone, Tv, Users, Lock, Zap, Trophy, Skull, Sparkles, Flame } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CARDS, MODES, HOST_LINES, REVEAL_LINES } from './data/cards';
import { getRandomCard, makeRoomCode, scorePrediction, archetypeFor, playerList, pick } from './lib/game';
import { firebaseEnabled, db, ref, set, update, onValue, get, serverTimestamp } from './lib/firebase';

const MAX_PLAYERS = 8;
const AVATARS = ['😈','🤡','🔥','💀','👑','🦝','🐍','🍺','🌶️','🚩','🫣','🧨'];
const STARTERS = ['Mike','Melissa','Chaos Chris','Sarah','Tony','Jess','Rob','Nina'];
const REACTIONS = ['😂','💀','😳','🤮','🔥'];

function emptyRoom(code){
  return { code, mode:'party', phase:'lobby', round:0, players:{}, usedIds:[], card:null, votes:{}, predictions:{}, suspects:{}, scores:{}, history:[], hostLine:pick(HOST_LINES), createdAt:Date.now() };
}

export default function App(){
  const [view,setView] = useState('home');
  const [room,setRoom] = useState(null);
  const [playerId,setPlayerId] = useState(localStorage.getItem('poa_player_id') || '');
  const [joinCode,setJoinCode] = useState('');
  const [playerName,setPlayerName] = useState('');
  const [localMode,setLocalMode] = useState(!firebaseEnabled);

  useEffect(()=>{
    const params = new URLSearchParams(location.search);
    const code = params.get('room');
    if(code){ setJoinCode(code.toUpperCase()); setView('phone'); }
  },[]);

  useEffect(()=>{
    if(!firebaseEnabled || !room?.code || localMode) return;
    const unsub = onValue(ref(db, `rooms/${room.code}`), snap => {
      if(snap.exists()) setRoom(snap.val());
    });
    return () => unsub();
  },[room?.code, localMode]);

  async function createRoom(){
    const code = makeRoomCode();
    const next = emptyRoom(code);
    if(firebaseEnabled){ await set(ref(db, `rooms/${code}`), { ...next, createdAt:serverTimestamp() }); setLocalMode(false); }
    setRoom(next); setView('tv'); history.replaceState(null,'',`/?room=${code}&tv=1`);
  }

  function demoRoom(){
    const code = makeRoomCode();
    const players = Object.fromEntries(STARTERS.map((name,i)=>[`p${i}`,{ id:`p${i}`, name, avatar:AVATARS[i], joinedAt:Date.now() }]));
    const scores = Object.fromEntries(Object.keys(players).map(id=>[id,0]));
    setLocalMode(true); setRoom({ ...emptyRoom(code), players, scores }); setView('tv');
  }

  async function joinRoom(){
    const code = joinCode.trim().toUpperCase();
    if(!code || !playerName.trim()) return;
    const id = playerId || crypto.randomUUID();
    localStorage.setItem('poa_player_id', id); setPlayerId(id);
    const avatar = AVATARS[Math.floor(Math.random()*AVATARS.length)];
    if(firebaseEnabled && !localMode){
      const snap = await get(ref(db, `rooms/${code}`));
      if(!snap.exists()) return alert('Room not found. Check the code on the TV.');
      const remote = snap.val();
      if(playerList(remote).length >= MAX_PLAYERS && !remote.players?.[id]) return alert('Room is full.');
      await update(ref(db, `rooms/${code}/players/${id}`), { id, name:playerName.trim(), avatar, joinedAt:serverTimestamp() });
      await update(ref(db, `rooms/${code}/scores`), { [id]: remote.scores?.[id] || 0 });
      setRoom(remote); setView('phone'); history.replaceState(null,'',`/?room=${code}&controller=1`);
    } else if(room?.code === code){
      if(playerList(room).length >= MAX_PLAYERS && !room.players?.[id]) return alert('Room is full.');
      setRoom(r=>({ ...r, players:{...r.players,[id]:{ id, name:playerName.trim(), avatar, joinedAt:Date.now() }}, scores:{...r.scores,[id]:r.scores?.[id] || 0} }));
      setView('phone');
    } else alert('Local demo only works in the same browser. Add Firebase env vars for real phones.');
  }

  async function patchRoom(patch){
    if(firebaseEnabled && !localMode && room?.code) await update(ref(db, `rooms/${room.code}`), patch);
    setRoom(r=>({ ...r, ...patch }));
  }

  async function setMode(mode){ await patchRoom({ mode }); }

  async function startRound(){
    const card = getRandomCard(CARDS, room.usedIds || [], room.mode);
    await patchRoom({ phase:'voting', round:(room.round||0)+1, card, votes:{}, predictions:{}, suspects:{}, reactions:{}, usedIds:[...(room.usedIds||[]), card.id], hostLine:pick(HOST_LINES) });
  }

  async function submitVote(id, vote, prediction, suspect){
    const updates = { [`votes/${id}`]:vote, [`predictions/${id}`]:Number(prediction), [`suspects/${id}`]:suspect || '' };
    if(firebaseEnabled && !localMode) await update(ref(db, `rooms/${room.code}`), updates);
    setRoom(r=>({ ...r, votes:{...r.votes,[id]:vote}, predictions:{...r.predictions,[id]:Number(prediction)}, suspects:{...r.suspects,[id]:suspect||''} }));
  }

  async function sendReaction(id, emoji){
    const key = `${Date.now()}_${id}`;
    const reaction = { id:key, playerId:id, emoji, at:Date.now() };
    if(firebaseEnabled && !localMode) await update(ref(db, `rooms/${room.code}/reactions/${key}`), reaction);
    setRoom(r=>({ ...r, reactions:{...(r.reactions||{}), [key]:reaction} }));
  }

  async function reveal(){
    const players = playerList(room);
    const yesCount = Object.values(room.votes||{}).filter(v=>v==='deal').length;
    const nextScores = {...(room.scores||{})};
    players.forEach(p=>{ nextScores[p.id] = (nextScores[p.id]||0) + scorePrediction(room.predictions?.[p.id] ?? 0, yesCount); });
    const entry = { card:room.card, votes:room.votes||{}, predictions:room.predictions||{}, suspects:room.suspects||{}, yesCount, scores:nextScores, at:Date.now() };
    await patchRoom({ phase:'reveal', scores:nextScores, history:[entry,...(room.history||[])].slice(0,40), revealLine:pick(REVEAL_LINES) });
  }

  if(view==='home') return <Home onCreate={createRoom} onDemo={demoRoom} firebaseEnabled={firebaseEnabled} />;
  if(view==='tv' && room) return <TV room={room} setView={setView} setMode={setMode} startRound={startRound} reveal={reveal} />;
  return <Phone room={room} playerId={playerId} joinCode={joinCode} setJoinCode={setJoinCode} playerName={playerName} setPlayerName={setPlayerName} joinRoom={joinRoom} submitVote={submitVote} sendReaction={sendReaction} setView={setView} />;
}

function Home({onCreate,onDemo,firebaseEnabled}){
  return <main className="home">
    <motion.div className="hero" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
      <div className="badge"><Skull size={18}/> 18+ goofy NSFW party chaos</div>
      <h1>The Price<br/>of Admission</h1>
      <p>A TV + phone party game where friends make awful deals, predict the room, and get roasted by a chaotic little host.</p>
      <div className="actions"><button onClick={onCreate}>Create Room</button><button className="ghost" onClick={onDemo}>Launch 8-Player Demo</button></div>
      <small className="status">{firebaseEnabled ? 'Firebase detected: real phones can join.' : 'Demo mode: add Firebase env vars for real phones.'}</small>
    </motion.div>
    <motion.div className="glass" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}><h2>Version 2</h2><p><Tv/> Pristine TV stage layout</p><p><Smartphone/> Fun phone controller flow</p><p><Users/> Up to 8 players</p><p><Flame/> Reactions, roasts, reveals</p></motion.div>
  </main>
}

function TV({room,setView,setMode,startRound,reveal}){
  const players = playerList(room);
  const joinUrl = `${location.origin}?room=${room.code}&controller=1`;
  const locked = Object.keys(room.votes||{}).length;
  const yesCount = Object.values(room.votes||{}).filter(v=>v==='deal').length;
  const sorted = [...players].sort((a,b)=>(room.scores?.[b.id]||0)-(room.scores?.[a.id]||0));
  const reactions = Object.values(room.reactions||{}).slice(-12);
  const mostSuspected = getMostSuspected(room, players);

  return <main className="tvStage">
    <div className="ambient" />
    <header className="tvTop"><div><b>ROOM {room.code}</b><span>{locked}/{players.length || MAX_PLAYERS} LOCKED IN</span></div><button className="tiny" onClick={()=>setView('home')}>Exit</button></header>
    <div className="brand">😈 THE PRICE OF ADMISSION</div>
    <FloatingReactions reactions={reactions}/>
    <AnimatePresence mode="wait">
      {room.phase==='lobby' && <motion.section key="lobby" className="lobbyCard" initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.96}}>
        <div className="qrWrap"><QRCodeSVG value={joinUrl} size={190}/></div><h1>Scan to Join</h1><p>{players.length}/8 players in the room</p><div className="modeGrid">{MODES.map(m=><button key={m.key} className={room.mode===m.key?'active':''} onClick={()=>setMode(m.key)}><b>{m.icon} {m.label}</b><small>{m.sub}</small></button>)}</div><button className="start" disabled={!players.length} onClick={startRound}>Start the Damage</button>
      </motion.section>}
      {room.phase==='voting' && <motion.section key={room.card?.id} className="dilemmaCard" initial={{opacity:0,y:40,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-20}}>
        <motion.div className="shine" initial={{x:'-120%'}} animate={{x:'120%'}} transition={{delay:.35,duration:1.1}} />
        <div className="hostBubble">😈 {room.hostLine}</div><div className="category">{room.card.icon} {room.card.category}</div><h2>{room.card.title}</h2><p className="perk">{room.card.perk}</p><div className="but">BUT</div><p className="price">{room.card.price}</p><div className="lockbar"><Lock/> {locked}/{players.length} locked in</div><button className="expose" disabled={locked<players.length || !players.length} onClick={reveal}>Expose the Room</button>
      </motion.section>}
      {room.phase==='reveal' && <motion.section key="reveal" className="revealTakeover" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}}>
        <motion.div className="revealLine" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>{room.revealLine}</motion.div><motion.h1 initial={{scale:.7,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',bounce:.45}}>{yesCount} OF {players.length}</motion.h1><h2>TOOK THE DEAL</h2>{mostSuspected && <div className="suspected"><span>MOST SUSPECTED</span><b>{mostSuspected.avatar} {mostSuspected.name}</b><small>Actual vote: {(room.votes?.[mostSuspected.id] || 'no').toUpperCase()}</small></div>}<button onClick={startRound}>Next Round</button>
      </motion.section>}
    </AnimatePresence>
    <footer className="playerDock">{players.map(p=><motion.div key={p.id} className={(room.votes||{})[p.id]?'locked playerPill':'playerPill'} animate={(room.votes||{})[p.id]?{scale:[1,1.08,1]}:{}}><span>{p.avatar}</span><b>{p.name}</b>{(room.votes||{})[p.id] && <em>✓</em>}</motion.div>)}</footer>
    {room.phase==='reveal' && <aside className="scoreFlash"><h3>🏆 Scoreboard</h3>{sorted.map((p,i)=><div key={p.id}><span>#{i+1} {p.avatar} {p.name}</span><b>{room.scores?.[p.id]||0}</b></div>)}</aside>}
  </main>
}

function Phone({room,playerId,joinCode,setJoinCode,playerName,setPlayerName,joinRoom,submitVote,sendReaction,setView}){
  const players = playerList(room);
  const player = players.find(p=>p.id===playerId);
  const [vote,setVote] = useState('deal');
  const [prediction,setPrediction] = useState(0);
  const [suspect,setSuspect] = useState('');
  const [step,setStep] = useState(1);
  useEffect(()=>{ setPrediction(Math.ceil((players.length || 8)/2)); setSuspect(players[0]?.id || ''); setStep(1); },[room?.card?.id]);

  if(!player) return <main className="phoneFun"><div className="phonePanel join"><h1>😈 Join the Chaos</h1><p>Enter the room code on the TV and pick a name your friends can roast.</p><input value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="ROOM CODE"/><input value={playerName} onChange={e=>setPlayerName(e.target.value)} placeholder="Your chaotic nickname"/><button onClick={joinRoom}>Join Game</button></div></main>;

  const submitted = Boolean(room?.votes?.[player.id]);
  if(room?.phase !== 'voting') return <main className="phoneFun"><div className="phoneTop"><b>{player.avatar} {player.name}</b><span>Room {room?.code}</span></div><div className="phonePanel waiting"><h1>{room?.phase==='reveal'?'💀 Damage Report':'🍿 Waiting'}</h1><p>Score: {room?.scores?.[player.id]||0}</p><div className="reactionRow">{REACTIONS.map(r=><button key={r} onClick={()=>sendReaction(player.id,r)}>{r}</button>)}</div><button className="ghost" onClick={()=>setView('tv')}>Open TV View</button></div></main>;

  return <main className="phoneFun"><div className="phoneTop"><b>{player.avatar} {player.name}</b><span>Room {room.code}</span></div><AnimatePresence mode="wait">
    {submitted ? <motion.div key="locked" className="phonePanel lockedIn" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}><h1>✓ Locked In</h1><p>Waiting for the room to expose itself.</p><div className="reactionRow">{REACTIONS.map(r=><button key={r} onClick={()=>sendReaction(player.id,r)}>{r}</button>)}</div><small>{Object.keys(room.votes||{}).length}/{players.length} players locked</small></motion.div> :
    <motion.div key={step} className="phonePanel controller" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
      <div className="category">{room.card.icon} {room.card.category}</div>
      {step===1 && <><h1>Make the Call</h1><p className="miniPerk">{room.card.perk}</p><div className="but small">BUT</div><p>{room.card.price}</p><div className="choice"><button className={vote==='deal'?'pick deal':''} onClick={()=>setVote('deal')}>😈 DEAL</button><button className={vote==='no'?'pick no':''} onClick={()=>setVote('no')}>🤓 NO DEAL</button></div><button onClick={()=>setStep(2)}>Next</button></>}
      {step===2 && <><h1>How Many Fold?</h1><p>How many players take this deal?</p><div className="numberGrid">{Array.from({length:players.length+1},(_,i)=><button key={i} className={prediction===i?'pick':''} onClick={()=>setPrediction(i)}>{i}</button>)}</div><button onClick={()=>setStep(3)}>Next</button></>}
      {step===3 && <><h1>Who’s the Menace?</h1><p>Who is most likely to take it?</p><div className="suspectGrid">{players.map(p=><button key={p.id} className={suspect===p.id?'pick':''} onClick={()=>setSuspect(p.id)}>{p.avatar} {p.name}</button>)}</div><button className="lockButton" onClick={()=>submitVote(player.id,vote,prediction,suspect)}>LOCK IT IN</button></>}
    </motion.div>}
  </AnimatePresence></main>
}

function FloatingReactions({reactions}){ return <div className="floatLayer">{reactions.map((r,i)=><motion.span key={r.id} initial={{opacity:0,y:80,scale:.5,x:(i%5)*70-140}} animate={{opacity:[0,1,1,0],y:-260,scale:[.7,1.4,1.2],rotate:[0,8,-8]}} transition={{duration:3}}>{r.emoji}</motion.span>)}</div> }

function getMostSuspected(room, players){
  const counts = {};
  Object.values(room.suspects||{}).forEach(id=>{ if(id) counts[id]=(counts[id]||0)+1; });
  const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0];
  return players.find(p=>p.id===top);
}
