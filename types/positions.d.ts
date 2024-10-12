// Interface for the volume and change subfields
interface VolumeData {
    m5: number;
    h1: number;
    h24: number;
  }
  
  interface ChangeData {
    m5: number;
    h1: number;
    h24: number;
  }
  
  // Interface for the token object
  interface TokenDetails {
    name: string;
    symbol: string;
    address: string;
    priceUsd: number;
    priceNative: number | null;
    mc: number;
    liquidityInUsd: number;
    telegramUrl: string;
    twitterUrl: string;
    websiteUrl: string;
    volume: VolumeData;
    change: ChangeData;
    source: string;
  }
  
  // Interface for the main object
  interface TokenData {
    tokenTicker: string;
    capital: string;
    balance: string;
    currentPrice: string;
    mc: number;
    PNL_Sol_percent: string;
    PNL_usd_percent: string;
    PNL_usd: number | null;
    PNL_sol: number | null;
    currentHolding: string;
    tokenAddress: string;
    token: TokenDetails;
  }
  
  // Type for an array of token data
  type TokenDataArray = TokenData[];
  