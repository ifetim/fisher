// src/data/campusRestaurants.ts
// Add or edit entries here. `aliases` are substring-matched against raw
// merchant names on bank statements (case-insensitive). Check a real
// statement to see exactly how your bank truncates the merchant name.

export interface CheaperAlternative {
  name: string
  avgMealCost: number
  location: string
  cuisine: string
}

export interface CampusRestaurant {
  name: string
  aliases: string[]
  cuisine: string
  priceRange: 'budget' | 'mid' | 'expensive'
  avgMealCost: number // CAD
  location: string
  campus: string
  cheaperAlternatives: CheaperAlternative[]
}

const campusRestaurants: CampusRestaurant[] = [
  // ── UNIVERSITY OF TORONTO ──────────────────────────────────────────────────
  {
    name: 'Myhal Café',
    aliases: ['MYHAL', 'MYHAL CAFE'],
    cuisine: 'Café / Sandwiches',
    priceRange: 'mid',
    avgMealCost: 14,
    location: 'Myhal Centre, UofT',
    campus: 'University of Toronto',
    cheaperAlternatives: [
      { name: 'Hart House Cafeteria', avgMealCost: 9, location: 'Hart House, UofT', cuisine: 'Café' },
    ],
  },
  {
    name: 'Robarts Café',
    aliases: ['ROBARTS CAFE', 'ROBARTS COFFEE'],
    cuisine: 'Café / Coffee',
    priceRange: 'mid',
    avgMealCost: 8,
    location: 'Robarts Library, UofT',
    campus: 'University of Toronto',
    cheaperAlternatives: [
      { name: 'Sid Smith Cafeteria', avgMealCost: 5, location: 'Sidney Smith Hall, UofT', cuisine: 'Café' },
    ],
  },
  {
    name: 'UC Grounds',
    aliases: ['UC GROUNDS', 'UNIVERSITY COLLEGE CAFE'],
    cuisine: 'Café / Coffee',
    priceRange: 'budget',
    avgMealCost: 6,
    location: 'University College, UofT',
    campus: 'University of Toronto',
    cheaperAlternatives: [],
  },
  {
    name: 'New College Cafeteria',
    aliases: ['NEW COLLEGE CAFE', 'NEW COLLEGE DINING'],
    cuisine: 'Food & Dining',
    priceRange: 'budget',
    avgMealCost: 10,
    location: 'New College, UofT',
    campus: 'University of Toronto',
    cheaperAlternatives: [],
  },
  {
    name: 'Innis Café',
    aliases: ['INNIS CAFE', 'INNIS COLLEGE'],
    cuisine: 'Café / Sandwiches',
    priceRange: 'budget',
    avgMealCost: 9,
    location: 'Innis College, UofT',
    campus: 'University of Toronto',
    cheaperAlternatives: [],
  },

  // ── MCGILL UNIVERSITY ──────────────────────────────────────────────────────
  {
    name: "Gerts Bar & Café",
    aliases: ['GERTS', 'GERTS BAR', 'GERTS CAFE'],
    cuisine: 'Bar Food',
    priceRange: 'mid',
    avgMealCost: 15,
    location: 'Shatner University Centre, McGill',
    campus: 'McGill University',
    cheaperAlternatives: [
      { name: 'Avenue Café', avgMealCost: 9, location: 'Leacock Building, McGill', cuisine: 'Café' },
    ],
  },
  {
    name: 'McGill Dining Hall',
    aliases: ['MCGILL DINING', 'ROYAL VICTORIA DINING', 'RVC DINING'],
    cuisine: 'Food & Dining',
    priceRange: 'budget',
    avgMealCost: 11,
    location: 'Royal Victoria College, McGill',
    campus: 'McGill University',
    cheaperAlternatives: [],
  },
  {
    name: 'Leacock Café',
    aliases: ['LEACOCK CAFE', 'LEACOCK COFFEE'],
    cuisine: 'Café / Coffee',
    priceRange: 'budget',
    avgMealCost: 6,
    location: 'Leacock Building, McGill',
    campus: 'McGill University',
    cheaperAlternatives: [],
  },

  // ── UNIVERSITY OF WATERLOO ─────────────────────────────────────────────────
  {
    name: 'Fed Hall',
    aliases: ['FED HALL', 'FEDERATION HALL'],
    cuisine: 'Bar Food',
    priceRange: 'mid',
    avgMealCost: 16,
    location: 'Federation Hall, UWaterloo',
    campus: 'University of Waterloo',
    cheaperAlternatives: [
      { name: 'SLC Marketplace', avgMealCost: 10, location: 'Student Life Centre, UWaterloo', cuisine: 'Food & Dining' },
    ],
  },
  {
    name: 'SLC Marketplace',
    aliases: ['SLC MARKETPLACE', 'SLC MARKET', 'STUDENT LIFE CENTRE FOOD'],
    cuisine: 'Food & Dining',
    priceRange: 'budget',
    avgMealCost: 10,
    location: 'Student Life Centre, UWaterloo',
    campus: 'University of Waterloo',
    cheaperAlternatives: [],
  },
  {
    name: 'DC Café',
    aliases: ['DC CAFE', 'DAVIS CENTRE CAFE'],
    cuisine: 'Café / Coffee',
    priceRange: 'budget',
    avgMealCost: 6,
    location: 'Davis Centre, UWaterloo',
    campus: 'University of Waterloo',
    cheaperAlternatives: [],
  },

  // ── UNIVERSITY OF BRITISH COLUMBIA ────────────────────────────────────────
  {
    name: 'The Pit Pub',
    aliases: ['PIT PUB', 'THE PIT', 'UBC PIT'],
    cuisine: 'Bar Food',
    priceRange: 'mid',
    avgMealCost: 17,
    location: 'AMS Student Nest, UBC',
    campus: 'University of British Columbia',
    cheaperAlternatives: [
      { name: 'Seedlings Café', avgMealCost: 9, location: 'AMS Nest, UBC', cuisine: 'Café' },
    ],
  },
  {
    name: 'Seedlings Café',
    aliases: ['SEEDLINGS CAFE', 'SEEDLINGS UBC'],
    cuisine: 'Café / Sandwiches',
    priceRange: 'budget',
    avgMealCost: 9,
    location: 'AMS Student Nest, UBC',
    campus: 'University of British Columbia',
    cheaperAlternatives: [],
  },
  {
    name: 'Place Vanier Dining',
    aliases: ['PLACE VANIER', 'VANIER DINING'],
    cuisine: 'Food & Dining',
    priceRange: 'budget',
    avgMealCost: 12,
    location: 'Place Vanier Residence, UBC',
    campus: 'University of British Columbia',
    cheaperAlternatives: [],
  },

  // ── UNIVERSITY OF CALGARY ──────────────────────────────────────────────────
  {
    name: 'The Den',
    aliases: ['THE DEN', 'DEN BAR UCALGARY', 'DEN UCALGARY'],
    cuisine: 'Bar Food',
    priceRange: 'mid',
    avgMealCost: 16,
    location: 'MacEwan Student Centre, UCalgary',
    campus: 'University of Calgary',
    cheaperAlternatives: [
      { name: 'UCalgary Dining Centre', avgMealCost: 10, location: 'Residence, UCalgary', cuisine: 'Food & Dining' },
    ],
  },
  {
    name: 'MacHall Food Court',
    aliases: ['MACHALL', 'MAC HALL', 'MACEWAN FOOD COURT', 'UCALGARY DINING MACHALL', 'UCALGARY DINING'],
    cuisine: 'Food & Dining',
    priceRange: 'mid',
    avgMealCost: 13,
    location: 'MacEwan Student Centre, UCalgary',
    campus: 'University of Calgary',
    cheaperAlternatives: [
      { name: 'UCalgary Dining Centre', avgMealCost: 10, location: 'Residence, UCalgary', cuisine: 'Food & Dining' },
    ],
  },
  {
    name: 'UCalgary Dining Centre',
    aliases: ['UOC DINING', 'DINING CENTRE CALGARY'],
    cuisine: 'Food & Dining',
    priceRange: 'budget',
    avgMealCost: 10,
    location: 'Residence, UCalgary',
    campus: 'University of Calgary',
    cheaperAlternatives: [],
  },
  {
    name: 'Tim Hortons (UCalgary)',
    aliases: ['TIM HORTONS UCALGARY', 'TIM HORTONS UNIVERSITY OF CALGARY'],
    cuisine: 'Café / Coffee',
    priceRange: 'budget',
    avgMealCost: 5,
    location: 'MacEwan Student Centre, UCalgary',
    campus: 'University of Calgary',
    cheaperAlternatives: [],
  },
  {
    name: 'Starbucks (UCalgary)',
    aliases: ['STARBUCKS UCALGARY', 'STARBUCKS MACHALL'],
    cuisine: 'Café / Coffee',
    priceRange: 'mid',
    avgMealCost: 8,
    location: 'MacHall, UCalgary',
    campus: 'University of Calgary',
    cheaperAlternatives: [
      { name: 'Tim Hortons (UCalgary)', avgMealCost: 5, location: 'MacEwan Student Centre, UCalgary', cuisine: 'Café / Coffee' },
    ],
  },

  // ── SAIT (Southern Alberta Institute of Technology) ────────────────────────
  {
    name: 'Tim Hortons (SAIT)',
    aliases: ['TIM HORTONS SAIT'],
    cuisine: 'Café / Coffee',
    priceRange: 'budget',
    avgMealCost: 5,
    location: 'SAIT Campus, Calgary',
    campus: 'University of Calgary',
    cheaperAlternatives: [],
  },
  {
    name: 'A&W (SAIT)',
    aliases: ['A&W SAIT', 'A AND W SAIT'],
    cuisine: 'Food & Dining',
    priceRange: 'mid',
    avgMealCost: 12,
    location: 'SAIT Aldred Centre, Calgary',
    campus: 'University of Calgary',
    cheaperAlternatives: [
      { name: 'SAIT Cafeteria', avgMealCost: 9, location: 'Senator Burns Building, SAIT', cuisine: 'Food & Dining' },
    ],
  },
  {
    name: 'SAIT Cafeteria',
    aliases: ['SAIT CAFETERIA', 'SAIT DINING', 'SENATOR BURNS'],
    cuisine: 'Food & Dining',
    priceRange: 'budget',
    avgMealCost: 9,
    location: 'Senator Burns Building, SAIT',
    campus: 'University of Calgary',
    cheaperAlternatives: [],
  },
  {
    name: 'Starbucks (SAIT)',
    aliases: ['STARBUCKS SAIT'],
    cuisine: 'Café / Coffee',
    priceRange: 'mid',
    avgMealCost: 8,
    location: 'SAIT Main Campus, Calgary',
    campus: 'University of Calgary',
    cheaperAlternatives: [
      { name: 'Tim Hortons (SAIT)', avgMealCost: 5, location: 'SAIT Campus, Calgary', cuisine: 'Café / Coffee' },
    ],
  },

  // ── Calgary chain restaurants on/near campus ───────────────────────────────
  {
    name: 'Pizza 73',
    aliases: ['PIZZA 73'],
    cuisine: 'Food & Dining',
    priceRange: 'mid',
    avgMealCost: 18,
    location: 'Delivery / Calgary',
    campus: 'University of Calgary',
    cheaperAlternatives: [
      { name: 'MacHall Food Court', avgMealCost: 13, location: 'MacEwan Student Centre, UCalgary', cuisine: 'Food & Dining' },
    ],
  },
  {
    name: "Domino's Pizza",
    aliases: ['DOMINOS PIZZA', 'DOMINOS CALGARY', "DOMINO'S"],
    cuisine: 'Food & Dining',
    priceRange: 'mid',
    avgMealCost: 16,
    location: 'Delivery / Calgary',
    campus: 'University of Calgary',
    cheaperAlternatives: [
      { name: 'MacHall Food Court', avgMealCost: 13, location: 'MacEwan Student Centre, UCalgary', cuisine: 'Food & Dining' },
    ],
  },
  {
    name: "Earl's Restaurant",
    aliases: ["EARLS RESTAURANT", "EARLS KITCHEN", "EARLS CROWFOOT", "EARLS CALGARY"],
    cuisine: 'Food & Dining',
    priceRange: 'expensive',
    avgMealCost: 35,
    location: 'Crowfoot / Calgary',
    campus: 'University of Calgary',
    cheaperAlternatives: [
      { name: 'MacHall Food Court', avgMealCost: 13, location: 'MacEwan Student Centre, UCalgary', cuisine: 'Food & Dining' },
      { name: 'UCalgary Dining Centre', avgMealCost: 10, location: 'Residence, UCalgary', cuisine: 'Food & Dining' },
    ],
  },

  // ── MCMASTER UNIVERSITY ───────────────────────────────────────────────────
  {
    name: 'The Grind Café',
    aliases: ['THE GRIND', 'GRIND CAFE MCMASTER', 'GRIND MCMASTER'],
    cuisine: 'Café / Coffee',
    priceRange: 'budget',
    avgMealCost: 7,
    location: 'McMaster Student Centre',
    campus: 'McMaster University',
    cheaperAlternatives: [],
  },
  {
    name: 'MUSC Commons',
    aliases: ['MUSC COMMONS', 'MUSC FOOD', 'STUDENT CENTRE MCMASTER'],
    cuisine: 'Food & Dining',
    priceRange: 'mid',
    avgMealCost: 13,
    location: 'McMaster University Student Centre',
    campus: 'McMaster University',
    cheaperAlternatives: [
      { name: 'Centro Dining Hall', avgMealCost: 11, location: 'Keyes Residence, McMaster', cuisine: 'Food & Dining' },
    ],
  },
  {
    name: 'Centro Dining Hall',
    aliases: ['CENTRO DINING', 'CENTRO MCMASTER'],
    cuisine: 'Food & Dining',
    priceRange: 'budget',
    avgMealCost: 11,
    location: 'Mary E. Keyes Residence, McMaster',
    campus: 'McMaster University',
    cheaperAlternatives: [],
  },

  // ── WESTERN UNIVERSITY ────────────────────────────────────────────────────
  {
    name: 'The Spoke',
    aliases: ['THE SPOKE', 'SPOKE WESTERN', 'SPOKE BAR'],
    cuisine: 'Bar Food',
    priceRange: 'mid',
    avgMealCost: 15,
    location: 'University Community Centre, Western',
    campus: 'Western University',
    cheaperAlternatives: [
      { name: 'Wave Dining Hall', avgMealCost: 10, location: 'Residence, Western', cuisine: 'Food & Dining' },
    ],
  },
  {
    name: 'UCC Marketplace',
    aliases: ['UCC MARKETPLACE', 'UCC FOOD', 'UNIVERSITY COMMUNITY CENTRE FOOD'],
    cuisine: 'Food & Dining',
    priceRange: 'mid',
    avgMealCost: 12,
    location: 'University Community Centre, Western',
    campus: 'Western University',
    cheaperAlternatives: [
      { name: 'Wave Dining Hall', avgMealCost: 10, location: 'Residence, Western', cuisine: 'Food & Dining' },
    ],
  },
  {
    name: 'Wave Dining Hall',
    aliases: ['WAVE DINING', 'WAVE WESTERN'],
    cuisine: 'Food & Dining',
    priceRange: 'budget',
    avgMealCost: 10,
    location: 'Residence, Western University',
    campus: 'Western University',
    cheaperAlternatives: [],
  },

  // ── QUEEN'S UNIVERSITY ────────────────────────────────────────────────────
  {
    name: 'The Lazy Scholar',
    aliases: ['LAZY SCHOLAR', 'THE LAZY SCHOLAR'],
    cuisine: 'Bar Food',
    priceRange: 'mid',
    avgMealCost: 16,
    location: 'John Deutsch University Centre, Queens',
    campus: "Queen's University",
    cheaperAlternatives: [
      { name: 'Leonard Hall Dining', avgMealCost: 10, location: "Residence, Queen's", cuisine: 'Food & Dining' },
    ],
  },
  {
    name: 'JDUC Marketplace',
    aliases: ['JDUC', 'JDUC FOOD', 'JOHN DEUTSCH FOOD'],
    cuisine: 'Food & Dining',
    priceRange: 'mid',
    avgMealCost: 12,
    location: "John Deutsch University Centre, Queen's",
    campus: "Queen's University",
    cheaperAlternatives: [
      { name: 'Leonard Hall Dining', avgMealCost: 10, location: "Residence, Queen's", cuisine: 'Food & Dining' },
    ],
  },
  {
    name: 'Leonard Hall Dining',
    aliases: ['LEONARD DINING', 'LEONARD HALL', 'QUEENS DINING'],
    cuisine: 'Food & Dining',
    priceRange: 'budget',
    avgMealCost: 10,
    location: "Leonard Hall Residence, Queen's",
    campus: "Queen's University",
    cheaperAlternatives: [],
  },

  // ── ADD MORE BELOW ─────────────────────────────────────────────────────────
  // {
  //   name: 'Your Restaurant',
  //   aliases: ['HOW IT APPEARS ON STATEMENT'],
  //   cuisine: 'Food & Dining',
  //   priceRange: 'mid',
  //   avgMealCost: 12,
  //   location: 'Building, Campus',
  //   campus: 'University of Toronto',
  //   cheaperAlternatives: [],
  // },
]

export default campusRestaurants