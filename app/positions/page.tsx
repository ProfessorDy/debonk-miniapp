"use client";

import { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoLinkSharp } from "react-icons/io5";
import { pasteFromClipboard } from "@/utils/clipboardUtils";

const PositionsPage = () => {
  const [tokenInput, setTokenInput] = useState("");
  const positions = [
    {
      name: "Hexacat",
      mc: "S3165",
      liq: "$72.46",
      capital: "0.50 SOL",
      value: "0.00 SOL",
      pnl: "-$72",
      pnlSol: "-0.49 SOL",
      pnlPercentage: "-98%",
      pnlColor: "text-red-500", // Loss styling
    },
    {
      name: "Hexacat",
      mc: "S3165",
      liq: "$72.46",
      capital: "0.50 SOL",
      value: "0.00 SOL",
      pnl: "-$72",
      pnlSol: "-0.49 SOL",
      pnlPercentage: "-98%",
      pnlColor: "text-red-500", // Loss styling
    },
    {
      name: "Hexacat",
      mc: "S3165",
      liq: "$72.46",
      capital: "0.50 SOL",
      value: "0.00 SOL",
      pnl: "-$72",
      pnlSol: "-0.49 SOL",
      pnlPercentage: "-98%",
      pnlColor: "text-red-500", // Loss styling
    },
    {
      name: "Hexacat",
      mc: "S3165",
      liq: "$72.46",
      capital: "0.50 SOL",
      value: "0.00 SOL",
      pnl: "-$72",
      pnlSol: "-0.49 SOL",
      pnlPercentage: "-98%",
      pnlColor: "text-red-500", // Loss styling
    },
    {
      name: "Hexacat",
      mc: "S3165",
      liq: "$72.46",
      capital: "0.50 SOL",
      value: "0.00 SOL",
      pnl: "-$72",
      pnlSol: "-0.49 SOL",
      pnlPercentage: "-98%",
      pnlColor: "text-red-500", // Loss styling
    },
  ];

  const handlePaste = async () => {
    const clipboardText = await pasteFromClipboard();
    if (clipboardText) {
      setTokenInput(clipboardText);
    }
  };

  return (
    <main
      className="pt-0 p-4 pb-20 bg-black min-h-screen bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      <h2 className="text-2xl font-semibold text-center font-poppins mb-2">
        Positions
      </h2>

      {/* Positions Table */}
      <div className="space-y-4">
        {positions.map((position, index) => (
          <div
            key={index}
            className="bg-background p-4 rounded-lg shadow-md space-y-2"
          >
            {/* Flex for positioning */}
            <div className="flex justify-between">
              {/* Left side - Name, MC, Liq */}
              <div>
                <div className="flex items-center">
                  <div className="text-lg font-semibold">{position.name}</div>
                  <FaExternalLinkAlt className="text-accent ml-2" />
                </div>
                <p className="text-sm">MC {position.mc}</p>
                <p className="text-sm">Liq {position.liq}</p>
              </div>

              {/* Right side - Capital, Value, PNL */}
              <div className="flex items-center space-x-6">
                <div className="text-sm">
                  <p>Capital</p>
                  <p className="text-white font-medium">{position.capital}</p>
                </div>
                <div className="text-sm">
                  <p>Value</p>
                  <p className="text-white font-medium">{position.value}</p>
                </div>
                <div className={`text-sm font-bold ${position.pnlColor}`}>
                  PNL: {position.pnl}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contract Input */}
      <div>
        <div className="bg-background mt-12 sticky bottom-20 rounded-xl py-[24px] px-[8px] text-sm border-accent border ">
          <div className="flex items-center  text-[#797979]">
            <IoLinkSharp className="text-2xl" />
            <input
              type="text"
              placeholder="Contract Address or Token Link"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-grow px-1 leading-4 bg-background font-light border-none focus:outline-none"
            />
            <button onClick={handlePaste} className="text-accent">
              Paste
            </button>
          </div>
        </div>
        <button className="bg-[#79797982] font-light mt-2 text-xs rounded-lg p-[10px] w-[120px] relative">
          View On Solscan
          <FaExternalLinkAlt className="text-accent text-[7px] absolute right-[6px] top-[6px]" />
        </button>
      </div>
    </main>
  );
};

export default PositionsPage;
