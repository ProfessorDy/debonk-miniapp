"use client";

import React, { useState, useEffect } from "react";
import { IoClose, IoCheckmarkDoneCircle } from "react-icons/io5";
import { TiArrowBack } from "react-icons/ti";
import { CgArrowsExchangeV } from "react-icons/cg";
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
  const [availableBalance, setAvailableBalance] = useState(0.0);

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
      setStep(3);
      // handleConfirmAndSend();
    } else if (step === 3) {
      router.push("/");
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.push("/");
    }
  };

  const renderStepOne = () => (
    <div className="bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3 h-[50vh] my-auto">
      <div className="flex items-center justify-between px-2 py-1 rounded-xl w-full relative bg-background">
        <label htmlFor="walletAddress" className="text-primary w-full mr-1">
          Address
          <textarea
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            onBlur={() => validateAddress(walletAddress)}
            placeholder="Enter wallet address"
            className="bg-background text-white w-full   rounded-md focus:outline-none resize-none "
          />
        </label>

        <button className="text-primary" onClick={() => setWalletAddress("")}>
          <IoClose size={18} />
        </button>
      </div>
      {addressError && (
        <p className="text-red-500 text-sm mt-2">{addressError}</p>
      )}
    </div>
  );

  const renderStepTwo = () => (
    <>
      <div className="bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-4 h-[50vh] my-auto flex flex-col justify-between items-center">
        {/* Wallet details */}
        <p className="text-primary font-semibold">
          To:{" "}
          <span className="font-normal text-sm">{`${walletAddress.slice(
            0,
            6
          )}...${walletAddress.slice(-4)}`}</span>
        </p>

        <div className="flex flex-col items-center gap-2 font-poppins">
          <div className="text-5xl text-white font-bold">
            {amount} <span className="text-xl">SOL</span>
          </div>
          <button>
            <CgArrowsExchangeV className="bg-black text-accent" size={28} />
          </button>
          <div className="text-lg font-light">
            ${amount && solPrice ? (amount * solPrice).toFixed(2) : "0.00"}
          </div>
        </div>
        <div></div>
      </div>

      <div className="flex justify-between items-center text-white font-light font-poppins text-sm mt-4">
        <button
          onClick={() => setAmount(availableBalance)}
          className="bg-background px-4 py-2 rounded-md"
        >
          MAX
        </button>
        <span className="">
          Available: {availableBalance !== 0 ? availableBalance.toFixed(3) : 0}{" "}
          SOLANA
        </span>
      </div>
    </>
  );

  const renderSuccess = () => (
    <div className="space-y-36  pt-14">
      <IoCheckmarkDoneCircle size={133} className="mx-auto text-[#439C0CE8]" />

      <div className="text-white">
        <h2 className="font-light text-center">Transaction</h2>
        <div className="px-4 py-5 bg-background flex justify-between items-center w-full rounded-md">
          <div>
            <p className="font-semibold mb-1">Sent</p>
            <p className="font-light text-sm">
              To: {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
            </p>
          </div>
          <p className="text-white font-light">-{amount} SOL</p>
        </div>
      </div>
    </div>
  );

  const renderButtonText = () => {
    if (step === 1) return "Continue";
    if (step === 2) return "Send";
    if (step === 3) return "Close";
  };

  return (
    <main
      className="pt-0 p-3 pb-30 bg-black min-h-screen bg-repeat-y  py-auto"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      {step !== 3 && (
        <div className="flex justify-between items-center text-accent py-4 bg-black mb-4">
          <TiArrowBack size={27} onClick={handlePreviousStep} />
          {step === 2 && (
            <>
              <h2 className="text-white text-2xl font">Amount</h2>
              <IoClose size={27} onClick={() => router.push("/")} />
            </>
          )}
        </div>
      )}

      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
      {step === 3 && renderSuccess()}

      {/* Step-specific button */}
      <div className="mt-4 w-full relative">
        <button
          onClick={handleNextStep}
          className={`${
            step !== 3 && (!walletAddress || addressError)
              ? "bg-accent text-black"
              : "bg-black border border-accent text-accent"
          }   py-5 rounded-xl w-full text-center font-poppins relative -bottom-28`}
          disabled={step === 1 && (!walletAddress || !!addressError)}
        >
          {renderButtonText()}
        </button>
      </div>
    </main>
  );
};

export default Withdraw;
