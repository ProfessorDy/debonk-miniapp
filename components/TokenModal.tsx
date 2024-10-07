import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

interface TokenInfo {
  name: string;
  liquidity: string;
  marketCap: string;
  volume: string;
  holders: string;
  price: string;
  totalMarketCap: string;
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

  useEffect(() => {
    if (isOpen && tokenAddress) {
      const fetchTokenDetails = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/getTokenDetails?tokenAddress=${tokenAddress}`
          );
          const data = await response.json();
          console.log("Fetched Token Details:", data); // Log the data type

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
            {/* Simple loading spinner */}
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
              <p className="text-gray-400">Liquidity</p>
              <p className="text-white">{tokenInfo.liquidity}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">Market Cap</p>
              <p className="text-white">{tokenInfo.marketCap}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">Volume</p>
              <p className="text-white">{tokenInfo.volume}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">Holders</p>
              <p className="text-white">{tokenInfo.holders}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">Price</p>
              <p className="text-white">{tokenInfo.price}</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-400">Total Market Cap</p>
              <p className="text-white">{tokenInfo.totalMarketCap}</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-around">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                0.1 SOL
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                0.5 SOL
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                1 SOL
              </button>
            </div>

            <div className="flex justify-around mt-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
                10 SOL
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
                X SOL
              </button>
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
