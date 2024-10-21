import React from "react";
import { CiCircleAlert } from "react-icons/ci";
import { GiPlainCircle } from "react-icons/gi";
import { FaCheck, FaFlask, FaPlayCircle } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";

interface WalletInfoProps {
  walletAddress: string;
  unrealizedPNL: string;
  walletBalance: number;
  totalValueInUsd: number | null;
  handleCopy: () => void;
  isLiveTrading: boolean;
  toggleLiveTrading: () => void;
  copySuccess: boolean;
}

const WalletInfo: React.FC<WalletInfoProps> = ({
  walletAddress,
  unrealizedPNL,
  walletBalance,
  totalValueInUsd,
  handleCopy,
  isLiveTrading,
  toggleLiveTrading,
  copySuccess,
}) => {
  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-light">
            Unrealized PNL:{" "}
            <span className="text-red-500">{unrealizedPNL}</span>
          </p>
          <p className="text-xs text-primary font-light ">$0.00</p>
        </div>
        <button
          className="flex gap-1 items-center text-xs text-accent rounded-xl bg-black border border-accent px-3 py-1"
          onClick={toggleLiveTrading} // Now using the toggle function passed via props
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
          onClick={handleCopy}
        >
          <span>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(
            -4
          )}`}</span>
          {copySuccess ? (
            <FaCheck className="text-[10px]" />
          ) : (
            <IoCopyOutline className="text-[10px]" title="Copy Address" />
          )}
        </p>
        <h2 className="text-[34px] ">{walletBalance} SOL</h2>
        <p className="text-primary flex gap-[2px] items-center">
          {totalValueInUsd !== null
            ? `$${totalValueInUsd.toFixed(2)}`
            : "$0.00"}{" "}
          <CiCircleAlert className="text-xs" />
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
