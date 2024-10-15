import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import InvestmentButton from "./InvestmentButton";
import useTelegramUserStore from "@/store/useTelegramUserStore";
import { formatNumber, formatDecimal } from "@/utils/numberUtils";

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAddress: string;
}
const getChangeColor = (value: number) => {
  if (value < 0) return "text-red-500";
  if (value === 0) return "text-white";
  return "text-green-500";
};

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
      console.log("API error during buy", error);
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
      console.log("API error during sell", error);
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
              <div>
                <h2 className="text-xl text-left mb-2">
                  {tokenInfo.name}{" "}
                  <span className="text-base text-primary">$0.00=0.0SOL</span>
                </h2>

                <div className="text-sm mb-2">
                  <span className={getChangeColor(tokenInfo.change?.m5 ?? 0)}>
                    5m: {tokenInfo.change?.m5 ?? 0}%
                  </span>{" "}
                  |{" "}
                  <span className={getChangeColor(tokenInfo.change?.h1 ?? 0)}>
                    1hr: {tokenInfo.change?.h1 ?? 0}%
                  </span>{" "}
                  |{" "}
                  <span className={getChangeColor(tokenInfo.change?.h24 ?? 0)}>
                    24hrs: {tokenInfo.change?.h24 ?? 0}%
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-[6.34px] py-[2.54px] text-accent bg-[#3C3C3C3B]"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 gap-y-10 my-8">
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
                value={`$${formatDecimal(tokenInfo.priceUsd) ?? 0}`}
              />
              <TokenInfoRow
                label="Total Market Cap"
                value={`$${formatNumber(tokenInfo.mc ?? 0)}`}
              />
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {[0.1, 0.5, 1].map((amount) => (
                <InvestmentButton
                  key={amount}
                  label={`${amount} Sol`}
                  onClick={() => handleBuy(amount)}
                  type="buy"
                  isLoading={buying}
                />
              ))}
              <InvestmentButton
                key={"X"}
                label={`${"X"} Sol`}
                onClick={() => handleBuy(10)}
                type="buy"
                isLoading={buying}
              />
            </div>
            <div className="flex justify-center gap-4 ">
              {[25, 50, 100].map((percentage) => (
                <InvestmentButton
                  key={percentage}
                  label={`${percentage} %`}
                  onClick={() => handleSell(percentage)}
                  type="sell"
                  isLoading={selling}
                />
              ))}
              <InvestmentButton
                key={"X"}
                label={`${"X"} %`}
                onClick={() => handleSell(10)}
                type="sell"
                isLoading={selling}
              />
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
