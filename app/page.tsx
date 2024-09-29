"use client";

import React, { useState } from "react";
import { FaDownload, FaHistory, FaLock, FaWallet } from "react-icons/fa";
import { IoLinkSharp } from "react-icons/io5";
import { LuRefreshCcw } from "react-icons/lu";

const Home = () => {
  const [balance] = useState("0.000 SOL");
  const [unrealizedPNL] = useState("-0.00%");
  const [tokenInput, setTokenInput] = useState("");

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const clipboardText = await navigator.clipboard.readText();
        setTokenInput(clipboardText);
      } else {
        console.log("Clipboard API not supported");
      }
    } catch (error) {
      console.error("Failed to paste content: ", error);
    }
  };

  return (
    <main
      className="p-4 bg-black min-h-screen  bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      {/* Balance Overview Section */}
      <section className="mb-4 bg-[#3C3C3C3B] border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400">Unrealized PNL: {unrealizedPNL}</p>
            <p className="text-lg font-semibold">$0.00</p>
          </div>
          <LuRefreshCcw size={20} className="cursor-pointer text-accent" />
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold">{balance}</h2>
          <p className="text-gray-400">$0.00</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            className="flex flex-col items-center p-2 text-white  rounded-lg shadow hover:bg-[#1C7496]"
            onClick={() => console.log("Deposit")}
          >
            <FaWallet className="mr-2" /> Deposit
          </button>

          <button
            className="flex flex-col items-center p-2  text-white rounded-lg shadow hover:bg-[#3F9E44]"
            onClick={() => console.log("Withdraw")}
          >
            <FaDownload className="mr-2" /> Withdraw
          </button>

          <button
            className="flex flex-col items-center p-2  text-white rounded-lg shadow hover:bg-[#E6AD12]"
            onClick={() => console.log("History")}
          >
            <FaHistory className="mr-2" /> History
          </button>

          <button
            className="flex flex-col items-center p-2 text-white rounded-lg shadow hover:bg-[#B71C1C]"
            onClick={() => console.log("Export")}
          >
            <FaLock className="mr-2" /> Export
          </button>
        </div>
      </section>

      {/* Position Overview Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Position Overview</h2>
        <ul className="space-y-2">
          {/* Example Position Cells */}
          {[
            { name: "Hexacat", value: 0.5, price: 72.46, change: -98 },
            { name: "Hexacat", value: 0.5, price: 72.46, change: +88 },
            { name: "Hexacat", value: 0.5, price: 72.46, change: -98 },
          ].map((position, idx) => (
            <li
              key={idx}
              className="flex justify-between p-4 bg-background rounded-lg"
            >
              <div>
                <p>{position.name}</p>
                <p className="text-sm text-gray-400">
                  MC: {position.value} sol
                </p>
                <p className="text-sm text-gray-400">LIQ: ${position.price}</p>
              </div>
              <div
                className={`text-lg font-bold ${
                  position.change < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {position.change}%
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="bg-background mt-12  rounded-xl py-[24px] px-[8px] text-sm border-accent border ">
        <div className="flex items-center  text-[#797979]">
          <IoLinkSharp className="text-2xl" />
          <input
            type="text"
            placeholder="Contract Address or Token Link"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-grow px-1 leading-4 bg-background border-none "
          />
          <button onClick={handlePaste} className="text-accent">
            Paste
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
