"use client";

import React, { useState, useEffect } from "react";
import { PiDownloadDuotone } from "react-icons/pi";
import { IoCopySharp, IoWalletOutline } from "react-icons/io5";
import { PiTestTubeFill } from "react-icons/pi";
import { CiCircleAlert } from "react-icons/ci";
import { SlRefresh } from "react-icons/sl";
import { copyToClipboard } from "@/utils/clipboardUtils";
import { GiPlainCircle } from "react-icons/gi";
import DepositModal from "@/components/DepositModal";

import {
  verifyTelegramWebAppData,
  getAddressFromTelegramId,
} from "./actions/utils";

//eslint-disable-next-line
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium: boolean;
}

const Home = () => {
  const [telegramId, setTelegramId] = useState<number | null>(null); //eslint-disable-line
  const [walletAddress, setWalletAddress] = useState("A1BbDsD4E5F6G7HHtQJ");
  const [error, setError] = useState<string | null>(null); //eslint-disable-line

  const [balance] = useState("0.000");
  const [unrealizedPNL] = useState("-0.00%");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const telegramInitData = new URLSearchParams(window.location.search).get(
    "initData"
  );

  useEffect(() => {
    const verifyAndFetchAddress = async () => {
      if (!telegramInitData) {
        setError("No initialization data provided.");
        return;
      }

      // Verify the Telegram WebApp initialization data
      const isValid = verifyTelegramWebAppData(telegramInitData);

      if (!isValid) {
        setError("Invalid Telegram WebApp data.");
        return;
      }

      try {
        // Parse the Telegram ID from initData (assumed to be part of the query params)
        const params = new URLSearchParams(telegramInitData);
        const userId = params.get("user")
          ? JSON.parse(params.get("user")!)?.id
          : null;

        if (!userId) {
          setError("Failed to retrieve Telegram ID.");
          return;
        }

        // Save the Telegram ID in state
        setTelegramId(userId);

        // Get the Solana address using the Telegram ID
        const solanaAddress = getAddressFromTelegramId(userId);
        setWalletAddress(solanaAddress);
      } catch (err) {
        console.error("Error fetching address:", err);
        setError("Failed to fetch Solana address.");
      }
    };

    verifyAndFetchAddress();
  }, [telegramInitData]);

  const buttons = [
    {
      label: "Deposit",
      icon: <IoWalletOutline className="text-[20px]" />,
      action: () => handleOpenModal(),
    },
    {
      label: "Withdraw",
      icon: <PiDownloadDuotone className="text-[20px]" />,
      action: () => console.log("Withdraw"),
    },
    {
      label: "Refresh",
      icon: <SlRefresh className="text-[20px]" />,
      action: () => console.log("History"),
    },
  ];

  const handleOpenModal = () => {
    setIsDepositModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDepositModalOpen(false);
  };

  const handleCopy = () => copyToClipboard(walletAddress);

  return (
    <main
      className=" pt-0 p-3 pb-20 bg-black min-h-screen  bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={handleCloseModal}
        walletAddress={walletAddress}
      />

      {/* Wallet Address Section */}
      <section className="mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3 ">
        {/* Balance Overview Section */}
        <div className="flex justify-between items-start ">
          <div>
            <p className="text-sm font-light">
              Unrealized PNL:{" "}
              <span className="text-red-500">{unrealizedPNL}</span>
            </p>
            <p className="text-xs text-primary font-light ">$0.00</p>
          </div>
          <button className="flex gap-1 items-center text-xs text-accent rounded-xl bg-black border border-accent px-3 py-1">
            <PiTestTubeFill className="text-sm" />
            Simulation
          </button>
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
          <h2 className="text-[34px] ">{balance} SOL</h2>
          <p className="text-primary flex gap-[2px] items-center">
            $0.00 <CiCircleAlert className="text-xs" />
          </p>
        </div>
        <button className="flex text-sm gap-1  pt-2 items-center mx-auto font-poppins">
          Demo <GiPlainCircle className="text-[#1DD75B] text-xs font-light" />
        </button>
        {/* Action Buttons */}
        <div className="flex w-3/5 mx-auto justify-between mt-4 text-[10px] text-accent font-light">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-[3px] p-2 rounded-lg shadow border border-accent w-[60px]"
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
        <h2 className="text-[17px] leading-[25.5px] font-poppins mb-2">
          Position Overview
        </h2>
        <ul className="space-y-2">
          {/* Example Position Cells */}
          {[
            { name: "Hexacat", value: 0.5, price: 72.46, change: -98 },
            { name: "Hexacat", value: 0.5, price: 72.46, change: +88 },
            { name: "Hexacat", value: 0.5, price: 72.46, change: -98 },
          ].map((position, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center p-4 bg-background"
            >
              <div>
                <p>{position.name}</p>
                <p className="text-sm text-gray-400">
                  MC: {position.value} sol
                </p>
                <p className="text-sm text-gray-400">LIQ: ${position.price}</p>
              </div>
              <div
                className={`text-[9.45px] px-7 py-[9.45px] rounded-[6.3px] w-[78px]  ${
                  position.change < 0 ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {position.change}%
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Home;
