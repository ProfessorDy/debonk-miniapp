"use client";

import React, { useState } from "react";
import { FaDownload, FaHistory, FaLock, FaWallet } from "react-icons/fa";
import { IoLinkSharp } from "react-icons/io5";

const Swap = () => {
  return (
    <main
      className="p-4 bg-black min-h-screen  bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      <h2 className="text-2xl font-semibold text-white text-center">
        Cross Chain Bridge
      </h2>

      {/* Wallet Input Section */}
      <div className="mt-4">
        <div className="flex justify-between text-white">
          <p>Use Debonk wallet ?</p>
          <p>Balance: 1,2837.47</p>
        </div>
        <div className="flex justify-between items-center mt-2 bg-background p-2 rounded-lg">
          <input
            type="text"
            className="bg-background w-2/3 text-white"
            placeholder="0.00"
          />
          <select className="bg-background text-white">
            <option>USDT BNB</option>
            {/* Add more options here */}
          </select>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center my-4">
        <span className="text-accent">⇌</span>
      </div>

      {/* Second Wallet Input Section */}
      <div className="mt-2">
        <div className="flex justify-between items-center mt-2 bg-background p-2 rounded-lg">
          <input
            type="text"
            className="bg-background w-2/3 text-white"
            placeholder="0.00"
          />
          <select className="bg-background text-white">
            <option>USDC AVAX</option>
            {/* Add more options here */}
          </select>
        </div>
      </div>

      {/* Recipient Address */}
      <div className="mt-4">
        <input
          type="text"
          className="bg-background w-full p-2 text-white rounded-lg"
          placeholder="Recipient address"
        />
        <button className="text-accent mt-2">Paste</button>
      </div>

      {/* Fee Section */}
      <div className="mt-4 text-white">
        <p>
          Fee: <span className="text-accent">$0.00</span>
        </p>
        <p>
          Gas Cost: <span className="text-accent">0.00 BNB</span>
        </p>
        <p>
          Estimated Time For Transfer:{" "}
          <span className="text-accent">0 Min</span>
        </p>
      </div>

      {/* Continue Button */}
      <button className="bg-accent w-full p-3 text-white font-semibold rounded-lg mt-4">
        Continue
      </button>
    </main>
  );
};

export default Swap;
