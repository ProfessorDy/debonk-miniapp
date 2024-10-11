"use client";

import React, { useState, useEffect } from "react";
import { IoCopySharp, IoWalletOutline } from "react-icons/io5";
import { PiDownloadDuotone, PiTestTubeFill } from "react-icons/pi";
import { SlRefresh } from "react-icons/sl";
import { CiCircleAlert } from "react-icons/ci";
import { GiPlainCircle } from "react-icons/gi";
import { copyToClipboard } from "@/utils/clipboardUtils";
import DepositModal from "@/components/DepositModal";
import WithdrawModal from "@/components/WithdrawModal";
import useTelegramUserStore from "@/store/useTelegramUserStore";
import useLiveTradingStore from "@/store/useLiveTradingStore";

type Position = {
  name: string;
  value: number;
  price: number;
  change: number;
  mc: string;
  liq: string;
  valueInUsd: number;
};

// Helper function to fetch SOL price from the API
const fetchSolPrice = async () => {
  const response = await fetch("/api/solPrice");
  const data = await response.json();
  if (response.ok) {
    return data.solUsdPrice; // Use the solUsdPrice as needed
  } else {
    console.error(data.error);
  }
};

// Helper function to fetch the user's wallet and simulation balances
async function fetchWalletBalance(telegramId: string) {
  const res = await fetch(`/api/getUserSolanaBalance?telegramId=${telegramId}`);
  const data = await res.json();
  return {
    balance: data.balance, // Solana balance
    simulationBalance: data.simulationBalance, // Simulation balance
  };
}

// Helper function to fetch the user's active positions
async function fetchUserPositions(telegramId: string) {
  const res = await fetch(`/api/getUserPositions?telegramId=${telegramId}`);
  const data = await res.json();
  return data.positions; // assuming positions are returned in an array
}

const Home = () => {
  const [walletAddress, setWalletAddress] = useState("A1BbDsD4E5F6G7HHtQJ");
  const [error, setError] = useState<string | null>(null); //eslint-disable-line
  const [unrealizedPNL] = useState("-0.00%");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const [solPrice, setSolPrice] = useState<number | null>(null); //eslint-disable-line
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [totalValueInUsd, setTotalValueInUsd] = useState<number | null>(null);
  const [positions, setPositions] = useState<Position[]>([]); //eslint-disable-line

  const setUserId = useTelegramUserStore((state) => state.setUserId);
  const isLiveTrading = useLiveTradingStore((state) => state.isLiveTrading);
  const toggleLiveTrading = useLiveTradingStore(
    (state) => state.toggleLiveTrading
  );

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;

    if (telegram?.initDataUnsafe?.user) {
      const { id: userId } = telegram.initDataUnsafe.user;

      setUserId(userId.toString());

      const getSolData = async () => {
        try {
          const price = await fetchSolPrice();
          setSolPrice(price);

          const { balance, simulationBalance } = await fetchWalletBalance(
            userId.toString()
          );

          const parsedBalance = parseFloat(balance) || 0;
          const parsedSimulationBalance = parseFloat(simulationBalance) || 0;

          if (isLiveTrading) {
            setWalletBalance(parsedBalance);
          } else {
            setWalletBalance(parsedSimulationBalance);
          }

          if (price !== null && price !== undefined) {
            const totalValue =
              (isLiveTrading ? parsedBalance : parsedSimulationBalance) * price;
            setTotalValueInUsd(totalValue);
          }

          // Fetch active positions
          const userPositions = await fetchUserPositions(userId.toString());
          if (userPositions.length === 0) {
            setPositions([]);
            console.log("No active positions found.");
          } else {
            setPositions(userPositions);
            console.log("Fetched User Positions:", userPositions);
          }
        } catch (error) {
          console.error(
            "Error fetching SOL price, balance, or positions",
            error
          );
        }
      };

      getSolData();
    }
  }, [setWalletBalance, setUserId, isLiveTrading]);

  useEffect(() => {
    console.log("Component mounted. Checking Telegram WebApp user data...");

    const telegram = window.Telegram?.WebApp;
    if (telegram?.initDataUnsafe?.user) {
      const { id: userId } = telegram.initDataUnsafe.user;

      // Use dynamic URL for the API request
      const apiUrl = `/api/getAddressFromTelegramId?telegramId=${userId}`;
      console.log("apiUrl", apiUrl);
      console.log("Fetching Solana wallet address for Telegram ID:", userId);

      // Fetch Solana address for the user
      fetch(apiUrl)
        .then(async (response) => {
          const contentType = response.headers.get("content-type");

          if (!response.ok) {
            const errorText = await response.text(); // Get HTML error page if any
            throw new Error(`Error ${response.status}: ${errorText}`);
          }

          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            throw new Error("Invalid response format. Expected JSON.");
          }
        })
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
  }, [setWalletAddress]);

  const handleOpenDepositModal = () => setIsDepositModalOpen(true);
  const handleOpenWithdrawModal = () => setIsWithdrawModalOpen(true);
  const handleCloseWithdrawModal = () => setIsWithdrawModalOpen(false);
  const handleCloseDepositModal = () => setIsDepositModalOpen(false);
  const handleCopy = () => copyToClipboard(walletAddress);
  const handleRefresh = () => window.location.reload();

  const buttons = [
    {
      label: "Deposit",
      icon: <IoWalletOutline className="text-[20px]" />,
      action: handleOpenDepositModal,
    },
    {
      label: "Withdraw",
      icon: <PiDownloadDuotone className="text-[20px]" />,
      action: handleOpenWithdrawModal,
    },
    {
      label: "Refresh",
      icon: <SlRefresh className="text-[20px]" />,
      action: handleRefresh,
    },
  ];

  return (
    <main
      className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
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
          <button
            className="flex gap-1 items-center self-centertext-xs text-accent rounded-xl bg-black border border-accent px-3 py-1"
            onClick={toggleLiveTrading}
          >
            {isLiveTrading ? (
              <>
                <PiTestTubeFill className="text-sm" /> Live Trading
              </>
            ) : (
              <>
                <PiTestTubeFill className="text-sm" /> Simulation
              </>
            )}
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
          <h2 className="text-[34px] ">{walletBalance.toFixed(3)} SOL</h2>
          <p className="text-primary flex gap-[2px] items-center">
            {totalValueInUsd !== null
              ? `$${totalValueInUsd.toFixed(2)}`
              : "$0.00"}{" "}
            <CiCircleAlert className="text-xs" />
          </p>
        </div>

        <div className="flex justify-center items-center text-sm gap-1 pt-2 font-poppins">
          {isLiveTrading ? (
            <>
              Live{" "}
              <GiPlainCircle className="text-[#FF0000] text-xs font-light" />
            </>
          ) : (
            <>
              Demo{" "}
              <GiPlainCircle className="text-[#1DD75B] text-xs font-light" />
            </>
          )}
        </div>

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

      <section className="mt-2 mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
        <p className="text-xs font-light">Position Overview</p>
        <div className="flex flex-col gap-2 mt-2">
          {positions.length > 0 ? (
            positions.map((position, idx) => (
              <div
                key={idx}
                className="bg-[#1C1C1C] border-[#2F2F2F] border-[1px] p-3 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-base font-bold">{position.name}</p>
                  <button className="bg-[#333] text-xs text-white py-1 px-2 rounded-md">
                    PNL Card
                  </button>
                </div>
                <div className="text-sm text-gray-400 flex justify-between items-center">
                  <div>
                    <p>MC {position.mc}</p>
                    <p>LIQ {position.liq}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary">{position.value} SOL</p>
                    <p>{position.valueInUsd.toFixed(2)} USD</p>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <p
                    className={`font-bold ${
                      position.change > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {position.change > 0 ? "+" : ""}
                    {position.change}%
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-gray-400">
              You have no active positions at the moment.
            </p>
          )}
        </div>
      </section>

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={handleCloseDepositModal}
        walletAddress={walletAddress}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={handleCloseWithdrawModal}
        availableBalance={walletBalance}
      />
    </main>
  );
};

export default Home;
