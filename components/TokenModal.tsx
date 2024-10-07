import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  priceUsd: number;
  priceNative: number;
  mc: number;
  liquidityInUsd: number;
  telegramUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  volume: {
    m5: number;
    h1: number;
    h24: number;
  };
  change: {
    m5: number;
    h1: number;
    h24: number;
  };
}

interface PasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAddress: string;
}

const TokenModal: React.FC<PasteModalProps> = ({
  isOpen,
  onClose,
  tokenAddress,
}) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

            {/* Token Information */}
            <div className="mb-4">
              <p className="text-gray-400">Symbol</p>
              <p className="text-white">{tokenInfo.symbol}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">Address</p>
              <p className="text-white">{tokenInfo.address}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">Price (USD)</p>
              <p className="text-white">${tokenInfo.priceUsd.toFixed(6)}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">Liquidity (USD)</p>
              <p className="text-white">
                ${tokenInfo.liquidityInUsd.toLocaleString()}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">Market Cap (USD)</p>
              <p className="text-white">${tokenInfo.mc.toLocaleString()}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">24h Volume (USD)</p>
              <p className="text-white">${tokenInfo.volume.h24}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">24h Change (%)</p>
              <p className="text-white">{tokenInfo.change.h24}%</p>
            </div>

            {/* Social Links */}
            <div className="mb-4">
              <p className="text-gray-400">Telegram</p>
              <a
                href={tokenInfo.telegramUrl}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                {tokenInfo.telegramUrl}
              </a>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">Twitter</p>
              <a
                href={tokenInfo.twitterUrl}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                {tokenInfo.twitterUrl}
              </a>
            </div>

            <div className="mb-6">
              <p className="text-gray-400">Website</p>
              <a
                href={tokenInfo.websiteUrl}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                {tokenInfo.websiteUrl}
              </a>
            </div>
          </>
        ) : (
          <p className="text-white">Failed to load token details</p>
        )}
      </div>
    </div>
  );
};

export default TokenModal;
