"use client";

import React, { useState, useEffect } from "react";
import { IoCopySharp, IoWalletOutline } from "react-icons/io5";
import { PiDownloadDuotone, PiTestTubeFill } from "react-icons/pi";
import { SlRefresh } from "react-icons/sl";
import { CiCircleAlert } from "react-icons/ci";
import { GiPlainCircle } from "react-icons/gi";
import { copyToClipboard } from "@/utils/clipboardUtils";
import DepositModal from "@/components/DepositModal";

const ClientHome = () => {
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [walletAddress, setWalletAddress] = useState("A1BbDsD4E5F6G7HHtQJ");
  const [error, setError] = useState<string | null>(null);
  const [balance] = useState("0.000");
  const [unrealizedPNL] = useState("-0.00%");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  useEffect(() => {
    console.log("Component mounted. Checking Telegram WebApp user data...");

    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      console.log("Telegram user data found:", user);

      const userId = user.id;
      setTelegramId(userId);

      // Call the API to get the Solana address
      console.log("Fetching Solana wallet address for Telegram ID:", userId);
      fetch(`/api/solana?telegramId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.address) {
            setWalletAddress(data.address);
            console.log("Wallet address set:", data.address);
          } else {
            setError(data.error || "Failed to fetch Solana address.");
            console.log("Error fetching Solana address:", data.error);
          }
        })
        .catch((err) => {
          console.error("Error fetching address:", err);
          setError("Failed to fetch Solana address.");
        });
    } else {
      setError("Telegram user data is not available.");
      console.log("No Telegram user data available.");
    }
  }, []);

  const handleOpenModal = () => setIsDepositModalOpen(true);
  const handleCloseModal = () => setIsDepositModalOpen(false);
  const handleCopy = () => copyToClipboard(walletAddress);

  const buttons = [
    {
      label: "Deposit",
      icon: <IoWalletOutline className="text-[20px]" />,
      action: handleOpenModal,
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

  return (
    <section className="mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
      {/* Wallet Address Section */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-light">
            Unrealized PNL:{" "}
            <span className="text-red-500">{unrealizedPNL}</span>
          </p>
          <p className="text-xs text-primary font-light ">$0.00</p>
        </div>
        <button className="flex gap-1 items-center text-xs text-accent rounded-xl bg-black border border-accent px-3 py-1">
          <PiTestTubeFill className="text-sm" /> Simulation
        </button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <p className="flex gap-1 relative text-sm items-baseline text-primary">
          <span>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(
            -4
          )}`}</span>
          <IoCopySharp
            className="cursor-pointer text-[10px]"
            onClick={handleCopy}
            title="Copy Address"
          />
        </p>
        <h2 className="text-[34px] ">{balance} SOL</h2>
        <p className="text-primary flex gap-[2px] items-center">
          $0.00 <CiCircleAlert className="text-xs" />
        </p>
      </div>

      <button className="flex text-sm gap-1 pt-2 items-center mx-auto font-poppins">
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

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={handleCloseModal}
        walletAddress={walletAddress}
      />
    </section>
  );
};

export default ClientHome;
