import React, { useEffect, useState, useCallback, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { FaTelegramPlane, FaTwitter, FaGlobe } from "react-icons/fa";
import InvestmentButton from "./InvestmentButton";
import Link from "next/link";
import useTelegramUserStore from "@/store/useTelegramUserStore";
import { formatNumber, formatDecimal } from "@/utils/numberUtils";
import { FaSyncAlt } from "react-icons/fa";
import { fetchUserPositions } from "@/utils/apiUtils";
import { Position } from "@prisma/client";

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAddress: string;
}

interface TokenDetails {
  name: string;
  liquidityInUsd: number;
  mc: number;
  volume: { h24: number };
  priceUsd: number;
  change: { m5: number; h1: number; h24: number };
  websiteUrl?: string;
  telegramUrl?: string;
  twitterUrl?: string;
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
  const [activePosition, setActivePosition] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [buying, setBuying] = useState<boolean>(false);
  const [selling, setSelling] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const userId = useTelegramUserStore((state) => state.userId);
  const tokenDetailsFetched = useRef(false); // Track if token details have been fetched

  // Memoize the fetchTokenDetails function
  const fetchTokenDetails = useCallback(async () => {
    if (tokenDetailsFetched.current) return; // Avoid repeated fetching
    setLoading(true);
    try {
      const response = await fetch(
        `/api/getTokenDetails?tokenAddress=${tokenAddress}`
      );
      const data = await response.json();
      console.log("Fetched Token Details:", data);

      if (response.ok) {
        setTokenInfo(data.tokenDetails);
        tokenDetailsFetched.current = true; // Mark as fetched
      } else {
        console.error("Error fetching token details:", data.error);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  }, [tokenAddress]);

  // Memoize the checkActivePosition function
  const checkActivePosition = useCallback(async () => {
    try {
      const positions = await fetchUserPositions(userId);
      const hasPosition = positions.some(
        (position: Position) => position.tokenAddress === tokenAddress
      );
      setActivePosition(hasPosition);
    } catch (error) {
      console.error("Error checking active position:", error);
    }
  }, [tokenAddress, userId]);

  useEffect(() => {
    if (isOpen && tokenAddress) {
      fetchTokenDetails();
      checkActivePosition();
    }
  }, [isOpen, tokenAddress, fetchTokenDetails, checkActivePosition]);

  useEffect(() => {
    if (!isOpen) {
      tokenDetailsFetched.current = false; // Reset fetched state when modal is closed
    }
  }, [isOpen]);

  // Handle refresh button click
  const handleRefresh = () => {
    tokenDetailsFetched.current = false; // Reset fetched state for manual refresh
    fetchTokenDetails();
    checkActivePosition();
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
                  {tokenInfo.name}{" "}
                  {activePosition && (
                    <span className="text-base text-primary">$0.00=0.0SOL</span>
                  )}
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

            <div className="grid grid-cols-2 gap-3 gap-y-12 my-8">
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
              <TokenInfoRow
                label="Price (USD)"
                value={`$${formatDecimal(tokenInfo.priceUsd) ?? 0}`}
              />
              {activePosition && (
                <>
                  <TokenInfoRow
                    label="Capital"
                    value={`$${formatNumber(tokenInfo.volume?.h24 ?? 0)}`}
                  />
                  <TokenInfoRow
                    label="PNL"
                    value={`$${formatDecimal(tokenInfo.priceUsd) ?? 0}`}
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
            </div>

            {activePosition && (
              <div className="flex justify-center gap-3 mb-6">
                {[10, 50, 100].map((percentage) => (
                  <InvestmentButton
                    key={percentage}
                    label={`${percentage}%`}
                    onClick={() => handleSell(percentage)}
                    type="sell"
                    isLoading={selling}
                  />
                ))}
              </div>
            )}

            <p className="text-white text-xs text-left">{transactionStatus}</p>
          </>
        ) : (
          <p className="text-white text-xs text-center">
            Unable to fetch token details.
          </p>
        )}

        {/* Social links */}
        {tokenInfo && (
          <div className="absolute bottom-5 right-10 left-10 space-y-2">
            <div className="flex gap-2 text-white justify-center">
              {tokenInfo.websiteUrl && (
                <Link
                  href={tokenInfo.websiteUrl}
                  className="text-lg"
                  target="_blank"
                >
                  <FaGlobe />
                </Link>
              )}
              {tokenInfo.telegramUrl && (
                <Link
                  href={tokenInfo.telegramUrl}
                  className="text-lg"
                  target="_blank"
                >
                  <FaTelegramPlane />
                </Link>
              )}
              {tokenInfo.twitterUrl && (
                <Link
                  href={tokenInfo.twitterUrl}
                  className="text-lg"
                  target="_blank"
                >
                  <FaTwitter />
                </Link>
              )}
            </div>

            {/* Refresh Button */}
            <button
              className="bg-black text-accent px-[6.34px] py-[2.54px] flex items-center justify-center gap-3"
              onClick={handleRefresh}
            >
              <FaSyncAlt />
              <span>Refresh</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenModal;
