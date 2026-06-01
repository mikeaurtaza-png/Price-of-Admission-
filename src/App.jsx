import React, { useMemo, useState } from 'react';
import { decks } from './data/cards.js';
import { hostLines, reactions } from './data/personality.js';
import { createInitialGame, resetVotes, resolveRound, sampleCard } from './utils/game.js';

function Devil({ line }) {
  return <div className="devil"><div className="devil-face">😈</div><div className="devil-bubble">{line}</div></div>;
}

function Marquee() {
  return <div className="marquee"><div>⚠️ THIS IS NOT THERAPY • SCREENSHOTS ARE FOREVER • TRUST NO ONE • THE ROOM IS COOKED • ⚠️</div></div>;
}

function DoodleLayer() { return <div className="doodle-layer" aria-hidden="true" />; }

function Landing({ game, setGame }) {
  return <main className="screen landing-screen">
    <DoodleLayer /><Marquee />
    <section className="hero-sticker">
      <div className="logo-mascot">😈💸</div>
      <h1>THE PRICE<br/>OF ADMISSION</h1>
      <p className="tagline">SELL YOUR SOUL. JUDGE YOUR FRIENDS. REGRET EVERYTHING.</p>
      <p className="subtag">The multiplayer party game where you sell your soul, judge your friends, and get publicly roasted by a chaotic little robot.</p>
      <div className="hero-actions">
        <button className="btn btn-pink wobble" onClick={() => setGame(g => ({ ...g, phase: 'lobby' }))}>START THE CHAOS</button>
        <button className="btn btn-green" onClick={() => setGame(g => ({ ...g, phase: 'phone' }))}>JOIN A ROOM</button>
      </div>
    </section>
    <section className="fake-reviews">
      <div>★★★★★<br/><b>“Ended a friendship in 3 rounds.”</b><span>- Tony</span></div>
      <div>★★★★★<br/><b>“We should not have played this.”</b><span>- Melissa</span></div>
      <div>★★★★★<br/><b>“My wife learned too much.”</b><span>- Mike</span></div>
    </section>
  </main>;
}

function Lobby({ game, setGame }) {
  const toggleDeck = (id) => setGame(g => ({ ...g, selectedDecks: g.selectedDecks.includes(id) ? g.selectedDecks.filter(d => d !== id) : [...g.selectedDecks, id] }));
  return <main className="screen lobby-screen">
    <DoodleLayer /><Marquee />
    <header className="top-bar"><div className="room-sticker">ROOM {game.roomCode}</div><button className="mini-btn" onClick={() => setGame(g => ({ ...g, phase: 'landing' }))}>BACK</button></header>
    <Devil line="Pick your poison. Some of these should probably require a waiver." />
    <h2 className="page-title">CHOOSE YOUR BAD IDEAS</h2>
    <div className="ticket-grid">
      {decks.map(deck => <button key={deck.id} className={`ticket ${game.selectedDecks.includes(deck.id) ? 'selected' : ''}`} style={{ '--accent': deck.color, transform: `rotate(${deck.tilt})` }} onClick={() => toggleDeck(deck.id)}>
        <span className="ticket-emoji">{deck.emoji}</span><span>{deck.name}</span>{deck.extreme && <small>WARNING: UNHINGED</small>}
      </button>)}
    </div>
    <div className="lobby-bottom">
      <div className="avatar-row">{game.players.map(p => <span className="avatar-chip" key={p.id}>{p.avatar}<b>{p.name}</b></span>)}</div>
      <button className="btn btn-yellow giant" onClick={() => setGame(g => ({ ...g, phase: 'question', card: sampleCard(g.usedCards) }))}>START THE DAMAGE</button>
    </div>
  </main>;
}

function PlayerBar({ players }) {
  return <div className="player-bar">{players.map(p => <div key={p.id} className={`player-dot ${p.locked ? 'locked' : ''}`}><span>{p.avatar}</span><b>{p.name}</b>{p.locked && <em>✓</em>}</div>)}</div>;
}

function GameCard({ card }) {
  return <section className="game-card slam">
    <div className="category-sticker">{card.emoji} {card.deck}</div>
    <div className="perk-box"><span>YOU GET</span><h2>{card.reward}</h2></div>
    <div className="but-burst">💥 BUT 💥</div>
    <div className="catch-box"><h3>{card.catch}</h3></div>
  </section>;
}

function QuestionScreen({ game, setGame }) {
  const lockedCount = game.players.filter(p => p.locked).length;
  const autoVote = () => setGame(g => ({ ...g, players: g.players.map((p, i) => ({ ...p, locked: true, vote: i % 3 === 0 ? 'no' : 'deal', prediction: Math.min(8, Math.max(0, 5 + (i % 3) - 1)) })) }));
  const reveal = () => setGame(g => { const result = resolveRound(g); return { ...g, phase: 'reveal', players: result.updatedPlayers, lastReveal: result, revealLine: result.revealLine, hostLine: result.roast }; });
  return <main className="screen game-screen">
    <DoodleLayer /><Marquee />
    <header className="top-bar"><div className="room-sticker">ROOM {game.roomCode}</div><div className="lock-count">{lockedCount}/{game.players.length} LOCKED IN</div><button className="mini-btn" onClick={() => setGame(g => ({ ...g, phase: 'phone' }))}>PHONE VIEW</button></header>
    <Devil line={game.hostLine} />
    <GameCard card={game.card} />
    <div className="host-actions"><button className="btn btn-green" onClick={autoVote}>DEMO: LOCK EVERYONE</button><button className="btn btn-pink" onClick={reveal}>EXPOSE THE ROOM</button></div>
    <FloatingReactions reactions={game.floatingReactions} />
    <PlayerBar players={game.players} />
  </main>;
}

function FloatingReactions({ reactions }) {
  return <div className="float-zone">{reactions.slice(-12).map(r => <span key={r.id} style={{ left: `${r.x}%` }}>{r.emoji}</span>)}</div>;
}

function RevealScreen({ game, setGame }) {
  const nextRound = () => setGame(g => {
    if (g.round >= g.maxRounds) return { ...g, phase: 'damage-report' };
    const next = sampleCard(g.usedCards);
    return { ...g, phase: 'question', round: g.round + 1, players: resetVotes(g.players), card: next, usedCards: [...g.usedCards, next.id], hostLine: hostLines[Math.floor(Math.random()*hostLines.length)], floatingReactions: [] };
  });
  const r = game.lastReveal || { yesCount: 0, noCount: 0, roast: game.hostLine };
  return <main className="screen reveal-screen">
    <DoodleLayer />
    <div className="siren">{game.revealLine}</div>
    <div className="mega-number"><span>{r.yesCount}</span> OF {game.players.length}</div>
    <h2>TOOK THE DEAL</h2>
    <div className="roast-card">😈 {r.roast}</div>
    <div className="score-strip">{game.players.slice(0, 8).map((p, i) => <div key={p.id}><b>#{i+1}</b> {p.avatar} {p.name}<span>{p.score}</span></div>)}</div>
    <button className="btn btn-yellow giant" onClick={nextRound}>{game.round >= game.maxRounds ? 'VIEW THE DAMAGE REPORT' : 'NEXT BAD IDEA'}</button>
  </main>;
}

function PhoneController({ game, setGame }) {
  const [playerId, setPlayerId] = useState(game.players[0].id);
  const player = game.players.find(p => p.id === playerId) || game.players[0];
  const [step, setStep] = useState('vote');
  const [vote, setVote] = useState(player.vote || null);
  const [prediction, setPrediction] = useState(player.prediction ?? 4);
  const addReaction = (emoji) => setGame(g => ({ ...g, floatingReactions: [...g.floatingReactions, { id: Date.now() + Math.random(), emoji, x: 8 + Math.random() * 84 }] }));
  const lockIn = () => { setGame(g => ({ ...g, players: g.players.map(p => p.id === playerId ? { ...p, vote, prediction, locked: true } : p) })); setStep('locked'); };
  return <main className="phone-screen">
    <DoodleLayer />
    <div className="phone-top"><select value={playerId} onChange={e => { setPlayerId(e.target.value); setStep('vote'); }}>{game.players.map(p => <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>)}</select><span>ROOM {game.roomCode}</span></div>
    <div className="phone-card">
      <div className="category-sticker small">{game.card.emoji} {game.card.deck}</div>
      <h1>{step === 'vote' ? 'MAKE THE CALL' : step === 'predict' ? 'JUDGE THE ROOM' : 'LOCKED IN'}</h1>
      {step !== 'locked' ? <><p className="phone-reward">{game.card.reward}</p><div className="but-burst phone">BUT</div><p className="phone-catch">{game.card.catch}</p></> : <div className="locked-panel"><div>✓</div><h2>WAITING FOR THE CARNAGE</h2><p>{game.players.filter(p=>p.locked).length}/{game.players.length} locked in</p></div>}
    </div>
    {step === 'vote' && <div className="phone-actions"><button className="btn btn-green" onClick={() => { setVote('deal'); setStep('predict'); }}>💰 TAKE THE MONEY</button><button className="btn btn-pink" onClick={() => { setVote('no'); setStep('predict'); }}>😇 KEEP DIGNITY</button></div>}
    {step === 'predict' && <div className="predict-card"><h2>HOW MANY TAKE IT?</h2><div className="number-grid">{Array.from({length: game.players.length + 1}, (_, i) => <button key={i} className={prediction === i ? 'chosen' : ''} onClick={() => setPrediction(i)}>{i}</button>)}</div><button className="btn btn-yellow giant" onClick={lockIn}>LOCK IT IN</button></div>}
    <div className="reaction-pad">{reactions.map(emoji => <button key={emoji} onClick={() => addReaction(emoji)}>{emoji}</button>)}</div>
    <button className="mini-btn full" onClick={() => setGame(g => ({ ...g, phase: 'question' }))}>BACK TO TV VIEW</button>
  </main>;
}

function DamageReport({ game, setGame }) {
  return <main className="screen report-screen"><DoodleLayer /><h1>THE DAMAGE REPORT</h1><div className="report-grid">{game.players.map(p => <div className="report-card" key={p.id}><div className="big-avatar">{p.avatar}</div><h2>{p.name}</h2><h3>{p.archetype}</h3><p>Sellout Rate: {Math.round((p.sellout / Math.max(1, game.maxRounds)) * 100)}%</p><p>Chaos Rating: {Math.min(99, 20 + p.chaos * 9)}%</p><b>{p.score} POINTS</b></div>)}</div><button className="btn btn-pink giant" onClick={() => setGame(createInitialGame())}>PLAY AGAIN, MAKE WORSE CHOICES</button></main>;
}

export default function App() {
  const [game, setGame] = useState(() => createInitialGame());
  const view = useMemo(() => new URLSearchParams(window.location.search).get('view'), []);
  if (view === 'phone' && game.phase !== 'phone') return <PhoneController game={game} setGame={setGame} />;
  if (game.phase === 'landing') return <Landing game={game} setGame={setGame} />;
  if (game.phase === 'lobby') return <Lobby game={game} setGame={setGame} />;
  if (game.phase === 'phone') return <PhoneController game={game} setGame={setGame} />;
  if (game.phase === 'reveal') return <RevealScreen game={game} setGame={setGame} />;
  if (game.phase === 'damage-report') return <DamageReport game={game} setGame={setGame} />;
  return <QuestionScreen game={game} setGame={setGame} />;
}
