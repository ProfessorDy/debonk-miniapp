export const formatNumber = (num: number): string => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toFixed(1);
  };

  export const formatDecimal = (num: number | undefined | null, precision: number = 6): string => {
    if (num === undefined || num === null) {
      return "N/A"; 
    }
  
    if (num === 0) return "0";
    
    if (num < 1 && num > 0) {
      return num.toFixed(precision);
    }
  
    return num.toLocaleString(undefined, { minimumFractionDigits: 2 });
  };
  
  
 export function formatWalletBalance(balance) {
    return balance.toFixed(3).replace(/\.?0+$/, ""); // Format to 3 decimal places and remove trailing zeros
  }
  
  
  