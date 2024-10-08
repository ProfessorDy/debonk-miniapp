"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

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
      console.log("User ID:", userId); // Log the user ID

      const getSolData = async () => {
        try {
          // Fetch SOL price
          const price = await fetchSolPrice();
          console.log("Fetched SOL Price:", price); // Log the fetched SOL price
          setSolPrice(price);

          // Fetch wallet balance
          const { balance, simulationBalance } = await fetchWalletBalance(
            userId.toString()
          );
          console.log(balance);
          console.log(simulationBalance);

          const parsedBalance = parseFloat(balance) || 0; // Ensure number format
          const parsedSimulationBalance = parseFloat(simulationBalance) || 0;

          if (isLiveTrading) {
            setWalletBalance(parsedBalance);
          } else {
            setWalletBalance(parsedSimulationBalance);
          }

          // Ensure price is not null or undefined before calculation
          if (price !== null && price !== undefined) {
            const totalValue =
              (isLiveTrading ? parsedBalance : parsedSimulationBalance) * price;
            setTotalValueInUsd(totalValue);
          } else {
            console.error("SOL price is not available.");
          }

          // Fetch active positions (if necessary)
          const userPositions = await fetchUserPositions(userId.toString());
          console.log("Fetched User Positions:", userPositions);
          setPositions(userPositions);
        } catch (error) {
          console.error(
            "Error fetching SOL price, balance, or positions",
            error
          );
        }
      };

      getSolData();
    } else {
      console.log("No user data available in Telegram WebApp");
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
          <h2 className="text-[34px] ">{walletBalance} SOL</h2>
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

      <section>
        <h2 className="text-[17px] leading-[25.5px] font-poppins mb-2">
          Position Overview
        </h2>
        {positions.length > 0 ? (
          <ul className="space-y-2">
            {positions.map((position, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center p-4 bg-background"
              >
                <div>
                  <p>{position.name}</p>
                  <p className="text-sm text-gray-400">
                    MC: {position.value} sol
                  </p>
                  <p className="text-sm text-gray-400">
                    LIQ: ${position.price}
                  </p>
                </div>
                <div
                  className={`text-[9.45px] px-7 py-[9.45px] rounded-[6.3px] w-[78px] ${
                    position.change < 0 ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {position.change}%
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 text-sm">
            You have no current active positions. Paste a contract address or
            token link.
          </p>
        )}
      </section>

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={handleCloseDepositModal}
        walletAddress={walletAddress}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={handleCloseWithdrawModal}
        walletAddress={walletAddress}
      />
    </main>
  );
};

export default Home;
