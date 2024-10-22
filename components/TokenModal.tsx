import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaTelegramPlane, FaTwitter, FaGlobe, FaSyncAlt } from "react-icons/fa";
import InvestmentButton from "./InvestmentButton";
import Link from "next/link";
import useTelegramUserStore from "@/store/useTelegramUserStore";
import { formatNumber, formatDecimal } from "@/utils/numberUtils";
import { fetchUserPositions } from "@/utils/apiUtils";
import { Position } from "@prisma/client";

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
  const [tokenInfo, setTokenInfo] = useState<TokenData | null>(null);
  const [activePosition, setActivePosition] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [buying, setBuying] = useState<boolean>(false);
  const [selling, setSelling] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [customPercentage, setCustomPercentage] = useState<number | null>(null);
  const [showCustomAmountInput, setShowCustomAmountInput] =
    useState<boolean>(false);
  const [showCustomPercentageInput, setShowCustomPercentageInput] =
    useState<boolean>(false);

  const userId = useTelegramUserStore((state) => state.userId);
  const tokenDetailsFetchedRef = useRef(false);

  // Fetch token details and active position in parallel
  const fetchTokenAndPosition = useCallback(async () => {
    setLoading(true);
    try {
      const [tokenResponse, positions] = await Promise.all([
        fetch(`/api/getTokenDetails?tokenAddress=${tokenAddress}`),
        fetchUserPositions(userId),
      ]);

      const tokenData = await tokenResponse.json();
      if (tokenResponse.ok) {
        setTokenInfo(tokenData.tokenDetails);
      } else {
        console.error("Error fetching token details:", tokenData.error);
      }

      const hasPosition = positions.some(
        (position: Position) => position.tokenAddress === tokenAddress
      );
      setActivePosition(hasPosition);
    } catch (error) {
      console.error("Error fetching token details or position:", error);
    } finally {
      setLoading(false);
    }
  }, [tokenAddress, userId]);

  // Trigger loading state and fetch data when the modal is open
  useEffect(() => {
    if (isOpen && tokenAddress && !tokenDetailsFetchedRef.current) {
      fetchTokenAndPosition();
      tokenDetailsFetchedRef.current = true;
    }
  }, [isOpen, tokenAddress, fetchTokenAndPosition]);

  const handleRefresh = () => {
    tokenDetailsFetchedRef.current = false;
    fetchTokenAndPosition();
  };

  const handleTransactionStatus = (status: string) => {
    setTransactionStatus(status);
    setTimeout(() => setTransactionStatus(null), 3000); // Clear status after 3 seconds
  };

  const handleBuy = async (amount: number) => {
    setBuying(true);
    setTransactionStatus(null);
    try {
      const response = await fetch(
        `/api/simulationBuyToken?telegramId=${userId}&tokenAddress=${tokenAddress}&amountInSol=${amount}&amountPercent=100&type=AMOUNT`
      );
      const result = await response.json();
      if (result.status) {
        handleTransactionStatus("Buy transaction successful!");
      } else {
        handleTransactionStatus("Buy transaction failed.");
      }
    } catch (error) {
      handleTransactionStatus("error during buy.");
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
        handleTransactionStatus("Sell transaction successful!");
      } else {
        handleTransactionStatus("Sell transaction failed.");
      }
    } catch (error) {
      handleTransactionStatus("error during sell.");
      console.log("API error during sell", error);
    } finally {
      setSelling(false);
    }
  };

  const handleCustomBuy = async () => {
    if (customAmount) {
      handleBuy(customAmount);
      setCustomAmount(null);
      setShowCustomAmountInput(false);
    }
  };

  const handleCustomSell = async () => {
    if (customPercentage) {
      handleSell(customPercentage);
      setCustomPercentage(null);
      setShowCustomPercentageInput(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-40 pb-16">
      <div
        className={`bg-black max-h-[550px] w-full max-w-md p-4 text-center shadow-lg relative rounded-t-lg flex flex-col justify-center transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          </div>
        ) : tokenInfo ? (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl text-left mb-2">
                  {tokenInfo.token?.name ?? "N/A"}{" "}
                </h2>

                <div className="text-sm mb-2">
                  <span
                    className={getChangeColor(tokenInfo.token?.change?.m5 ?? 0)}
                  >
                    5m: {tokenInfo.token?.change?.m5 ?? 0}%
                  </span>{" "}
                  |{" "}
                  <span
                    className={getChangeColor(tokenInfo.token?.change?.h1 ?? 0)}
                  >
                    1hr: {tokenInfo.token?.change?.h1 ?? 0}%
                  </span>{" "}
                  |{" "}
                  <span
                    className={getChangeColor(
                      tokenInfo.token?.change?.h24 ?? 0
                    )}
                  >
                    24hrs: {tokenInfo.token?.change?.h24 ?? 0}%
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

            <div className="grid grid-cols-2 gap-3 gap-y-12 my-8">
              <TokenInfoRow
                label="Liquidity"
                value={`$${formatNumber(tokenInfo.token?.liquidityInUsd ?? 0)}`}
              />
              <TokenInfoRow
                label="Market Cap"
                value={`$${formatNumber(tokenInfo.mc ?? 0)}`}
              />
              <TokenInfoRow
                label="Volume (24h)"
                value={`$${formatNumber(tokenInfo.token?.volume?.h24 ?? 0)}`}
              />
              <TokenInfoRow
                label="Price (USD)"
                value={`$${formatDecimal(tokenInfo.token?.priceUsd) ?? 0}`}
              />
              {activePosition && (
                <>
                  <TokenInfoRow
                    label="Capital"
                    value={`$${tokenInfo.capital ?? 0} sol`}
                  />
                  <TokenInfoRow
                    label="PNL"
                    value={`$${formatNumber(tokenInfo.PNL_usd ?? 0)}`}
                  />
                </>
              )}
            </div>

            {/* Buy and Sell Buttons */}
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
                label="xSol"
                onClick={() => setShowCustomAmountInput(true)}
                type="buy"
              />
            </div>

            {showCustomAmountInput && (
              <div className="flex justify-center mb-4">
                <input
                  type="number"
                  placeholder="Enter amount in Sol"
                  value={customAmount ?? ""}
                  onChange={(e) => setCustomAmount(parseFloat(e.target.value))}
                  className="bg-gray-700 text-white p-2 rounded"
                />
                <button
                  onClick={handleCustomBuy}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Buy
                </button>
              </div>
            )}

            {activePosition && (
              <>
                <div className="flex justify-center gap-3 mb-6">
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
                    label="x%"
                    onClick={() => setShowCustomPercentageInput(true)}
                    type="sell"
                  />
                </div>

                {showCustomPercentageInput && (
                  <div className="flex justify-center mb-4">
                    <input
                      type="number"
                      placeholder="Enter sell percentage"
                      value={customPercentage ?? ""}
                      onChange={(e) =>
                        setCustomPercentage(parseFloat(e.target.value))
                      }
                      className="bg-gray-700 text-white p-2 rounded"
                    />
                    <button
                      onClick={handleCustomSell}
                      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Sell
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Social Links */}
            <div className="flex justify-center gap-4 mb-4">
              {tokenInfo.token?.websiteUrl && (
                <Link href={tokenInfo.token?.websiteUrl ?? "#"} target="_blank">
                  <FaGlobe className="text-white text-lg" />
                </Link>
              )}
              {tokenInfo.token?.telegramUrl && (
                <Link
                  href={tokenInfo.token?.telegramUrl ?? "#"}
                  target="_blank"
                >
                  <FaTelegramPlane className="text-white text-lg" />
                </Link>
              )}
              {tokenInfo.token?.twitterUrl && (
                <Link href={tokenInfo.token?.twitterUrl ?? "#"} target="_blank">
                  <FaTwitter className="text-white text-lg" />
                </Link>
              )}
              <button
                className="text-white text-lg hover:text-gray-400 transition-colors"
                onClick={handleRefresh}
              >
                <FaSyncAlt />
              </button>
            </div>

            {transactionStatus && (
              <div className="text-center text-white mt-3">
                {transactionStatus}
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={onClose}
              className="px-[6.34px] py-[2.54px] text-accent bg-[#3C3C3C3B] ml-auto"
            >
              <IoClose size={24} />
            </button>
            <div>No token information available.</div>
          </>
        )}
      </div>
    </div>
  );
};

export default TokenModal;
