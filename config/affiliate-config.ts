/**
 * CR AudioViz AI - Affiliate Configuration
 * Complete affiliate program integration for revenue generation
 */

export const AFFILIATE_PROGRAMS = {
  // Financial Affiliates
  financial: {
    lendingTree: {
      id: 'lending-tree',
      name: 'LendingTree',
      category: 'mortgages',
      commission: '25-200 per lead',
      cookieDays: 30,
      apps: ['mortgage-rate-monitor', 'javari-realty', 'javari-property'],
    },
    nerdWallet: {
      id: 'nerdwallet',
      name: 'NerdWallet',
      category: 'finance',
      commission: '5-75 per lead',
      cookieDays: 30,
      apps: ['mortgage-rate-monitor', 'javari-market', 'javari-insurance'],
    },
    bankrate: {
      id: 'bankrate',
      name: 'Bankrate',
      category: 'mortgages',
      commission: '15-150 per lead',
      cookieDays: 30,
      apps: ['mortgage-rate-monitor'],
    },
    robinhood: {
      id: 'robinhood',
      name: 'Robinhood',
      category: 'investing',
      commission: '$20 per funded account',
      cookieDays: 30,
      apps: ['javari-market', 'market-oracle-app'],
    },
    coinbase: {
      id: 'coinbase',
      name: 'Coinbase',
      category: 'crypto',
      commission: '50% of trading fees for 3 months',
      cookieDays: 30,
      apps: ['javari-market', 'market-oracle-app'],
    },
  },

  // E-commerce Affiliates
  ecommerce: {
    amazon: {
      id: 'amazon',
      name: 'Amazon Associates',
      category: 'general',
      commission: '1-10%',
      cookieDays: 1,
      apps: ['all'], // Available to all apps
    },
    ebay: {
      id: 'ebay',
      name: 'eBay Partner Network',
      category: 'collectibles',
      commission: '1-4%',
      cookieDays: 1,
      apps: ['javari-cards', 'javari-coin-cache', 'javari-vinyl-vault', 'javari-watch-works', 'javari-comic-crypt', 'javari-disney-vault', 'javari-spirits'],
    },
  },

  // Collectors Affiliates
  collectors: {
    tcgplayer: {
      id: 'tcgplayer',
      name: 'TCGPlayer',
      category: 'cards',
      commission: '5%',
      cookieDays: 7,
      apps: ['javari-cards', 'javari-card-vault'],
    },
    comc: {
      id: 'comc',
      name: 'COMC',
      category: 'cards',
      commission: '5%',
      cookieDays: 30,
      apps: ['javari-cards', 'javari-card-vault'],
    },
    discogs: {
      id: 'discogs',
      name: 'Discogs',
      category: 'vinyl',
      commission: '5%',
      cookieDays: 30,
      apps: ['javari-vinyl-vault'],
    },
    chrono24: {
      id: 'chrono24',
      name: 'Chrono24',
      category: 'watches',
      commission: '2-4%',
      cookieDays: 30,
      apps: ['javari-watch-works'],
    },
  },

  // Craft Affiliates
  craft: {
    joann: {
      id: 'joann',
      name: 'JOANN',
      category: 'craft',
      commission: '4%',
      cookieDays: 14,
      apps: ['crochet-platform', 'knitting-platform', 'machineknit-platform'],
    },
    michaels: {
      id: 'michaels',
      name: 'Michaels',
      category: 'craft',
      commission: '4%',
      cookieDays: 14,
      apps: ['crochet-platform', 'knitting-platform', 'machineknit-platform'],
    },
    lovecrafts: {
      id: 'lovecrafts',
      name: 'LoveCrafts',
      category: 'yarn',
      commission: '10%',
      cookieDays: 30,
      apps: ['crochet-platform', 'knitting-platform', 'machineknit-platform'],
    },
    knitpicks: {
      id: 'knitpicks',
      name: 'KnitPicks',
      category: 'yarn',
      commission: '5%',
      cookieDays: 30,
      apps: ['crochet-platform', 'knitting-platform', 'machineknit-platform'],
    },
  },

  // Travel Affiliates
  travel: {
    booking: {
      id: 'booking',
      name: 'Booking.com',
      category: 'hotels',
      commission: '25-40%',
      cookieDays: 30,
      apps: ['javari-travel', 'javari-orlando'],
    },
    expedia: {
      id: 'expedia',
      name: 'Expedia',
      category: 'travel',
      commission: '2-6%',
      cookieDays: 7,
      apps: ['javari-travel', 'javari-orlando'],
    },
    viator: {
      id: 'viator',
      name: 'Viator',
      category: 'activities',
      commission: '8%',
      cookieDays: 30,
      apps: ['javari-travel', 'javari-orlando'],
    },
    getyourguide: {
      id: 'getyourguide',
      name: 'GetYourGuide',
      category: 'activities',
      commission: '8%',
      cookieDays: 30,
      apps: ['javari-travel', 'javari-orlando'],
    },
  },

  // Real Estate Affiliates
  realEstate: {
    rocketMortgage: {
      id: 'rocket-mortgage',
      name: 'Rocket Mortgage',
      category: 'mortgages',
      commission: '$200-500 per closed loan',
      cookieDays: 30,
      apps: ['mortgage-rate-monitor', 'javari-realty', 'javari-property'],
    },
    better: {
      id: 'better',
      name: 'Better.com',
      category: 'mortgages',
      commission: '$100-300 per lead',
      cookieDays: 30,
      apps: ['mortgage-rate-monitor', 'javari-realty'],
    },
    homeadvisor: {
      id: 'homeadvisor',
      name: 'HomeAdvisor',
      category: 'home-services',
      commission: '$15-30 per lead',
      cookieDays: 30,
      apps: ['javari-home-services', 'javari-construction'],
    },
  },

  // Business Affiliates
  business: {
    legalzoom: {
      id: 'legalzoom',
      name: 'LegalZoom',
      category: 'legal',
      commission: '$25-50 per sale',
      cookieDays: 45,
      apps: ['javari-legal', 'javari-business-formation'],
    },
    incfile: {
      id: 'incfile',
      name: 'Incfile',
      category: 'business-formation',
      commission: '$50-100 per sale',
      cookieDays: 90,
      apps: ['javari-business-formation'],
    },
    docusign: {
      id: 'docusign',
      name: 'DocuSign',
      category: 'documents',
      commission: '10%',
      cookieDays: 30,
      apps: ['javari-legal-docs', 'javari-pdf-tools'],
    },
  },

  // Lifestyle Affiliates
  lifestyle: {
    headspace: {
      id: 'headspace',
      name: 'Headspace',
      category: 'wellness',
      commission: '$10-20 per signup',
      cookieDays: 30,
      apps: ['javari-health', 'javari-fitness'],
    },
    peloton: {
      id: 'peloton',
      name: 'Peloton',
      category: 'fitness',
      commission: '$100+ per equipment sale',
      cookieDays: 30,
      apps: ['javari-fitness'],
    },
    audible: {
      id: 'audible',
      name: 'Audible',
      category: 'audiobooks',
      commission: '$5-15 per signup',
      cookieDays: 30,
      apps: ['javari-ebook', 'javari-education'],
    },
  },

  // Gaming Affiliates
  gaming: {
    steam: {
      id: 'steam',
      name: 'Steam',
      category: 'games',
      commission: 'Variable',
      cookieDays: 30,
      apps: ['javari-games', 'javari-games-hub'],
    },
    humbleBundle: {
      id: 'humble-bundle',
      name: 'Humble Bundle',
      category: 'games',
      commission: '10-15%',
      cookieDays: 30,
      apps: ['javari-games', 'javari-games-hub'],
    },
    greenManGaming: {
      id: 'green-man-gaming',
      name: 'Green Man Gaming',
      category: 'games',
      commission: '5%',
      cookieDays: 30,
      apps: ['javari-games', 'javari-games-hub'],
    },
  },

  // Charity Affiliates
  charity: {
    networkForGood: {
      id: 'network-for-good',
      name: 'Network for Good',
      category: 'donations',
      commission: 'Variable',
      cookieDays: 30,
      apps: ['javari-first-responders', 'javari-veterans-connect', 'javari-faith-communities', 'javari-animal-rescue'],
    },
  },
};

// Helper to get affiliates for an app
export function getAffiliatesForApp(appId: string): any[] {
  const affiliates: any[] = [];
  
  Object.values(AFFILIATE_PROGRAMS).forEach(category => {
    Object.values(category).forEach(program => {
      if (program.apps.includes(appId) || program.apps.includes('all')) {
        affiliates.push(program);
      }
    });
  });
  
  return affiliates;
}

export default AFFILIATE_PROGRAMS;
