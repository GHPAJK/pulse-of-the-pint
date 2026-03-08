export type QuestionType =
  | "single_select"
  | "multi_select"
  | "multi_select_limited"
  | "smiley_scale"
  | "open_end"
  | "pii"
  | "age_gate";

export interface QuestionOption {
  label: string;
  value: string;
  /** If selecting this option should skip to a specific question variable */
  skipTo?: string;
  /** If selecting this option should terminate the survey */
  terminates?: boolean;
}

export interface SurveyQuestion {
  id: string;
  variable: string;
  section: "age_gate" | "core" | "block" | "fun" | "pii";
  block?: number;
  type: QuestionType;
  text: string;
  subtext?: string;
  options?: QuestionOption[];
  required?: boolean;
  /** Max selections for multi_select_limited */
  maxSelect?: number;
  /** Only show if condition is met: { variable: value } */
  showIf?: { variable: string; value: string | string[] };
  /** PII field config */
  piiFields?: PiiField[];
  /** Placeholder text for open end */
  placeholder?: string;
  /** Uses location name interpolation */
  usesLocationName?: boolean;
}

export interface PiiField {
  variable: string;
  label: string;
  type: "text" | "email" | "tel" | "zip";
  required: boolean;
  placeholder: string;
}

// ─── Age Gate ───

const ageGate: SurveyQuestion = {
  id: "ag1",
  variable: "AG1",
  section: "age_gate",
  type: "age_gate",
  text: "Please confirm you are 21 years of age or older.",
  required: true,
  options: [
    { label: "Yes, I'm 21+", value: "yes" },
    { label: "No", value: "no", terminates: true },
  ],
};

// ─── Core Questions ───

const coreQuestions: SurveyQuestion[] = [
  {
    id: "p1",
    variable: "P1",
    section: "core",
    type: "single_select",
    text: "Is this your first visit to {{LOCATION_NAME}}?",
    usesLocationName: true,
    required: true,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "p2",
    variable: "P2",
    section: "core",
    type: "multi_select",
    text: "What did you have today?",
    required: true,
    options: [
      { label: "Beer (on tap)", value: "beer_tap" },
      { label: "Beer (cans/bottles to go)", value: "beer_togo" },
      { label: "Flight / Sampler", value: "flight" },
      { label: "Cider", value: "cider" },
      { label: "Seltzer / Hard seltzer", value: "seltzer" },
      { label: "Non-alcoholic option", value: "non_alc" },
      { label: "Food", value: "food" },
      { label: "Merchandise", value: "merch" },
      { label: "Nothing yet - just arrived", value: "nothing" },
      { label: "I'd rather not say", value: "decline", skipTo: "P4" },
    ],
  },
  {
    id: "p3",
    variable: "P3",
    section: "core",
    type: "single_select",
    text: "What brought you in today?",
    required: true,
    options: [
      { label: "My go-to spot", value: "regular" },
      { label: "Trying this place for the first time", value: "first_time" },
      { label: "A specific beer or release", value: "specific_beer" },
      { label: "Hanging out with friends/family", value: "social" },
      { label: "Event or live music", value: "event" },
      { label: "Recommendation from someone", value: "recommendation" },
      { label: "Saw it on social media", value: "social_media" },
      { label: "Just passing by", value: "passerby" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "p4",
    variable: "P4",
    section: "core",
    type: "smiley_scale",
    text: "How was your overall experience today?",
    required: true,
    options: [
      { label: "Excellent", value: "5" },
      { label: "Very Good", value: "4" },
      { label: "Good", value: "3" },
      { label: "Fair", value: "2" },
      { label: "Poor", value: "1" },
    ],
  },
  {
    id: "p5",
    variable: "P5",
    section: "core",
    type: "single_select",
    text: "Did you interact with the bar staff / servers?",
    required: true,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no", skipTo: "P7" },
    ],
  },
  {
    id: "p6",
    variable: "P6",
    section: "core",
    type: "smiley_scale",
    text: "How was the service?",
    required: true,
    showIf: { variable: "P5", value: "yes" },
    options: [
      { label: "Excellent", value: "5" },
      { label: "Very Good", value: "4" },
      { label: "Good", value: "3" },
      { label: "Fair", value: "2" },
      { label: "Poor", value: "1" },
    ],
  },
  {
    id: "p7",
    variable: "P7",
    section: "core",
    type: "single_select",
    text: "How likely are you to come back to {{LOCATION_NAME}}?",
    usesLocationName: true,
    required: true,
    options: [
      { label: "Definitely will", value: "definitely" },
      { label: "Probably will", value: "probably" },
      { label: "Might or might not", value: "maybe" },
      { label: "Probably won't", value: "probably_not" },
      { label: "Definitely won't", value: "definitely_not" },
    ],
  },
];

// ─── Block 1: Beer Preferences & Discovery ───

const block1: SurveyQuestion[] = [
  {
    id: "b1a",
    variable: "B1A",
    section: "block",
    block: 1,
    type: "multi_select",
    text: "What styles do you usually go for?",
    required: true,
    options: [
      { label: "IPA / DIPA / Hazy", value: "ipa" },
      { label: "Pale Ale", value: "pale_ale" },
      { label: "Lager / Pilsner", value: "lager" },
      { label: "Stout / Porter", value: "stout" },
      { label: "Wheat / Hefeweizen", value: "wheat" },
      { label: "Sour / Wild Ale", value: "sour" },
      { label: "Amber / Red Ale", value: "amber" },
      { label: "Brown Ale", value: "brown" },
      { label: "Belgian / Farmhouse", value: "belgian" },
      { label: "Seasonal / Limited release", value: "seasonal" },
      { label: "Non-alcoholic", value: "non_alc" },
      { label: "I'll try anything", value: "anything" },
    ],
  },
  {
    id: "b1b",
    variable: "B1B",
    section: "block",
    block: 1,
    type: "multi_select",
    text: "How do you usually discover new beers?",
    required: true,
    options: [
      { label: "Bartender / Staff recommendation", value: "bartender" },
      { label: "What's on tap today", value: "on_tap" },
      { label: "Untappd or beer apps", value: "apps" },
      { label: "Social media", value: "social" },
      { label: "Friends / Word of mouth", value: "friends" },
      { label: "Beer festivals or events", value: "festivals" },
      { label: "Online reviews", value: "reviews" },
      { label: "I stick to what I know", value: "stick" },
    ],
  },
];

// ─── Block 2: Visit Behavior ───

const block2: SurveyQuestion[] = [
  {
    id: "b2a",
    variable: "B2A",
    section: "block",
    block: 2,
    type: "single_select",
    text: "How often do you visit breweries or taprooms?",
    required: true,
    options: [
      { label: "This is my first time at any brewery", value: "first" },
      { label: "A few times a year", value: "few_year" },
      { label: "Once a month", value: "monthly" },
      { label: "2-3 times a month", value: "biweekly" },
      { label: "Weekly or more", value: "weekly" },
    ],
  },
  {
    id: "b2b",
    variable: "B2B",
    section: "block",
    block: 2,
    type: "single_select",
    text: "About how much did you spend today (including food, drinks, merch, to-go)?",
    required: true,
    options: [
      { label: "Under $20", value: "under_20" },
      { label: "$20 - $40", value: "20_40" },
      { label: "$41 - $60", value: "41_60" },
      { label: "$61 - $80", value: "61_80" },
      { label: "$81 - $100", value: "81_100" },
      { label: "Over $100", value: "over_100" },
      { label: "Prefer not to say", value: "decline" },
    ],
  },
];

// ─── Block 3: Atmosphere & Vibe ───

const block3: SurveyQuestion[] = [
  {
    id: "b3a",
    variable: "B3A",
    section: "block",
    block: 3,
    type: "multi_select_limited",
    text: "What do you value most about a brewery visit?",
    subtext: "Select up to 3",
    maxSelect: 3,
    required: true,
    options: [
      { label: "Quality of the beer", value: "beer_quality" },
      { label: "Atmosphere / Vibe", value: "atmosphere" },
      { label: "Outdoor space / Patio", value: "outdoor" },
      { label: "Food options", value: "food" },
      { label: "Live music / Events", value: "music" },
      { label: "Dog-friendly", value: "dogs" },
      { label: "Kid-friendly", value: "kids" },
      { label: "Location / Convenience", value: "location" },
      { label: "Unique or rotating taps", value: "rotating_taps" },
      { label: "Supporting local business", value: "local" },
    ],
  },
  {
    id: "b3b",
    variable: "B3B",
    section: "block",
    block: 3,
    type: "single_select",
    text: "How would you describe the vibe at {{LOCATION_NAME}} today?",
    usesLocationName: true,
    required: true,
    options: [
      { label: "Chill and relaxed", value: "chill" },
      { label: "Lively and social", value: "lively" },
      { label: "Family-friendly", value: "family" },
      { label: "Upscale / Classy", value: "upscale" },
      { label: "Dive-y / No frills", value: "divey" },
      { label: "Packed / Too crowded", value: "crowded" },
    ],
  },
];

// ─── Block 4: Brand & Loyalty ───

const block4: SurveyQuestion[] = [
  {
    id: "b4a",
    variable: "B4A",
    section: "block",
    block: 4,
    type: "single_select",
    text: "Do you follow {{LOCATION_NAME}} on social media?",
    usesLocationName: true,
    required: true,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No, but I would", value: "no_would" },
      { label: "No, not really my thing", value: "no" },
    ],
  },
  {
    id: "b4b",
    variable: "B4B",
    section: "block",
    block: 4,
    type: "multi_select",
    text: "What would make you visit more often?",
    required: true,
    options: [
      { label: "More beer variety / Rotating taps", value: "variety" },
      { label: "Better food options", value: "food" },
      { label: "More events / Live music", value: "events" },
      { label: "Loyalty program / Rewards", value: "loyalty" },
      { label: "Happy hour deals", value: "happy_hour" },
      { label: "Trivia nights", value: "trivia" },
      { label: "Better hours / Open later", value: "hours" },
      { label: "Nothing - I already come a lot", value: "already_loyal" },
    ],
  },
];

// ─── Block 5: Beer Knowledge ───

const block5: SurveyQuestion[] = [
  {
    id: "b5a",
    variable: "B5A",
    section: "block",
    block: 5,
    type: "single_select",
    text: "How would you describe your beer knowledge?",
    required: true,
    options: [
      { label: "Casual drinker - I know what I like", value: "casual" },
      { label: "Getting into craft beer", value: "getting_into" },
      { label: "Enthusiast - I seek out new stuff", value: "enthusiast" },
      { label: "Certified beer nerd", value: "nerd" },
      { label: "Homebrewer", value: "homebrewer" },
    ],
  },
  {
    id: "b5b",
    variable: "B5B",
    section: "block",
    block: 5,
    type: "single_select",
    text: "How important is it to you that a brewery is locally owned / independent?",
    required: true,
    options: [
      { label: "Very important - it's why I'm here", value: "very" },
      { label: "Somewhat important", value: "somewhat" },
      { label: "Doesn't really matter", value: "not_really" },
      { label: "Never thought about it", value: "never" },
    ],
  },
];

// ─── Fun Questions (1 random) ───

const funQuestions: SurveyQuestion[] = [
  {
    id: "c1",
    variable: "C1",
    section: "fun",
    type: "open_end",
    text: "If this brewery made a beer just for you, what would it be called?",
    placeholder: "Get creative...",
    required: false,
  },
  {
    id: "c2",
    variable: "C2",
    section: "fun",
    type: "open_end",
    text: "What song should be playing in a brewery right now?",
    placeholder: "Artist - Song title",
    required: false,
  },
  {
    id: "c3",
    variable: "C3",
    section: "fun",
    type: "open_end",
    text: "What's the perfect food pairing with your go-to beer?",
    placeholder: "Wings? Pretzels? Something fancy?",
    required: false,
  },
  {
    id: "c4",
    variable: "C4",
    section: "fun",
    type: "open_end",
    text: "Describe your ideal brewery experience in 3 words.",
    placeholder: "Three words...",
    required: false,
  },
];

// ─── PII / Reward Claim ───

const piiQuestion: SurveyQuestion = {
  id: "pii",
  variable: "PII",
  section: "pii",
  type: "pii",
  text: "Claim your reward!",
  subtext:
    "Share your info below to claim your reward and enter our monthly sweepstakes.",
  required: false,
  piiFields: [
    {
      variable: "PII1",
      label: "First Name",
      type: "text",
      required: false,
      placeholder: "Your first name",
    },
    {
      variable: "PII2",
      label: "Email Address",
      type: "email",
      required: false,
      placeholder: "you@email.com",
    },
    {
      variable: "PII3",
      label: "Zip Code",
      type: "zip",
      required: false,
      placeholder: "12345",
    },
    {
      variable: "PII4",
      label: "Mobile Number",
      type: "tel",
      required: false,
      placeholder: "(555) 555-5555",
    },
  ],
};

// ─── All Blocks ───

export const allBlocks: Record<number, SurveyQuestion[]> = {
  1: block1,
  2: block2,
  3: block3,
  4: block4,
  5: block5,
};

export const allFunQuestions = funQuestions;
export const allCoreQuestions = coreQuestions;
export const ageGateQuestion = ageGate;
export const piiQuestionData = piiQuestion;

/**
 * Build the full question list for a respondent given their assigned blocks
 * and randomly selected fun question.
 */
export function buildQuestionList(
  assignedBlocks: number[],
  funQuestionIndex: number
): SurveyQuestion[] {
  const questions: SurveyQuestion[] = [];

  // Age gate
  questions.push(ageGate);

  // Core questions
  questions.push(...coreQuestions);

  // Assigned blocks
  for (const blockNum of assignedBlocks.sort()) {
    const block = allBlocks[blockNum];
    if (block) {
      questions.push(...block);
    }
  }

  // Fun question (1 random)
  const funQ = funQuestions[funQuestionIndex % funQuestions.length];
  questions.push(funQ);

  // PII
  questions.push(piiQuestion);

  return questions;
}

/**
 * Randomly pick 1-2 blocks from the 5 available.
 */
export function assignRandomBlocks(): number[] {
  const count = Math.random() < 0.5 ? 1 : 2;
  const available = [1, 2, 3, 4, 5];
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Pick a random fun question index (0-3).
 */
export function pickRandomFunQuestion(): number {
  return Math.floor(Math.random() * funQuestions.length);
}

/**
 * Interpolate location name into question text.
 */
export function interpolateQuestion(
  text: string,
  locationName: string
): string {
  return text.replace(/\{\{LOCATION_NAME\}\}/g, locationName);
}
