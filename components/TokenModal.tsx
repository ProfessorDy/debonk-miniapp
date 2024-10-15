import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import InvestmentButton from "./InvestmentButton";
import useTelegramUserStore from "@/store/useTelegramUserStore";
import { formatNumber } from "@/utils/numberUtils";

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAddress: string;
}

const TokenInfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="text-center bg-[#3C3C3C3B] py-1 space-y-3 rounded-[4px]">
    <p className="font-bold uppercase text-xs">{label}</p>
    <p className="text-xs">{value}</p>
  </div>
);

const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  tokenAddress,
}) => {
  const [tokenInfo, setTokenInfo] = useState<TokenDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [buying, setBuying] = useState<boolean>(false);
  const [selling, setSelling] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
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
    setBuying(true);
    setTransactionStatus(null);
    try {
      const response = await fetch(
        `/api/simulationBuyToken?telegramId=${userId}&tokenAddress=${tokenAddress}&amountInSol=${amount}&amountPercent=100&type=AMOUNT`
      );
      const result = await response.json();
      if (result.status) {
        setTransactionStatus("Buy transaction successful!");
      } else {
        setTransactionStatus("Buy transaction failed.");
      }
    } catch (error) {
      setTransactionStatus("API error during buy.");
    } finally {
      setBuying(false);
    }
  };

  const handleSell = async (percentage: number) => {
    setSelling(true);
    setTransactionStatus(null);
    try {
      const response = await fetch(
        `/api/simulationSellToken?telegramId=${userId}&tokenAddress=${tokenAddress}&amountPercent=${percentage}&type=PERCENT`
      );
      const result = await response.json();
      if (result.status) {
        setTransactionStatus("Sell transaction successful!");
      } else {
        setTransactionStatus("Sell transaction failed.");
      }
    } catch (error) {
      setTransactionStatus("API error during sell.");
    } finally {
      setSelling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 pb-16">
      <div className="bg-black max-h-[550px] w-full max-w-md p-4 text-center shadow-lg relative rounded-lg flex flex-col justify-center">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          </div>
        ) : tokenInfo ? (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white mb-6">
                {tokenInfo.name}
              </h2>
              <button
                onClick={onClose}
                className="px-[6.34px] py-[2.54px] text-accent bg-[#3C3C3C3B]"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="text-sm text-green-500 mb-2">
              5m: {tokenInfo.change?.m5 ?? 0}% | 1hr:{" "}
              {tokenInfo.change?.h1 ?? 0}% | 24hrs: {tokenInfo.change?.h24 ?? 0}
              %
            </div>

            <div className="grid grid-cols-2 gap-4 gap-y-10 my-6">
              <TokenInfoRow
                label="Liquidity"
                value={`$${formatNumber(tokenInfo.liquidityInUsd ?? 0)}`}
              />
              <TokenInfoRow
                label="Market Cap"
                value={`$${formatNumber(tokenInfo.mc ?? 0)}`}
              />
              <TokenInfoRow
                label="Volume (24h)"
                value={`$${formatNumber(tokenInfo.volume?.h24 ?? 0)}`}
              />
              <TokenInfoRow label="Holders" value="N/A" />
              <TokenInfoRow
                label="Price (USD)"
                value={`$${tokenInfo.priceUsd ?? 0}`}
              />
              <TokenInfoRow
                label="Total Market Cap"
                value={`$${formatNumber(tokenInfo.mc ?? 0)}`}
              />
            </div>

            <div className="flex justify-between mb-4">
              {[0.1, 0.5, 1].map((amount) => (
                <InvestmentButton
                  key={amount}
                  label={`${amount} SOL`}
                  onClick={() => handleBuy(amount)}
                  type="buy"
                  isLoading={buying}
                />
              ))}
            </div>
            <div className="flex justify-between">
              {[25, 50, 100].map((percentage) => (
                <InvestmentButton
                  key={percentage}
                  label={`${percentage}%`}
                  onClick={() => handleSell(percentage)}
                  type="sell"
                  isLoading={selling}
                />
              ))}
            </div>

            {transactionStatus && (
              <div className="mt-4 text-white">{transactionStatus}</div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-accent"
            >
              <IoClose size={24} />
            </button>
            <div className="text-white">Failed to load token information</div>
          </>
        )}
      </div>
    </div>
  );
};

export default TokenModal;
