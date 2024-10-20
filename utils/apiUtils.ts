

// Helper function to fetch SOL price from the API
export const fetchSolPrice = async () => {
    const response = await fetch("/api/solPrice");
    const data = await response.json();
    if (response.ok) {
      return data.solUsdPrice;
    } else {
      console.error(data.error);
      throw new Error("Failed to fetch SOL price");
    }
  };
  
  // Helper function to fetch the user's wallet and simulation balances
  export const fetchWalletBalance = async (telegramId: string) => {
    const res = await fetch(`/api/getUserSolanaBalance?telegramId=${telegramId}`);
    const data = await res.json();
    console.log("userSolanaBalance", data)
    if (res.ok) {
      return {
        balance: data.balance,
        simulationBalance: data.simulationBalance,
      };
    } else {
      console.error(data.error);
      throw new Error("Failed to fetch wallet balance");
    }
  };
  
  // Helper function to fetch the user's active positions
  export const fetchUserPositions = async (telegramId: string) => {
    const res = await fetch(`/api/getUserPositions?telegramId=${telegramId}`);
    const data = await res.json();
    if (res.ok) {
      return data.positions;
    } else {
      console.error(data.error);
      throw new Error("Failed to fetch user positions");
    }
  };
  
  // Helper function to simulate selling a token
export const simulateSellToken = async ({
  telegramId,
  tokenAddress,
  amountPercent,
  type,
}) => {
  const queryParams = new URLSearchParams({
    telegramId,
    tokenAddress,
    amountPercent: String(amountPercent),
    type,
  });

  const res = await fetch(`/api/simulationSellToken?${queryParams.toString()}`);
  const data = await res.json();

  if (res.ok) {
    return data.status; 
  } else {
    console.error(data.error);
    throw new Error("Failed to simulate sell token transaction");
  }
};
