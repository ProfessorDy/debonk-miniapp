"use client";

import React, { useState, useEffect } from "react";
import { PiStrategy, PiDownloadDuotone } from "react-icons/pi";
import { IoCopySharp, IoLinkSharp, IoWalletOutline } from "react-icons/io5";
import { LuRefreshCcw } from "react-icons/lu";
import { MdOutlineHistory } from "react-icons/md";
import { copyToClipboard, pasteFromClipboard } from "@/utils/clipboardUtils";
import DepositModal from "@/components/DepositModal";

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium: boolean;
}

const Home = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const [balance] = useState("0.000");
  const [unrealizedPNL] = useState("-0.00%");
  const [tokenInput, setTokenInput] = useState("");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const walletAddress = userData?.first_name || "A1BbDsD4E5F6G7HHtQJ";

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user) {
        setUserData(user as UserData);
        console.log("userData", user);
      } else {
        console.log("User data not found.");
      }
    } else {
      console.log("Telegram WebApp is not available.");
    }
  }, []);

  const buttons = [
    {
      label: "Deposit",
      icon: <IoWalletOutline size={27} />,
      action: () => handleOpenModal(),
    },
    {
      label: "Withdraw",
      icon: <PiDownloadDuotone size={27} />,
      action: () => console.log("Withdraw"),
    },
    {
      label: "History",
      icon: <MdOutlineHistory size={27} />,
      action: () => console.log("History"),
    },
    {
      label: "Simulation",
      icon: <PiStrategy size={27} />,
      action: () => console.log("Simulation"),
    },
  ];

  const handleOpenModal = () => {
    setIsDepositModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDepositModalOpen(false);
  };

  const handleCopy = () => copyToClipboard(walletAddress);

  const handlePaste = async () => {
    const clipboardText = await pasteFromClipboard();
    if (clipboardText) {
      setTokenInput(clipboardText);
    }
  };

  return (
    <main
      className="p-4 pb-18 bg-black min-h-screen  bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={handleCloseModal}
        walletAddress={walletAddress}
      />

      {/* Wallet Address Section */}
      <section className="mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3 pb-6">
        {/* Balance Overview Section */}
        <div className="flex justify-between items-start ">
          <div>
            <p className="text-sm">
              Unrealized PNL:{" "}
              <span className="text-red-500">{unrealizedPNL}</span>
            </p>
            <p className="text-xs text-primary font-semibold">$0.00</p>
          </div>
          <LuRefreshCcw size={27} className="cursor-pointer text-accent" />
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="flex gap-1 relative text-sm items-baseline text-primary">
            <span>
              {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
            </span>
            <IoCopySharp
              className="cursor-pointer text-[10px] "
              onClick={handleCopy}
              title="Copy Address"
            />
          </p>
          <h2 className="text-3xl font-bold">{balance} SOL</h2>
          <p className="text-primary">$0.00</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8 text-[10px] text-accent ">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-2 rounded-lg shadow border border-accent"
              onClick={button.action}
            >
              {button.icon}
              {button.label}
            </button>
          ))}
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
              className="flex justify-between items-center p-4 bg-background rounded-lg"
            >
              <div>
                <p>{position.name}</p>
                <p className="text-sm text-gray-400">
                  MC: {position.value} sol
                </p>
                <p className="text-sm text-gray-400">LIQ: ${position.price}</p>
              </div>
              <div
                className={`text-[9.45px] px-7 py-[7.87px] rounded-[6.3px]   ${
                  position.change < 0 ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {position.change}%
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="bg-background mt-12 sticky bottom-16 rounded-xl py-[24px] px-[8px] text-sm border-accent border ">
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
