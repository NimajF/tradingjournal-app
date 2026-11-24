import { ASSETS } from "@/lib/data/assets";

export type AssetKind = "crypto" | "forex" | "commodity" | "index" | "unknown";

export type ResolvedSymbol = {
  raw: string; // User input ("BTCUSD" - "EURUSD")
  base: string; // "BTC", "EUR", "XAU", "NDX"
  quote: string | null; // "USD", "EUR", null for indices
};

const QUOTES = [
  // Crypto stablecoins
  "USDT",
  "USDC",
  "DAI",
  "FDUSD",

  // Fiat
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "AUD",
  "CAD",
  "NZD",

  // Crypto quote assets
  "BTC",
  "ETH",
] as const;

const ALIASES: Record<string, { base: string; quote: string | null }> = {
  // NASDAQ 100
  NAS100: { base: "NDX", quote: null },
  US100: { base: "NDX", quote: null },
  USTEC: { base: "NDX", quote: null },
  NDX: { base: "NDX", quote: null },
  NQ: { base: "NDX", quote: null },
  MNQ: { base: "NDX", quote: null },

  // S&P 500
  US500: { base: "SPX", quote: null },
  SP500: { base: "SPX", quote: null },
  SPX: { base: "SPX", quote: null },
  ES: { base: "SPX", quote: null },
  MES: { base: "SPX", quote: null },

  // DOW JONES
  US30: { base: "DJI", quote: null },
  DJ30: { base: "DJI", quote: null },
  DJI: { base: "DJI", quote: null },
  DJIA: { base: "DJI", quote: null },
  YM: { base: "DJI", quote: null },
  MYM: { base: "DJI", quote: null },

  // DAX
  GER40: { base: "DAX", quote: null },
  DE40: { base: "DAX", quote: null },
  DAX40: { base: "DAX", quote: null },
  DAX: { base: "DAX", quote: null },

  // GOLD
  GOLD: { base: "XAU", quote: "USD" },
  XAU: { base: "XAU", quote: "USD" },
  GC: { base: "XAU", quote: "USD" },

  // SILVER
  SILVER: { base: "XAG", quote: "USD" },
  XAG: { base: "XAG", quote: "USD" },
  SI: { base: "XAG", quote: "USD" },

  // OIL
  USOIL: { base: "WTI", quote: "USD" },
  WTI: { base: "WTI", quote: "USD" },
  CL: { base: "WTI", quote: "USD" },

  UKOIL: { base: "BRENT", quote: "USD" },
  BRENT: { base: "BRENT", quote: "USD" },
  BRN: { base: "BRENT", quote: "USD" },

  // RUSSELL 2000
  US2000: { base: "RUT", quote: null },
  RUSSELL2000: { base: "RUT", quote: null },
  RUT: { base: "RUT", quote: null },
  RTY: { base: "RUT", quote: null },
  M2K: { base: "RUT", quote: null },
};

// "NAS100" → "NDX"; if it's not an alias, return it as is
function canonicalBase(base: string): string {
  return Object.hasOwn(ALIASES, base) ? ALIASES[base].base : base;
}

// Sort the quote assets by length in descending order to ensure that longer quote assets are matched first.
const QUOTES_LONGEST_FIRST = [...QUOTES].sort((a, b) => b.length - a.length);

// Sort the alias keys by length in descending order to ensure that longer aliases are matched first.
const ALIAS_KEYS_LONGEST_FIRST = Object.keys(ALIASES).sort(
  (a, b) => b.length - a.length,
);
// Returns the alias prefix if it matches, otherwise null. Used to identify if a given string starts with a known alias.
function matchAliasPrefix(s: string) {
  const key = ALIAS_KEYS_LONGEST_FIRST.find(
    (k) => s.startsWith(k) && /\d/.test(s.slice(k.length)),
  );
  return key ? ALIASES[key] : null;
}

export function resolveSymbol(rawInput: string): ResolvedSymbol {
  let s = rawInput.trim().toUpperCase(); // Trim whitespace and normalize to uppercase
  if (!s) return { raw: rawInput, base: "", quote: null }; // Return early for empty input

  s = s.replace(/(\.P|[-_.]?PERP)$/, "");
  if (!s) return { raw: rawInput, base: "", quote: null }; // Return early for empty input after removing suffixes

  const parts = s.split(/[-_\/]/); // "BTC-USD" → ["BTC", "USD"]

  if (parts.length === 2 && parts[0] && parts[1]) {
    return { raw: rawInput, base: canonicalBase(parts[0]), quote: parts[1] }; // Return early if the symbol is already in the correct format
  }

  s = parts.join(""); // Join the parts back to form a single string

  // Return early if the symbol is an alias. ...Aliases[s] equals to { base: ALIASES[s].base, quote: ALIASES[s].quote }
  if (Object.hasOwn(ALIASES, s)) {
    return { raw: rawInput, ...ALIASES[s] };
  }

  // "STETH" ends in "ETH" (a quote), but is itself a known asset — don't split it.
  if (Object.hasOwn(ASSETS, s)) {
    return { raw: rawInput, base: s, quote: null };
  }

  const quote = QUOTES_LONGEST_FIRST.find(
    (q) => s.endsWith(q) && s.length - q.length >= 2,
  ); // Ensure that the base has at least 2 characters
  if (quote)
    return {
      raw: rawInput,
      base: canonicalBase(s.slice(0, -quote.length)),
      quote,
    };
  const prefixAlias = matchAliasPrefix(s);
  if (prefixAlias) return { raw: rawInput, ...prefixAlias };
  return { raw: rawInput, base: s, quote: null };
}
