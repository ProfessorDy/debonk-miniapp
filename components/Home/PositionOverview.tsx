import React, { useState, useMemo, useCallback } from "react";
import TokenModal from "../TokenModal";
import { formatNumber } from "@/utils/numberUtils";

interface PositionOverviewProps {
  livePositions: TokenData[];
  simulationPositions: TokenData[];
  isLiveTrading: boolean;
  sellLoading: boolean;
  handleSell: (tokenAddress: string, tokenName: string) => Promise<void>;
}

const PositionOverview: React.FC<PositionOverviewProps> = ({
  livePositions,
  simulationPositions,
  isLiveTrading,
  sellLoading,
  handleSell,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<TokenData | null>(
    null
  );

  // Memoize active positions to prevent unnecessary re-renders
  const activePositions = useMemo(
    () => (isLiveTrading ? livePositions : simulationPositions),
    [isLiveTrading, livePositions, simulationPositions]
  );

  const handleCardClick = useCallback((position: TokenData) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPosition(null);
  }, []);

  if (activePositions.length === 0) {
    return (
      <section className="mt-2 text-white shadow-lg rounded-xl pb-20 p-3">
        <p className="text-xs font-light">Positions Overview</p>
        <p className="text-sm text-center text-gray-400">
          You have no active {isLiveTrading ? "live" : "demo"} positions.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="mt-2 text-white shadow-lg rounded-xl pb-20 p-3">
        <p className="text-xs font-light">Positions Overview</p>
        <div className="flex flex-col gap-2 mt-3">
          {activePositions.map((position, idx) => (
            <div
              key={idx}
              className="bg-[#3C3C3C3B] backdrop-blur-2xl px-4 py-2 flex justify-between cursor-pointer"
              onClick={() => handleCardClick(position)}
            >
              <div className="space-y-1">
                <p className="text-base font-normal mb-1">
                  {position.token.name}
                </p>
                <div>
                  <p className="font-normal">
                    <span className="font-light"> MC </span>
                    {position.token.mc
                      ? formatNumber(position.token.mc)
                      : "N/A"}
                  </p>
                  <p className="font-normal">
                    <span className="font-light"> LIQ </span>
                    {position.token.liquidityInUsd
                      ? formatNumber(position.token.liquidityInUsd)
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p
                  className={`font-light text-[9.45px] ${
                    position.PNL_Sol_percent &&
                    Number(position.PNL_Sol_percent) > 0
                      ? "text-[#1DD75B]"
                      : "text-[#E82E2E]"
                  }`}
                >
                  {position.PNL_Sol_percent
                    ? `${
                        Number(position.PNL_Sol_percent) > 0 ? "+" : ""
                      }${Number(position.PNL_Sol_percent)}%`
                    : "N/A"}
                </p>
                <div className="text-sm text-center font-light">
                  <p>
                    {position.PNL_sol ? position.PNL_sol.toFixed(2) : "0.00"}{" "}
                    SOL
                  </p>
                  <p className="font-light">
                    ${position.PNL_usd ? position.PNL_usd.toFixed(2) : "0.00"}
                  </p>
                </div>
                <button
                  className={`text-center py-[9.45px] text-[9.45px] rounded-[6.3px] bg-[#E82E2E] text-white w-[60px] ${
                    sellLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSell(position.tokenAddress, position.token.name);
                  }}
                  disabled={sellLoading}
                >
                  {sellLoading ? "Selling..." : "Sell 100%"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedPosition && (
        <TokenModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          tokenAddress={selectedPosition.tokenAddress}
        />
      )}
    </>
  );
};

export default PositionOverview;
