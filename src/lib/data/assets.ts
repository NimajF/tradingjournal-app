import type { AssetKind } from "@/lib/utils/symbol";

type AssetInfo = {
  name: string;
  kind: AssetKind;
  icon: string; // Path to icon file
};

const CRYPTO_ICON = (base: string) => `/assets/symbols/crypto/${base}.svg`;
const FLAG_ICON = (code: string) => `/assets/symbols/flags/${code}.svg`;
const COMMODITY_ICON = (name: string) =>
  `/assets/symbols/commodities/${name}.svg`;

export const ASSETS: Record<string, AssetInfo> = {
  // Crypto
  BTC: { name: "Bitcoin", kind: "crypto", icon: CRYPTO_ICON("btc") },
  ETH: { name: "Ethereum", kind: "crypto", icon: CRYPTO_ICON("eth") },
  SOL: { name: "Solana", kind: "crypto", icon: CRYPTO_ICON("sol") },
  BNB: { name: "BNB", kind: "crypto", icon: CRYPTO_ICON("bnb") },
  XRP: { name: "XRP", kind: "crypto", icon: CRYPTO_ICON("xrp") },
  ADA: { name: "Cardano", kind: "crypto", icon: CRYPTO_ICON("ada") },
  DOGE: { name: "Dogecoin", kind: "crypto", icon: CRYPTO_ICON("doge") },
  LINK: { name: "Chainlink", kind: "crypto", icon: CRYPTO_ICON("link") },
  AVAX: { name: "Avalanche", kind: "crypto", icon: CRYPTO_ICON("avax") },
  SUI: { name: "Sui", kind: "crypto", icon: CRYPTO_ICON("sui") },
  DOT: { name: "Polkadot", kind: "crypto", icon: CRYPTO_ICON("dot") },
  LTC: { name: "Litecoin", kind: "crypto", icon: CRYPTO_ICON("ltc") },
  TRX: { name: "Tron", kind: "crypto", icon: CRYPTO_ICON("trx") },
  TON: { name: "Toncoin", kind: "crypto", icon: CRYPTO_ICON("ton") },
  POL: { name: "Polygon", kind: "crypto", icon: CRYPTO_ICON("pol") },
  ARB: { name: "Arbitrum", kind: "crypto", icon: CRYPTO_ICON("arb") },
  OP: { name: "Optimism", kind: "crypto", icon: CRYPTO_ICON("op") },
  APT: { name: "Aptos", kind: "crypto", icon: CRYPTO_ICON("apt") },
  NEAR: { name: "NEAR Protocol", kind: "crypto", icon: CRYPTO_ICON("near") },
  ATOM: { name: "Cosmos", kind: "crypto", icon: CRYPTO_ICON("atom") },
  INJ: { name: "Injective", kind: "crypto", icon: CRYPTO_ICON("inj") },
  PEPE: { name: "Pepe", kind: "crypto", icon: CRYPTO_ICON("pepe") },
  SHIB: { name: "Shiba Inu", kind: "crypto", icon: CRYPTO_ICON("shib") },
  UNI: { name: "Uniswap", kind: "crypto", icon: CRYPTO_ICON("uni") },
  AAVE: { name: "Aave", kind: "crypto", icon: CRYPTO_ICON("aave") },
  MKR: { name: "Maker", kind: "crypto", icon: CRYPTO_ICON("mkr") },
  RENDER: { name: "Render", kind: "crypto", icon: CRYPTO_ICON("render") },
  FIL: { name: "Filecoin", kind: "crypto", icon: CRYPTO_ICON("fil") },
  ICP: { name: "Internet Computer", kind: "crypto", icon: CRYPTO_ICON("icp") },
  HBAR: { name: "Hedera", kind: "crypto", icon: CRYPTO_ICON("hbar") },

  // Stablecoins
  USDT: { name: "Tether", kind: "crypto", icon: CRYPTO_ICON("usdt") },
  USDC: { name: "USD Coin", kind: "crypto", icon: CRYPTO_ICON("usdc") },
  FDUSD: {
    name: "First Digital USD",
    kind: "crypto",
    icon: CRYPTO_ICON("fdusd"),
  },
  DAI: { name: "Dai", kind: "crypto", icon: CRYPTO_ICON("dai") },

  // Wrapped / staked derivatives — these are not quote assets, but they are known assets
  STETH: { name: "Lido Staked ETH", kind: "crypto", icon: CRYPTO_ICON("eth") },
  WSTETH: { name: "Wrapped stETH", kind: "crypto", icon: CRYPTO_ICON("eth") },
  CBETH: {
    name: "Coinbase Wrapped ETH",
    kind: "crypto",
    icon: CRYPTO_ICON("eth"),
  },
  WBTC: { name: "Wrapped Bitcoin", kind: "crypto", icon: CRYPTO_ICON("btc") },

  // Forex
  USD: { name: "US Dollar", kind: "forex", icon: FLAG_ICON("us") },
  EUR: { name: "Euro", kind: "forex", icon: FLAG_ICON("eu") },
  GBP: { name: "British Pound", kind: "forex", icon: FLAG_ICON("gb") },
  JPY: { name: "Japanese Yen", kind: "forex", icon: FLAG_ICON("jp") },
  CHF: { name: "Swiss Franc", kind: "forex", icon: FLAG_ICON("ch") },
  AUD: { name: "Australian Dollar", kind: "forex", icon: FLAG_ICON("au") },
  CAD: { name: "Canadian Dollar", kind: "forex", icon: FLAG_ICON("ca") },
  NZD: { name: "New Zealand Dollar", kind: "forex", icon: FLAG_ICON("nz") },

  // Commodities
  XAU: { name: "Gold", kind: "commodity", icon: COMMODITY_ICON("xau") },
  XAG: { name: "Silver", kind: "commodity", icon: COMMODITY_ICON("xag") },
  WTI: {
    name: "WTI Crude Oil",
    kind: "commodity",
    icon: COMMODITY_ICON("oil"),
  },
  BRENT: {
    name: "Brent Crude Oil",
    kind: "commodity",
    icon: COMMODITY_ICON("oil"),
  },

  // Stock indexes
  NDX: { name: "Nasdaq 100", kind: "index", icon: FLAG_ICON("us") },
  SPX: { name: "S&P 500", kind: "index", icon: FLAG_ICON("us") },
  DJI: { name: "Dow Jones", kind: "index", icon: FLAG_ICON("us") },
  RUT: { name: "Russell 2000", kind: "index", icon: FLAG_ICON("us") },
  DAX: { name: "DAX 40", kind: "index", icon: FLAG_ICON("de") },
};

export function getAsset(base: string): AssetInfo | null {
  return ASSETS[base] ?? null;
}
