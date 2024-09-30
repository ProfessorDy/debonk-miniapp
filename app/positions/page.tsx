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
      value: "0.50 SOL",
      pnl: "-$1.72",
      pnlColor: "text-red-500", // Loss styling
    },
    {
      name: "Hexacat",
      mc: "S3165",
      liq: "$72.46",
      capital: "0.50 SOL",
      value: "0.50 SOL",
      pnl: "+$1.93",
      pnlColor: "text-green-500", // Profit styling
    },
    // Add more positions here as needed
  ];

  const handlePaste = async () => {
    const clipboardText = await pasteFromClipboard();
    if (clipboardText) {
      setTokenInput(clipboardText);
    }
  };

  return (
    <main
      className=" pt-0 p-4 pb-20 bg-black min-h-screen  bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Positions Overview</h1>
      </header>

      {/* Positions List */}
      <div className="space-y-4">
        {positions.map((position, index) => (
          <div
            key={index}
            className="bg-background p-4 rounded-lg shadow-md space-y-2"
          >
            {/* Position Header */}
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">{position.name}</div>
              <FaExternalLinkAlt className="text-accent" />
            </div>

            {/* Position Details */}
            <div className="flex justify-between items-center text-sm">
              <div>
                <p>MC {position.mc}</p>
                <p>Liq {position.liq}</p>
              </div>
              <div>
                <p>Capital: {position.capital}</p>
                <p>Value: {position.value}</p>
              </div>
              <div className={`font-bold ${position.pnlColor}`}>
                PNL: {position.pnl}
              </div>
            </div>

            {/* Action Button */}
            <div className="text-right">
              <button className="text-accent">Descreener</button>
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
