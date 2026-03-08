// ============================================================
// Sample/mock data for marketing page chart visualizations
// Maps to actual survey questions from Pulse of the Pint V1
// ============================================================

import { distributionPalette } from "@/lib/theme";

// Generate palettes from brand colors — swap base color for location colors in dashboard
function breweryPalette(base = "#D4AF37") {
  const p = distributionPalette(base);
  return p;
}

function dispensaryPalette(base = "#3A5A40") {
  const p = distributionPalette(base);
  return p;
}

export function buildBreweryMockData(primaryColor = "#D4AF37", secondaryColor = "#2C2C2C") {
  const p = breweryPalette(primaryColor);
  return createBreweryData(p, secondaryColor);
}

export function buildDispensaryMockData(primaryColor = "#3A5A40", secondaryColor = "#1B3A20") {
  const p = dispensaryPalette(primaryColor);
  return createDispensaryData(p, secondaryColor);
}

function createBreweryData(p: string[], secondaryColor: string) {
  return {
  // P4: Overall experience
  overallExperience: {
    score: 4.2,
    distribution: [
      { label: "Excellent", value: 38, color: p[0] },
      { label: "Very Good", value: 31, color: p[1] },
      { label: "Good", value: 19, color: p[2] },
      { label: "Fair", value: 8, color: p[3] },
      { label: "Poor", value: 4, color: p[4] },
    ],
  },

  // P7: Return likelihood
  returnLikelihood: {
    summary: 82,
    data: [
      { label: "Definitely will", value: 47, color: p[0] },
      { label: "Probably will", value: 35, color: p[1] },
      { label: "Might or might not", value: 11, color: p[2] },
      { label: "Probably won't", value: 5, color: p[3] },
      { label: "Definitely won't", value: 2, color: p[4] },
    ],
  },

  // P2: What did you have today
  whatTheyHad: [
    { label: "Draft beer (on tap)", value: 67 },
    { label: "Food", value: 42 },
    { label: "Flight / Sampler", value: 23 },
    { label: "Cans / Bottles (to go)", value: 18 },
    { label: "Cider", value: 12 },
    { label: "Non-alcoholic", value: 8 },
    { label: "Merchandise", value: 5 },
    { label: "Seltzer", value: 4 },
  ],

  // P2a: Beer styles
  beerStyles: [
    { label: "IPA / Hazy / DIPA", value: 41 },
    { label: "Lager / Pilsner", value: 18 },
    { label: "Stout / Porter", value: 15 },
    { label: "Sour / Wild Ale", value: 9 },
    { label: "Pale Ale", value: 7 },
    { label: "Wheat / Hefe", value: 5 },
    { label: "Seasonal", value: 5 },
  ],

  // P3: What brought you in
  visitDrivers: [
    { label: "My go-to spot", value: 34 },
    { label: "Friends / family", value: 28 },
    { label: "First time here", value: 15 },
    { label: "Specific beer or release", value: 9 },
    { label: "Social media", value: 6 },
    { label: "Event / live music", value: 5 },
    { label: "Just passing by", value: 3 },
  ],

  // P6: Service rating
  serviceRating: {
    score: 4.1,
    distribution: [
      { label: "Excellent", value: 34, color: p[0] },
      { label: "Very Good", value: 33, color: p[1] },
      { label: "Good", value: 21, color: p[2] },
      { label: "Fair", value: 9, color: p[3] },
      { label: "Poor", value: 3, color: p[4] },
    ],
  },

  // P1: First visit vs returning
  newVsReturning: [
    { label: "Returning", value: 66, color: p[0] },
    { label: "First visit", value: 34, color: secondaryColor },
  ],

  // B3A: What they value most
  valueMost: [
    { label: "Quality of the beer", value: 72 },
    { label: "Atmosphere / Vibe", value: 58 },
    { label: "Outdoor space / Patio", value: 41 },
    { label: "Food options", value: 38 },
    { label: "Unique / Rotating taps", value: 35 },
    { label: "Supporting local", value: 31 },
    { label: "Live music / Events", value: 24 },
    { label: "Location / Convenience", value: 22 },
    { label: "Dog-friendly", value: 18 },
  ],

  // B3B: Vibe description
  vibeDescription: [
    { label: "Chill and relaxed", value: 52, color: p[0] },
    { label: "Lively and social", value: 31, color: p[1] },
    { label: "Family-friendly", value: 9, color: p[2] },
    { label: "Upscale / Classy", value: 5, color: p[3] },
    { label: "Dive-y / No frills", value: 3, color: p[4] },
  ],

  // B2B: Spend per visit
  spendPerVisit: [
    { label: "Under $20", value: 12 },
    { label: "$20 - $40", value: 38 },
    { label: "$41 - $60", value: 27 },
    { label: "$61 - $80", value: 13 },
    { label: "$81 - $100", value: 6 },
    { label: "Over $100", value: 4 },
  ],

  // B4A: Social media follow
  socialFollow: [
    { label: "Yes", value: 23, color: p[0] },
    { label: "No, but I would", value: 45, color: p[1] },
    { label: "Not my thing", value: 32, color: secondaryColor },
  ],

  // B4B: What would bring them back more
  visitMore: [
    { label: "More beer variety", value: 48 },
    { label: "Happy hour deals", value: 44 },
    { label: "Loyalty / Rewards", value: 41 },
    { label: "Better food options", value: 36 },
    { label: "More events / Music", value: 33 },
    { label: "Trivia nights", value: 28 },
    { label: "Better hours", value: 19 },
    { label: "Already come a lot", value: 15 },
  ],

  // Fun question quotes
  funQuotes: [
    { question: "If this brewery made a beer just for you, what would it be called?", answer: "Tuesday's Regret" },
    { question: "What song should be playing in a brewery right now?", answer: "Fleetwood Mac — Dreams" },
    { question: "Perfect food pairing with your go-to beer?", answer: "Loaded nachos, no question" },
    { question: "Describe your ideal brewery experience in 3 words.", answer: "Sun. Friends. IPAs." },
    { question: "If this brewery made a beer just for you, what would it be called?", answer: "Hazy Daydream" },
    { question: "What song should be playing in a brewery right now?", answer: "Sublime — Santeria" },
  ],
};
}

// ============================================================
// Dispensary mock data (The Session Report)
// ============================================================

function createDispensaryData(p: string[], secondaryColor: string) {
  return {
  overallExperience: {
    score: 4.3,
    distribution: [
      { label: "Excellent", value: 41, color: p[0] },
      { label: "Very Good", value: 30, color: p[1] },
      { label: "Good", value: 18, color: p[2] },
      { label: "Fair", value: 7, color: p[3] },
      { label: "Poor", value: 4, color: p[4] },
    ],
  },

  returnLikelihood: {
    summary: 85,
    data: [
      { label: "Definitely will", value: 51, color: p[0] },
      { label: "Probably will", value: 34, color: p[1] },
      { label: "Might or might not", value: 9, color: p[2] },
      { label: "Probably won't", value: 4, color: p[3] },
      { label: "Definitely won't", value: 2, color: p[4] },
    ],
  },

  whatTheyPurchased: [
    { label: "Flower / Pre-rolls", value: 54 },
    { label: "Edibles", value: 31 },
    { label: "Vapes / Cartridges", value: 28 },
    { label: "Beverages", value: 14 },
    { label: "Concentrates / Dabs", value: 12 },
    { label: "Tinctures / Oils", value: 8 },
    { label: "Topicals", value: 5 },
    { label: "Accessories", value: 4 },
  ],

  shoppingMission: [
    { label: "Picking up my usual", value: 38 },
    { label: "Trying something new", value: 22 },
    { label: "Specific effect", value: 16 },
    { label: "Deal or promotion", value: 10 },
    { label: "Staff recommendation", value: 7 },
    { label: "Specific brand", value: 5 },
    { label: "Just browsing", value: 2 },
  ],

  budtenderRating: {
    score: 4.4,
    distribution: [
      { label: "Excellent", value: 48, color: p[0] },
      { label: "Very Good", value: 28, color: p[1] },
      { label: "Good", value: 16, color: p[2] },
      { label: "Fair", value: 6, color: p[3] },
      { label: "Poor", value: 2, color: p[4] },
    ],
  },

  desiredEffects: [
    { label: "Relaxation / Stress relief", value: 61 },
    { label: "Sleep", value: 34 },
    { label: "Pain / Inflammation", value: 28 },
    { label: "Social enjoyment", value: 24 },
    { label: "Mood boost", value: 21 },
    { label: "Focus / Creativity", value: 15 },
    { label: "Curiosity", value: 12 },
    { label: "Energy", value: 8 },
  ],

  buyingPriorities: [
    { label: "Quality", value: 68 },
    { label: "Price", value: 52 },
    { label: "Potency / Strength", value: 44 },
    { label: "Brand I trust", value: 35 },
    { label: "Staff recommendation", value: 29 },
    { label: "Clean ingredients", value: 27 },
    { label: "Flavor / Taste", value: 24 },
    { label: "Consistency", value: 19 },
  ],

  experienceLevel: [
    { label: "Regular user", value: 38, color: p[0] },
    { label: "Occasional", value: 27, color: p[1] },
    { label: "Very experienced", value: 18, color: p[2] },
    { label: "On and off", value: 12, color: p[3] },
    { label: "New / Learning", value: 5, color: p[4] },
  ],

  pricePerception: [
    { label: "Great value", value: 14 },
    { label: "Good value", value: 33 },
    { label: "About average", value: 31 },
    { label: "A bit pricey", value: 16 },
    { label: "Overpriced", value: 6 },
  ],

  funQuotes: [
    { question: "What's your go-to munchie after a session?", answer: "Pizza rolls. Always pizza rolls." },
    { question: "What music hits different when you're elevated?", answer: "Khruangbin on vinyl" },
    { question: "If you could ask a cannabis expert one question?", answer: "Why does the same strain hit different every time?" },
    { question: "Describe your ideal cannabis experience in 3 words.", answer: "Couch. Snacks. Silence." },
    { question: "What's your go-to munchie after a session?", answer: "Spicy ramen at 11pm" },
    { question: "What music hits different when you're elevated?", answer: "Pink Floyd obviously" },
  ],
};
}
