"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import useTelegramUserStore from "@/store/useTelegramUserStore";
import { useRouter } from "next/navigation";
import { PublicKey } from "@solana/web3.js";
import { fetchSolPrice, fetchWalletBalance } from "@/utils/apiUtils";

const Withdraw = () => {
  const { userId } = useTelegramUserStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(0.0);
  const [walletAddress, setWalletAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [solPrice, setSolPrice] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);

  useEffect(() => {
    const getSolData = async () => {
      try {
        const price = await fetchSolPrice();
        setSolPrice(price);

        const { balance } = await fetchWalletBalance(userId);
        const parsedBalance = parseFloat(balance) || 0;

        setAvailableBalance(parsedBalance);
      } catch (error) {
        console.error("Error fetching SOL price or balance", error);
      }
    };

    getSolData();
  }, [userId]);

  const handleConfirmAndSend = async () => {
    try {
      const response = await fetch(
        `/api/withdrawSol?telegramId=${userId}&amount=${amount}&destinationAddress=${walletAddress}`
      );
      const result = await response.json();
      if (response.ok) {
        setStep(3); // Move to success screen
      } else {
        console.error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Error while processing withdrawal:", error);
    }
  };

  const validateAddress = (address: string) => {
    try {
      const pubKey = new PublicKey(address);
      if (PublicKey.isOnCurve(pubKey)) {
        setAddressError("");
        return true;
      } else {
        setAddressError("Invalid wallet address. Not on curve.");
        return false;
      }
    } catch (error) {
      setAddressError("Invalid wallet address.");
      console.log("Invalid sol address", error);
      return false;
    }
  };

  const handleNextStep = () => {
    if (step === 1 && validateAddress(walletAddress)) {
      setStep(2);
    } else if (step === 2) {
      handleConfirmAndSend();
    } else if (step === 3) {
      router.push("/");
    }
  };

  const renderStepOne = () => (
    <div className="bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3 h-[60vh] my-auto">
      <div className="flex flex-col items-start mb-4 w-full relative">
        <label htmlFor="walletAddress" className="text-gray-400 mb-2">
          Address
        </label>
        <input
          type="text"
          id="walletAddress"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          onBlur={() => validateAddress(walletAddress)}
          placeholder="Enter wallet address"
          className="bg-gray-800 text-white p-3 w-full rounded-md pr-10"
        />
        <button
          className="absolute right-3 top-10 text-gray-400"
          onClick={() => setWalletAddress("")}
        >
          <IoClose size={18} />
        </button>
        {addressError && (
          <p className="text-red-500 text-sm mt-2">{addressError}</p>
        )}
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3 h-[60vh] my-auto">
      <h2>Amount</h2>

      <div className="flex flex-col items-center mb-6">
        <div className="text-6xl text-white font-bold">{amount} SOL</div>
        <div className="text-base text-gray-400">
          ${amount && solPrice ? (amount * solPrice).toFixed(2) : "0.00"}
        </div>
      </div>
      {/* Wallet details */}
      <div className="bg-gray-900 p-4 rounded-md mb-6 w-full">
        <div className="flex items-center justify-between">
          <span className="text-white">To:</span>
          <span className="text-gray-400">{`${walletAddress.slice(
            0,
            6
          )}...${walletAddress.slice(-4)}`}</span>
        </div>
      </div>
      <div className="flex justify-between items-center text-white mb-4">
        <button
          onClick={() => setAmount(availableBalance)}
          className="bg-gray-800 px-4 py-2 rounded-md"
        >
          MAX
        </button>
        <span className="text-gray-500">Available: {availableBalance} SOL</span>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="bg-green-500 rounded-full p-6 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-white mb-6">
        Transaction Sent
      </h2>
      <div className="text-gray-400 mb-6">To: {walletAddress}</div>
      <div className="text-white mb-6">- {amount} SOL</div>
    </div>
  );

  const renderButtonText = () => {
    if (step === 1) return "Continue";
    if (step === 2) return "Send";
    if (step === 3) return "Close";
  };

  return (
    <main
      className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y "
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
      {step === 3 && renderSuccess()}

      {/* Step-specific button */}
      <div className="mt-4 w-full">
        <button
          onClick={handleNextStep}
          className={`${
            step === 1 && (!walletAddress || addressError)
              ? "bg-gray-600"
              : "bg-[#0493CC]"
          } text-white font-semibold py-3 rounded-lg w-full`}
          disabled={step === 1 && (!walletAddress || !!addressError)}
        >
          {renderButtonText()}
        </button>
      </div>
    </main>
  );
};

export default Withdraw;
