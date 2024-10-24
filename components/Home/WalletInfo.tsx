import React, { useMemo, useCallback } from "react";
import { CiCircleAlert } from "react-icons/ci";
import { GiPlainCircle } from "react-icons/gi";
import { FaCheck, FaFlask, FaPlayCircle } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import useLiveTradingStore from "@/store/useLiveTradingStore";

interface WalletInfoProps {
  walletAddress: string;
  unrealizedPNL: number;
  unrealizedPNLUSD: number;
  walletBalance: number;
  totalValueInUsd: number | null;
  handleCopy: () => void;
  copySuccess: boolean;
}

const WalletInfo: React.FC<WalletInfoProps> = ({
  walletAddress,
  unrealizedPNL,
  unrealizedPNLUSD,
  walletBalance,
  totalValueInUsd,
  handleCopy,
  copySuccess,
}) => {
  const { isLiveTrading, toggleLiveTrading } = useLiveTradingStore();
  // Memoizing values that don't change often to avoid recalculation
  const formattedWalletAddress = useMemo(
    () => `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
    [walletAddress]
  );

  const pnlClassName = useMemo(
    () => (unrealizedPNL >= 0 ? "text-green-500" : "text-red-500"),
    [unrealizedPNL]
  );

  const totalValueDisplay = useMemo(
    () =>
      totalValueInUsd !== null ? `$${totalValueInUsd.toFixed(2)}` : "$0.00",
    [totalValueInUsd]
  );

  const handleCopyMemo = useCallback(() => {
    handleCopy();
  }, [handleCopy]);

  const toggleLiveTradingMemo = useCallback(() => {
    toggleLiveTrading();
  }, [toggleLiveTrading]);

  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-light">
            Unrealized PNL:{" "}
            <span className={pnlClassName}>{unrealizedPNL.toFixed(2)}%</span>
          </p>
          <p className="text-xs text-primary font-light ">
            $ {unrealizedPNLUSD.toFixed(2)}
          </p>
        </div>
        <button
          className="flex gap-1 items-center text-xs text-accent rounded-xl bg-black border border-accent px-3 py-1"
          onClick={toggleLiveTradingMemo}
        >
          {isLiveTrading ? (
            <>
              <FaFlask className="text-sm text-yellow-400" /> Demo Mode
            </>
          ) : (
            <>
              <FaPlayCircle className="text-sm text-green-400" /> Live Trading
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <p
          className="flex gap-1 relative text-sm items-baseline text-primary cursor-pointer"
          onClick={handleCopyMemo}
        >
          <span>{formattedWalletAddress}</span>
          {copySuccess ? (
            <FaCheck className="text-[10px]" />
          ) : (
            <IoCopyOutline className="text-[10px]" title="Copy Address" />
          )}
        </p>
        <h2 className="text-[34px] ">{walletBalance} SOL</h2>
        <p className="text-primary flex gap-[2px] items-center">
          {totalValueDisplay} <CiCircleAlert className="text-xs" />
        </p>
      </div>

      <div className="flex justify-center items-center text-sm gap-1 pt-2 font-poppins">
        {isLiveTrading ? (
          <>
            Live <GiPlainCircle className="text-[#FF0000] text-xs font-light" />
          </>
        ) : (
          <>
            Demo <GiPlainCircle className="text-[#1DD75B] text-xs font-light" />
          </>
        )}
      </div>
    </>
  );
};

export default WalletInfo;
