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
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left text-sm">
          <thead>
            <tr className="text-[#a1a1a1] border-b border-[#2e2e2e]">
              <th className="p-2">Name</th>
              <th className="p-2">MC</th>
              <th className="p-2">Liq</th>
              <th className="p-2">Capital</th>
              <th className="p-2">Value</th>
              <th className="p-2">PNL</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr
                key={index}
                className="bg-[#1c1c1c] border-b border-[#2e2e2e]"
              >
                <td className="p-2 font-semibold">{position.name}</td>
                <td className="p-2">{position.mc}</td>
                <td className="p-2">{position.liq}</td>
                <td className="p-2">{position.capital}</td>
                <td className="p-2">{position.value}</td>
                <td className={`p-2 font-bold ${position.pnlColor}`}>
                  {position.pnl}{" "}
                  <span className="text-xs">({position.pnlSol})</span>{" "}
                  <span className="text-xs">{position.pnlPercentage}</span>
                </td>
                <td className="p-2 text-right">
                  <button className="text-[#3B82F6]">Descreener</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
