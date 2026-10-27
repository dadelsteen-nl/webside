/**
 * Original Dadelsteen seed copy (NL + EN). Placeholder content: replace in the admin before launch.
 */

type L = { nl: string; en: string }

export const categoriesContent: { slug: string; title: L }[] = [
  { slug: 'toestellen', title: { nl: 'Toestellen', en: 'Devices' } },
  { slug: 'accessoires', title: { nl: 'Accessoires', en: 'Accessories' } },
]

export const proS = {
  slug: 'imbody-pro-s',
  title: { nl: 'imbody Pro S', en: 'imbody Pro S' } as L,
  price: 549900, // cents (EUR 5.499,00) - placeholder
  short: {
    nl: 'Een compleet krachtstation achter een 43 inch spiegel. Digitale weerstand tot 120 kg, een AI-coach die met je meebeweegt en vijf trainingsstanden voor elk doel.',
    en: 'A complete strength studio behind a 43 inch mirror. Digital resistance up to 120 kg, an AI coach that moves with you and five training modes for every goal.',
  } as L,
  description: {
    nl: [
      'De imbody Pro S brengt de rust van een boetiekstudio in je woonkamer. Wanneer je niet traint, is het een elegante spiegel. Zodra je begint, verandert het in een persoonlijke coach met een 43 inch aanraakscherm.',
      'Digitale weerstand tot 120 kg voelt soepel en stil, zonder gewichtsschijven of rommel. De AI-coach volgt je houding, telt je herhalingen en past de belasting aan op jouw dag en jouw niveau.',
      'Kies uit vijf trainingsstanden, van opbouwende krachttraining tot mobiliteit en herstel. Bij elke bestelling zijn bezorging en installatie in Nederland en Belgie inbegrepen.',
    ],
    en: [
      'The imbody Pro S brings the calm of a boutique studio into your living room. When you are not training it is an elegant mirror. The moment you begin it becomes a personal coach with a 43 inch touchscreen.',
      'Digital resistance up to 120 kg feels smooth and silent, with no weight plates and no clutter. The AI coach follows your form, counts your repetitions and adjusts the load to your day and your level.',
      'Choose from five training modes, from progressive strength to mobility and recovery. Every order includes delivery and installation in the Netherlands and Belgium.',
    ],
  },
  badges: [
    { nl: 'Gratis levering & installatie', en: 'Free delivery & installation' },
    { nl: '2 jaar garantie', en: '2 year warranty' },
    { nl: '14 dagen bedenktijd', en: '14 day return period' },
  ] as L[],
  specs: [
    { label: { nl: 'Scherm', en: 'Display' }, value: { nl: '43 inch aanraakscherm', en: '43 inch touchscreen' } },
    { label: { nl: 'Weerstand', en: 'Resistance' }, value: { nl: 'Digitaal, tot 120 kg', en: 'Digital, up to 120 kg' } },
    { label: { nl: 'Coaching', en: 'Coaching' }, value: { nl: 'AI-coach met houdingsanalyse', en: 'AI coach with form tracking' } },
    { label: { nl: 'Trainingsstanden', en: 'Training modes' }, value: { nl: '5 standen', en: '5 modes' } },
    { label: { nl: 'Montage', en: 'Mounting' }, value: { nl: 'Wandmontage of vrijstaand', en: 'Wall mounted or freestanding' } },
    { label: { nl: 'Verbinding', en: 'Connectivity' }, value: { nl: 'Wifi en Bluetooth', en: 'Wi-Fi and Bluetooth' } },
  ],
  features: [
    {
      icon: 'dumbbell',
      title: { nl: 'Digitale weerstand', en: 'Digital resistance' },
      text: {
        nl: 'Tot 120 kg weerstand, stil en traploos, zonder gewichten in huis.',
        en: 'Up to 120 kg of resistance, silent and seamless, with no weights in your home.',
      },
    },
    {
      icon: 'sparkles',
      title: { nl: 'AI-coach', en: 'AI coach' },
      text: {
        nl: 'Real-time feedback op je houding en een programma dat meegroeit met jou.',
        en: 'Real-time feedback on your form and a programme that grows with you.',
      },
    },
    {
      icon: 'layout-grid',
      title: { nl: 'Vijf trainingsstanden', en: 'Five training modes' },
      text: {
        nl: 'Kracht, uithouding, tempo, mobiliteit en herstel in een toestel.',
        en: 'Strength, endurance, tempo, mobility and recovery in one device.',
      },
    },
    {
      icon: 'monitor',
      title: { nl: 'Spiegel van 43 inch', en: '43 inch mirror' },
      text: {
        nl: 'Zie jezelf en je coach tegelijk, in een afwerking die in elk interieur past.',
        en: 'See yourself and your coach at once, in a finish that suits any interior.',
      },
    },
  ],
  hotspots: [
    {
      x: 50, y: 22,
      title: { nl: 'Aanraakscherm', en: 'Touchscreen' },
      text: { nl: 'Een helder 43 inch scherm met de coach en je live statistieken.', en: 'A bright 43 inch display with your coach and live stats.' },
    },
    {
      x: 18, y: 60,
      title: { nl: 'Digitale kabelarm', en: 'Digital cable arm' },
      text: { nl: 'Tot 120 kg weerstand, soepel en geruisloos.', en: 'Up to 120 kg of resistance, smooth and silent.' },
    },
    {
      x: 82, y: 58,
      title: { nl: 'Sensoren', en: 'Sensors' },
      text: { nl: 'Volgen je houding en tempo voor directe feedback.', en: 'Track your form and tempo for instant feedback.' },
    },
    {
      x: 50, y: 88,
      title: { nl: 'Accessoireopbergen', en: 'Accessory storage' },
      text: { nl: 'Alles binnen handbereik: handgrepen, clips en banden.', en: 'Everything within reach: handles, clips and loops.' },
    },
  ],
  metaDescription: {
    nl: 'De imbody Pro S: smart-spiegel thuisgym met 43 inch scherm, digitale weerstand tot 120 kg en AI-coach. Gratis levering en installatie.',
    en: 'The imbody Pro S: smart mirror home gym with a 43 inch screen, digital resistance up to 120 kg and an AI coach. Free delivery and installation.',
  } as L,
}

export const accessories: {
  slug: string
  title: L
  short: L
  price: number
  b2b: boolean
  color: string
}[] = [
  {
    slug: 'lichaamssamenstelling-weegschaal',
    title: { nl: 'Slimme weegschaal', en: 'Body composition scale' },
    short: {
      nl: 'Meet gewicht en lichaamssamenstelling en synchroniseert met je trainingsprofiel.',
      en: 'Measures weight and body composition and syncs with your training profile.',
    },
    price: 12900,
    b2b: true,
    color: '#e4dacb',
  },
  {
    slug: 'smart-clips',
    title: { nl: 'Smart clips', en: 'Smart clips' },
    short: {
      nl: 'Draagbare clips die je beweging nauwkeurig meten voor extra precieze feedback.',
      en: 'Wearable clips that capture your movement precisely for extra accurate feedback.',
    },
    price: 8900,
    b2b: true,
    color: '#d9cdb9',
  },
  {
    slug: 'ski-handgrepen',
    title: { nl: 'Ski-handgrepen', en: 'Ski handles' },
    short: {
      nl: 'Ergonomische handgrepen voor ski-trekbewegingen, rug- en schoudertraining.',
      en: 'Ergonomic handles for ski pulls, back and shoulder training.',
    },
    price: 5900,
    b2b: true,
    color: '#cfc1ab',
  },
  {
    slug: 'slimme-meetlint',
    title: { nl: 'Slim meetlint', en: 'Smart measuring tape' },
    short: {
      nl: 'Meet omtrekken en stuurt ze automatisch naar je voortgangsoverzicht.',
      en: 'Measures circumferences and sends them straight to your progress overview.',
    },
    price: 6900,
    b2b: false,
    color: '#e9dfd0',
  },
  {
    slug: 'pilates-lussen',
    title: { nl: 'Pilates-lussen', en: 'Pilates loops' },
    short: {
      nl: 'Zachte, verstelbare lussen voor pilates, mobiliteit en gecontroleerde core-oefeningen.',
      en: 'Soft, adjustable loops for pilates, mobility and controlled core work.',
    },
    price: 15900,
    b2b: true,
    color: '#dfd3bf',
  },
]

export const faqs: { category: 'product' | 'shop' | 'delivery' | 'business' | 'general'; home: boolean; q: L; a: L }[] = [
  {
    category: 'product', home: true,
    q: { nl: 'Hoe werkt digitale weerstand?', en: 'How does digital resistance work?' },
    a: {
      nl: 'In plaats van gewichtsschijven regelt een motor de weerstand elektronisch, tot 120 kg. Dat voelt soepel, werkt bijna geluidloos en past zich automatisch aan jouw oefening aan.',
      en: 'Instead of weight plates, a motor controls the resistance electronically, up to 120 kg. It feels smooth, runs almost silently and adapts automatically to your exercise.',
    },
  },
  {
    category: 'product', home: true,
    q: { nl: 'Heb ik ervaring met krachttraining nodig?', en: 'Do I need strength training experience?' },
    a: {
      nl: 'Nee. De AI-coach begint op jouw niveau, corrigeert je houding en bouwt het programma stap voor stap op. Ook ervaren sporters vinden genoeg uitdaging.',
      en: 'No. The AI coach starts at your level, corrects your form and builds the programme step by step. Experienced athletes will find plenty of challenge too.',
    },
  },
  {
    category: 'product', home: false,
    q: { nl: 'Hoeveel ruimte heb ik nodig?', en: 'How much space do I need?' },
    a: {
      nl: 'Je hebt ongeveer twee bij twee meter vrije ruimte nodig om comfortabel te trainen. Het toestel zelf hangt aan de wand of staat vrij en neemt weinig plaats in.',
      en: 'You need roughly two by two metres of free space to train comfortably. The device itself is wall mounted or freestanding and takes up very little room.',
    },
  },
  {
    category: 'delivery', home: true,
    q: { nl: 'Zijn levering en installatie inbegrepen?', en: 'Are delivery and installation included?' },
    a: {
      nl: 'Ja. In Nederland en Belgie leveren en installeren wij het toestel gratis bij je thuis en lopen we samen de eerste training door.',
      en: 'Yes. In the Netherlands and Belgium we deliver and install the device at your home free of charge and walk you through your first workout.',
    },
  },
  {
    category: 'shop', home: true,
    q: { nl: 'Welke garantie krijg ik?', en: 'What warranty do I get?' },
    a: {
      nl: 'Je krijgt twee jaar garantie op het toestel. Bij een defect zorgen wij voor herstel of vervanging.',
      en: 'The device comes with a two year warranty. If something fails, we take care of repair or replacement.',
    },
  },
  {
    category: 'shop', home: false,
    q: { nl: 'Kan ik het toestel retourneren?', en: 'Can I return the device?' },
    a: {
      nl: 'Je hebt 14 dagen bedenktijd na ontvangst. Neem contact met ons op en wij regelen het ophalen.',
      en: 'You have a 14 day return period after delivery. Contact us and we will arrange the pick-up.',
    },
  },
  {
    category: 'business', home: false,
    q: { nl: 'Is imbody geschikt voor mijn bedrijf of praktijk?', en: 'Is imbody suitable for my business or practice?' },
    a: {
      nl: 'Ja. Sportstudios, fysiotherapeuten, hotels en kantoren gebruiken het toestel om leden, patienten of medewerkers compact en veilig te laten trainen. Vraag een zakelijk voorstel aan.',
      en: 'Yes. Studios, physiotherapists, hotels and offices use it to let members, patients or staff train compactly and safely. Request a business proposal.',
    },
  },
  {
    category: 'general', home: false,
    q: { nl: 'Kan ik eerst een demo proberen?', en: 'Can I try a demo first?' },
    a: {
      nl: 'Zeker. Plan een demo in onze showroom, bij je thuis of online en ervaar de training zelf voordat je kiest.',
      en: 'Of course. Book a demo in our showroom, at your home or online and experience the training yourself before you decide.',
    },
  },
]

export const testimonials: {
  name: string
  role: L
  quote: L
  audience: 'home' | 'business'
}[] = [
  {
    name: 'Sanne',
    role: { nl: 'Utrecht (voorbeeldklant)', en: 'Utrecht (sample customer)' },
    quote: {
      nl: 'Ik train nu drie keer per week, gewoon voor het werk. Geen reistijd, geen drukte, en het toestel ziet er prachtig uit in onze woonkamer.',
      en: 'I now train three times a week, right before work. No travel, no crowds, and it looks beautiful in our living room.',
    },
    audience: 'home',
  },
  {
    name: 'Pieter',
    role: { nl: 'Antwerpen (voorbeeldklant)', en: 'Antwerp (sample customer)' },
    quote: {
      nl: 'De feedback op mijn houding is verrassend goed. Het voelt als een persoonlijke trainer, maar dan wanneer het mij uitkomt.',
      en: 'The feedback on my form is surprisingly good. It feels like a personal trainer, but whenever it suits me.',
    },
    audience: 'home',
  },
  {
    name: 'Lotte',
    role: { nl: 'Fysiotherapeut, Amsterdam (voorbeeld)', en: 'Physiotherapist, Amsterdam (sample)' },
    quote: {
      nl: 'In onze praktijk past het toestel in een kleine ruimte en patienten trainen veilig met precies de juiste weerstand.',
      en: 'In our practice the device fits in a small room and patients train safely with exactly the right resistance.',
    },
    audience: 'business',
  },
  {
    name: 'Marc',
    role: { nl: 'Hoteleigenaar, Brugge (voorbeeld)', en: 'Hotel owner, Bruges (sample)' },
    quote: {
      nl: 'Onze gasten waarderen een rustige wellnessruimte met moderne training, zonder dat we een volledige sportzaal nodig hebben.',
      en: 'Our guests appreciate a calm wellness space with modern training, without needing a full gym.',
    },
    audience: 'business',
  },
]

export const posts: { slug: string; title: L; excerpt: L; body: { nl: string[]; en: string[] }; date: string }[] = [
  {
    slug: 'krachttraining-thuis-beginnen',
    title: { nl: 'Beginnen met krachttraining thuis', en: 'Starting strength training at home' },
    excerpt: {
      nl: 'Vier eenvoudige principes om rustig en duurzaam op te bouwen in je eigen huis.',
      en: 'Four simple principles to build up calmly and sustainably in your own home.',
    },
    body: {
      nl: [
        'Krachttraining hoeft geen grote stap te zijn. Begin met korte sessies van twintig minuten en kies oefeningen die je goed kunt controleren.',
        'Houd je techniek schoon voordat je de belasting verhoogt. Een coach die meekijkt helpt om vroeg slechte gewoonten te vermijden.',
        'Plan vaste momenten in je week en bescherm ze. Consistentie wint het altijd van intensiteit.',
      ],
      en: [
        'Strength training does not have to be a big step. Start with short twenty minute sessions and pick exercises you can control well.',
        'Keep your technique clean before you increase the load. A coach that watches along helps you avoid bad habits early.',
        'Plan fixed moments in your week and protect them. Consistency always beats intensity.',
      ],
    },
    date: '2026-09-15T09:00:00.000Z',
  },
  {
    slug: 'herstel-en-mobiliteit',
    title: { nl: 'Herstel en mobiliteit: de vergeten helft', en: 'Recovery and mobility: the forgotten half' },
    excerpt: {
      nl: 'Waarom rust en beweeglijkheid net zo belangrijk zijn als de training zelf.',
      en: 'Why rest and mobility matter as much as the training itself.',
    },
    body: {
      nl: [
        'Spieren groeien tijdens het herstel, niet tijdens de training. Geef je lichaam daarom de tijd om bij te komen.',
        'Mobiliteitsoefeningen houden je gewrichten soepel en verkleinen de kans op blessures.',
        'Een korte, rustige sessie na een drukke dag kan meer doen dan nog een zware training.',
      ],
      en: [
        'Muscles grow during recovery, not during training. Give your body the time it needs.',
        'Mobility work keeps your joints supple and lowers the risk of injury.',
        'A short, calm session after a busy day can do more than yet another hard workout.',
      ],
    },
    date: '2026-10-05T09:00:00.000Z',
  },
]
