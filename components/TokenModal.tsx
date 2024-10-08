import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import InvestmentButton from "./InvestmentButton";
import useTelegramUserStore from "@/store/useTelegramUserStore";

interface TokenInfo {
  name: string;
  symbol: string;
  priceUsd: number;
  liquidityInUsd: number;
  mc: number;
  volume: {
    h24: number;
  };
  priceNative: number;
  change: {
    m5: number;
    h1: number;
    h24: number;
  };
}

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAddress: string;
}

const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  tokenAddress,
}) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const userId = useTelegramUserStore((state) => state.userId);

  useEffect(() => {
    if (isOpen && tokenAddress) {
      const fetchTokenDetails = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/getTokenDetails?tokenAddress=${tokenAddress}`
          );
          const data = await response.json();
          console.log("Fetched Token Details:", data);

          if (response.ok) {
            setTokenInfo(data.tokenDetails);
          } else {
            console.error("Error fetching token details:", data.error);
          }
        } catch (error) {
          console.error("API Error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTokenDetails();
    }
  }, [isOpen, tokenAddress]);

  if (!isOpen) return null;

  const handleBuy = async (amount: number) => {
    try {
      const response = await fetch(
        `/api/simulationBuyToken?telegramId=${5915972947}&tokenAddress=${tokenAddress}&amountInSol=${amount}&amountPercent=100&type=AMOUNT`
      );
      const result = await response.json();
      if (result.status) {
        console.log("Buy transaction successful", result);
      } else {
        console.error("Buy transaction failed", result.error);
      }
    } catch (error) {
      console.error("API error during buy:", error);
    }
  };

  const handleSell = async (amount: number) => {
    try {
      const response = await fetch(
        `/api/simulationSellToken?telegramId=${userId}&tokenAddress=${tokenAddress}&amountInSol=${amount}&amountPercent=100&type=AMOUNT`
      );
      const result = await response.json();
      if (result.status) {
        console.log("Sell transaction successful", result);
      } else {
        console.error("Sell transaction failed", result.error);
      }
    } catch (error) {
      console.error("API error during sell:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 pb-16">
      <div className="bg-black h-[90%] w-full max-w-md p-6 text-center shadow-lg relative rounded-lg flex flex-col justify-center">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 left-4 text-accent">
          <IoClose size={24} />
        </button>

        {loading ? (
          <div className="flex items-center justify-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          </div>
        ) : tokenInfo ? (
          <>
            {/* Title */}
            <h2 className="text-xl font-bold text-white mb-6">
              {tokenInfo.name}
            </h2>

            {/* Price Change Overview */}
            <div className="text-sm text-green-500 mb-2">
              5m: {tokenInfo.change?.m5 ?? 0}% | 1hr:{" "}
              {tokenInfo.change?.h1 ?? 0}% | 24hrs: {tokenInfo.change?.h24 ?? 0}
              %
            </div>

            {/* Token Information Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-400">Liquidity</p>
                <p className="text-white">
                  ${tokenInfo.liquidityInUsd?.toLocaleString() ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Market Cap</p>
                <p className="text-white">
                  ${tokenInfo.mc?.toLocaleString() ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Volume (24h)</p>
                <p className="text-white">
                  ${tokenInfo.volume?.h24?.toLocaleString() ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Holders</p>
                <p className="text-white">N/A</p> {/* Hardcoded "N/A" */}
              </div>
              <div>
                <p className="text-gray-400">Price (USD)</p>
                <p className="text-white">
                  ${tokenInfo.priceUsd?.toFixed(6) ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Total Market Cap</p>
                <p className="text-white">
                  ${tokenInfo.mc?.toLocaleString() ?? "N/A"}
                </p>
              </div>
            </div>

            {/* Buy and Sell Buttons */}
            <div className="flex justify-between mb-4">
              <InvestmentButton
                label="0.1 SOL"
                onClick={() => handleBuy(0.1)}
                type="buy"
              />
              <InvestmentButton
                label="0.5 SOL"
                onClick={() => handleBuy(0.5)}
                type="buy"
              />

              <InvestmentButton
                label="1 SOL"
                onClick={() => handleBuy(1)}
                type="buy"
              />
            </div>
            <div className="flex justify-between">
              <InvestmentButton
                label="0.1 SOL"
                onClick={() => handleSell(0.1)}
                type="sell"
              />
              <InvestmentButton
                label="0.5 SOL"
                onClick={() => handleSell(0.5)}
                type="sell"
              />
              <InvestmentButton
                label="1 SOL"
                onClick={() => handleSell(1)}
                type="sell"
              />
            </div>
          </>
        ) : (
          <div className="text-white">Failed to load token information</div>
        )}
      </div>
    </div>
  );
};

export default TokenModal;
