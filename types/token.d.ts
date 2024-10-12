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
  
  // Interface for the token details object
  export interface TokenDetails {
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
  