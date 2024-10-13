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

  const renderStepOne = () => (
    <div className="flex flex-col justify-between h-full">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Enter Withdrawal Details
      </h2>

      <div className="flex flex-col items-start mb-4 w-full">
        <label htmlFor="walletAddress" className="text-gray-400 mb-2">
          Wallet Address
        </label>
        <input
          type="text"
          id="walletAddress"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          onBlur={() => validateAddress(walletAddress)}
          placeholder="Enter wallet address"
          className="bg-gray-800 text-white p-3 w-full rounded-md"
        />
        {addressError && (
          <p className="text-red-500 text-sm mt-2">{addressError}</p>
        )}
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="text-5xl text-white font-bold">{amount} SOL</div>
        <div className="text-base text-gray-400">
          ${amount && solPrice ? (amount * solPrice).toFixed(2) : "0.00"}
        </div>
      </div>

      <div className="flex justify-between text-white mb-4">
        <button
          onClick={() => setAmount(availableBalance)}
          className="bg-gray-800 px-4 py-2 rounded-md"
        >
          MAX
        </button>
        <span className="text-gray-500">Available: {availableBalance} SOL</span>
      </div>

      <button
        onClick={() => {
          if (validateAddress(walletAddress)) {
            setStep(2);
          }
        }}
        className={`${
          !walletAddress || addressError ? "bg-gray-600" : "bg-[#0493CC]"
        } text-white font-semibold py-3 rounded-lg w-full mb-6`}
        disabled={!walletAddress || !!addressError}
      >
        Continue
      </button>
    </div>
  );

  const renderStepTwo = () => (
    <div className="flex flex-col justify-between h-full">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Confirm Withdrawal
      </h2>

      <div className="bg-gray-900 p-4 rounded-lg text-left text-gray-300 mb-4">
        <div className="mb-2">Address: {walletAddress}</div>
        <div>Amount: {amount} SOL</div>
      </div>

      <button
        onClick={handleConfirmAndSend}
        className="bg-[#0493CC] text-white font-semibold py-3 rounded-lg w-full mb-6"
      >
        Confirm & Send
      </button>
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
      <button
        onClick={() => router.push("/")}
        className="bg-[#0493CC] text-white font-semibold py-3 rounded-lg w-full mb-6"
      >
        Close
      </button>
    </div>
  );

  return (
    <main className="bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-[#1B1B1B] w-full max-w-md p-6 text-center shadow-lg relative rounded-lg flex flex-col">
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 text-white"
        >
          <IoClose size={24} />
        </button>

        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderSuccess()}
      </div>
    </main>
  );
};

export default Withdraw;
