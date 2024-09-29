"use client";

import React, { useState } from "react";

const Referrals = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <main
      className="p-3 pb-16 bg-black min-h-screen  bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold mb-2">Earnings</h1>
        <div className="bg-primary rounded-lg py-4 text-center">
          <h2 className="text-2xl">0.002 SOL</h2>
          <a href="#" className="text-sm text-accent">
            View referral rules
          </a>
        </div>
      </div>

      <section className="mb-6">
        <p className="text-sm text-gray-400 mb-4">
          Earn 50% fees through Debonk’s Multi-Level Referral System:
        </p>
        <ul className="text-sm mb-4">
          <li>• 35% for Direct Referrals,</li>
          <li>• 10% for Second-Generation Referrals,</li>
          <li>• 5% for Third-Generation Referrals.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold mb-2">My Direct Referrals</h3>
        <div className="bg-background rounded-lg p-4">
          <div className="flex justify-between items-center">
            <p className="text-sm">3 Direct Referrals</p>
            <button
              onClick={toggleDropdown}
              className="text-accent focus:outline-none"
            >
              {isDropdownOpen ? "Hide Referrals" : "View Referrals"}
            </button>
          </div>

          {/* Dropdown List */}
          {isDropdownOpen && (
            <div className="mt-4 transition-all duration-300 ease-in-out">
              <button className="w-full text-left bg-black py-2 px-4 mb-2 border border-gray-700 rounded-lg">
                <span className="mr-2">Sam Kerr</span>
                <span className="text-accent">+0.002 SOL</span>
              </button>
              <button className="w-full text-left bg-black py-2 px-4 mb-2 border border-gray-700 rounded-lg">
                <span className="mr-2">Sam Kerr</span>
                <span className="text-accent">+0.002 SOL</span>
              </button>
              <button className="w-full text-left bg-black py-2 px-4 mb-2 border border-gray-700 rounded-lg">
                <span className="mr-2">Sam Kerr</span>
                <span className="text-accent">+0.002 SOL</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="fixed bottom-12 left-0 w-full p-4 bg-background flex flex-col gap-4">
        <div className="flex items-center">
          <span className="text-sm">Referral link</span>
          <input
            type="text"
            value="t.me/Debonk_bot?start=8947749837"
            className="ml-4 w-full text-sm bg-black p-2 rounded-lg"
            readOnly
          />
        </div>
        <button className="ml-4 px-4 py-2 bg-accent text-black rounded-lg">
          Invite A Friend
        </button>
      </div>
    </main>
  );
};

export default Referrals;
