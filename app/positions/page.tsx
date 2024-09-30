"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import { IoCopySharp } from "react-icons/io5";

const PositionsPage = () => {
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

  return (
    <main
      className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      <h2 className="text-2xl font-semibold text-center font-poppins mb-2">
        Positions
      </h2>
      {/* Positions Table */}
      <div className="space-y-1">
        {positions.map((position, index) => (
          <div key={index} className="bg-background p-4 space-y-2">
            {/* Flex for positioning */}
            <div className="flex justify-between">
              {/* Left side - Name, MC, Liq */}
              <div>
                <div className="flex items-center">
                  <div className="text-lg font-semibold">{position.name}</div>
                  <IoCopySharp
                    className="cursor-pointer text-[10px] "
                    title="Copy Address"
                  />
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
            <button>
              <FaExternalLinkAlt className="text-accent " />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PositionsPage;
