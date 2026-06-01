export const decks = [
  { id: 'bad-decisions', emoji: '🍺', name: 'BAD DECISIONS', color: '#39FF14', tilt: '-3deg' },
  { id: 'caught-4k', emoji: '📱', name: 'CAUGHT IN 4K', color: '#FF007F', tilt: '2deg' },
  { id: 'money-grab', emoji: '💰', name: 'SHAMELESS MONEY GRAB', color: '#FFF000', tilt: '-1deg' },
  { id: 'red-flags', emoji: '🚩', name: 'WALKING RED FLAG', color: '#FF3131', tilt: '3deg' },
  { id: 'friendship-ender', emoji: '💀', name: 'FRIENDSHIP ENDER', color: '#9B5CFF', tilt: '-2deg' },
  { id: 'down-horrendous', emoji: '🌶️', name: 'DOWN HORRENDOUS', color: '#00E5FF', tilt: '1deg' },
  { id: 'public-disaster', emoji: '🤡', name: 'PUBLIC DISASTER', color: '#FF8A00', tilt: '-4deg' },
  { id: 'no-shame', emoji: '😈', name: 'NO SHAME', color: '#FF007F', tilt: '4deg' },
  { id: 'apocalypse', emoji: '☠️', name: 'APOCALYPSE MODE', color: '#FF3131', tilt: '-1deg', extreme: true }
];

const rewards = [
  'You get VIP seats to every concert and sporting event for life.',
  'You receive $25,000 cash every month forever.',
  'You become impossibly attractive in every photo ever taken of you.',
  'You never get another hangover again.',
  'You get your dream body without exercising or dieting.',
  'You can erase any three embarrassing moments from everyone’s memory.',
  'You get unlimited first-class flights forever.',
  'You become famous enough that restaurants always give you the best table.',
  'You win a free luxury vacation twice a year forever.',
  'Every bill you receive is automatically paid by a mysterious billionaire.',
  'You always know when someone is lying to you.',
  'You gain the ability to mute any annoying person in real life for five minutes.',
  'You get a personal chef who makes anything you want instantly.',
  'Your phone battery never dies again.',
  'You become the funniest person in every room for one full year.'
];

const catches = [
  'Every ex gets a push notification whenever you flirt with someone.',
  'Your worst group chat message appears on the nearest TV once per week.',
  'A tiny robot follows you around yelling your private thoughts at bad times.',
  'Your browser history becomes a karaoke song at every birthday party you attend.',
  'Your mom gets a weekly recap titled “Things You Should Ask About.”',
  'Every time you lie, your phone loudly plays a clown horn.',
  'Your dating app bio is rewritten by the friend in this room with the least shame.',
  'You must introduce yourself at parties using your most embarrassing nickname.',
  'Every serious conversation begins with a dramatic air horn.',
  'Your most recent selfie is projected behind you during every work meeting.',
  'One random friend gets to post from your account for exactly 90 seconds.',
  'Your phone auto-corrects “sorry” to “I regret nothing.”',
  'Every compliment you receive triggers a public receipt of your last bad decision.',
  'You can only leave parties after everyone votes on whether you were weird.',
  'Your family group chat receives one completely unexplained screenshot per month.'
];

const deckSpecific = {
  'bad-decisions': [
    ['Never get another hangover.', 'Every drunk text you have ever sent becomes a dramatic reading at your next party.'],
    ['You get unlimited free drinks forever.', 'Every bartender announces your worst life choice before serving you.'],
    ['You become unbeatable at party games.', 'You must wear a sash that says “TOO MUCH CONFIDENCE” every time you play.']
  ],
  'caught-4k': [
    ['Your phone storage becomes unlimited forever.', 'Every deleted photo reappears as a slideshow during dinner.'],
    ['You can unsend any message within 24 hours.', 'The person still gets a notification that says “they panicked.”'],
    ['Your selfies always look perfect.', 'The unedited versions are available to everyone in this room.']
  ],
  'money-grab': [
    ['$1 million appears in your bank account today.', 'Every purchase you make is read out loud by a disappointed game show host.'],
    ['Your rent or mortgage is paid forever.', 'Your neighbors get to vote on your outfit every morning.'],
    ['You win $500 every time you say “honestly.”', 'A lie detector sound plays if the room does not believe you.']
  ],
  'red-flags': [
    ['You become everyone’s ideal type.', 'Your red flags are printed on a bright yellow warning label across your shirt.'],
    ['Every date thinks you are charming.', 'Their best friend receives a detailed report of your worst habits.'],
    ['You can tell who has a crush on you.', 'They can also see exactly how desperate you are.']
  ],
  'friendship-ender': [
    ['You win a free group vacation for everyone here.', 'You alone choose the rooms, beds, and who has to sleep near the bathroom.'],
    ['You get to delete one argument from your friend group forever.', 'But everyone learns who you secretly blamed.'],
    ['You never pay for dinner with friends again.', 'The app announces who in the room is most annoyed by this.']
  ],
  'down-horrendous': [
    ['You can make your crush text you first.', 'The message starts with “I have lowered my standards.”'],
    ['You become irresistible for one year.', 'Every flirt attempt is narrated by your most judgmental friend.'],
    ['You always know the perfect thing to say.', 'But it arrives as a push notification from your ex.']
  ],
  'public-disaster': [
    ['You become famous overnight.', 'Your most embarrassing childhood photo is your official headshot.'],
    ['You get invited to every exclusive party.', 'A spotlight follows you whenever you say something awkward.'],
    ['You become a viral legend.', 'Nobody knows why, and the rumor is worse than the truth.']
  ],
  'no-shame': [
    ['You can get out of any awkward conversation instantly.', 'A trapdoor sound plays and everyone knows you bailed.'],
    ['You become completely immune to embarrassment.', 'Everyone else still feels embarrassed for you.'],
    ['You get one free pass from consequences every month.', 'The app announces “NO SHAME DETECTED” whenever you use it.']
  ],
  'apocalypse': [
    ['$10 million tax free today.', 'Every person in this room gets to ask you one question you must answer honestly on the TV.'],
    ['You can see the future for 24 hours.', 'The only future it shows is every way your group chat could roast you.'],
    ['You become untouchably rich.', 'Your friends get a button that can play your worst voice memo in public once a year.']
  ]
};

export function buildCards(count = 450) {
  const cards = [];
  let id = 1;
  for (const deck of decks) {
    for (const pair of deckSpecific[deck.id] || []) {
      cards.push({ id: `card-${id++}`, deckId: deck.id, deck: deck.name, emoji: deck.emoji, reward: pair[0], catch: pair[1], heat: deck.extreme ? 'EXTREME' : deck.id.includes('down') || deck.id.includes('no') ? 'NSFW-ish' : 'PARTY' });
    }
  }
  while (cards.length < count) {
    const deck = decks[(id + cards.length) % decks.length];
    const reward = rewards[(id * 7 + cards.length) % rewards.length];
    const catchText = catches[(id * 11 + cards.length) % catches.length];
    cards.push({ id: `card-${id++}`, deckId: deck.id, deck: deck.name, emoji: deck.emoji, reward, catch: catchText, heat: deck.extreme ? 'EXTREME' : 'PARTY' });
  }
  return cards;
}

export const cards = buildCards();
