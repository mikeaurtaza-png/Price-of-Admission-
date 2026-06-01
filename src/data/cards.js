const rewards = [
  'You get $10,000 every month forever.',
  'You never get another hangover again.',
  'You get VIP seats to every concert and sporting event for life.',
  'You become instantly attractive to everyone you are interested in.',
  'You get your dream house fully paid off.',
  'You can delete any three embarrassing memories from someone else’s mind.',
  'You become famous overnight and everyone knows your name.',
  'You never have to work again.',
  'You get unlimited free vacations twice a year forever.',
  'You wake up with your dream body tomorrow.'
];

const partyPrices = [
  'Every group chat you are in gets one random screenshot from your camera roll every Friday.',
  'Your most-used emoji appears under your name in every serious conversation.',
  'Every time you brag, a tiny airhorn sound plays from your phone.',
  'One friend in the room gets to pick your outfit for every major event.',
  'Your phone autocorrects “lol” to “I am deeply insecure.”',
  'A random friend gets to write your birthday speech every year.',
  'Every time you lie, your phone loudly says “CAP.”',
  'Your search history appears on the nearest TV for five seconds once per party.',
  'Your worst old profile picture becomes your official ID photo.',
  'Every restaurant server knows your most embarrassing nickname.'
];

const nsfwPrices = [
  'Every ex gets a notification any time you flirt with someone new.',
  'Your most embarrassing late-night text appears on the nearest TV whenever you enter a party.',
  'Your dating app bio is rewritten by the drunkest person in this room once a month.',
  'Every romantic playlist you make is automatically shared with your family group chat.',
  'The room gets a push notification every time you send a risky text.',
  'Your phone loudly announces “down bad detected” whenever you open a dating app.',
  'One random friend gets to approve your next three date outfits.',
  'Your last five deleted messages become a dramatic audiobook narrated by a stranger.',
  'Every crush you have receives a thumbs-up emoji from your mom’s account.',
  'Your most chaotic DM is printed on a birthday cake at your next party.'
];

const chaosPrices = [
  'Every lie you have ever told becomes searchable by your friend group.',
  'One random friend can rename you in every contact list for a full year.',
  'Everyone in the room gets one anonymous question you must answer truthfully.',
  'A random friend gets control of your social media caption once a month.',
  'Your “I was just kidding” moments are ranked publicly at the end of every night.',
  'The room can vote to make you explain one suspicious story from your past.',
  'Every time you say “trust me,” a warning siren plays.',
  'Your confidence level appears above your head like a video game health bar.',
  'Your worst take from the night gets pinned on the TV until the next round.',
  'Your friends can force one dramatic apology speech per year.'
];

const apocalypsePrices = [
  'The group gets one anonymous button that reveals your most embarrassing secret once per year.',
  'Before you get the reward, the room privately predicts exactly how selfish you will be. Their predictions reveal first.',
  'One friend becomes permanently convinced you do not deserve any of it.',
  'Every person in the room gets to veto one of your future purchases forever.',
  'The TV displays a live “shame meter” whenever you enter the room.',
  'Your worst decision of the year becomes the title of your autobiography.',
  'Once a year, your friends can summon you to defend your life choices for ten minutes.',
  'Any time you say “I would never,” the game shows receipts.',
  'The group can assign you a new legal-sounding nickname for one full year.',
  'Your confidence gets narrated by a disappointed game-show host.'
];

const packs = [
  { mode:'party', icon:'🍺', category:'Bad Decisions', prices:partyPrices },
  { mode:'nsfw', icon:'🌶️', category:'Late Night Mode', prices:nsfwPrices },
  { mode:'chaos', icon:'🔥', category:'Group Chat Crimes', prices:chaosPrices },
  { mode:'apocalypse', icon:'☠️', category:'Friendship Enders', prices:apocalypsePrices }
];

export const CARDS = packs.flatMap(pack => rewards.flatMap((perk, i) => pack.prices.map((price, j) => ({
  id: `${pack.mode}-${i}-${j}`,
  mode: pack.mode,
  icon: pack.icon,
  category: pack.category,
  title: [
    'CAUGHT IN 4K','ABSOLUTE MENACE','EXPLAIN THIS','NO SHAME DETECTED','HUMANITY FAILED',
    'GROUP CHAT CRIME','DOWN HORRENDOUS','BAD IDEA FACTORY','EMOTIONAL DAMAGE','RED FLAG PARADE'
  ][(i+j)%10],
  perk,
  price,
  intensity: pack.mode === 'apocalypse' ? 6 : pack.mode === 'chaos' ? 5 : pack.mode === 'nsfw' ? 4 : 2
}))));

export const MODES = [
  { key:'party', icon:'🍺', label:'Bad Decisions', sub:'goofy party chaos' },
  { key:'nsfw', icon:'🌶️', label:'Late Night', sub:'goofy NSFW roast mode' },
  { key:'chaos', icon:'🔥', label:'Group Chat Crimes', sub:'friendship stress test' },
  { key:'apocalypse', icon:'☠️', label:'Friendship Enders', sub:'extreme insane mode' }
];

export const HOST_LINES = [
  'Let’s find out who has absolutely no shame.',
  'The room is about to become untrustworthy.',
  'Somebody is about to make a business decision with zero morals.',
  'Please remember: screenshots are forever.',
  'Humanity is on trial and the jury is messy.',
  'This is not therapy, but it may reveal a lot.',
  'One of you is clicking DEAL way too fast.',
  'The group chat will be discussing this later.',
  'Friendships have survived worse. Probably.',
  'Someone here is a professional problem.'
];

export const REVEAL_LINES = [
  'HUMANITY HAS FAILED',
  'WE ARE COOKED',
  'NO SHAME DETECTED',
  'ABSOLUTELY CONCERNING',
  'THE ROOM NEEDS SUPERVISION',
  'GROUP CHAT EVIDENCE OBTAINED',
  'THEY REALLY DID THAT',
  'A TERRIBLE DAY FOR MORALS'
];
