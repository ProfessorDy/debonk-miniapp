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
  return data.positions;
}

const Home = () => {
  const [loading, setLoading] = useState(true); // Loading state for skeleton
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState<string | null>(null); //eslint-disable-line
  const [unrealizedPNL] = useState("-0.00%");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const [solPrice, setSolPrice] = useState<number | null>(null);
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
        setLoading(true);

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
        } finally {
          setLoading(false);
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

      setLoading(true);

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
        })
        .finally(() => {
          setLoading(false); // End loading
        });
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
      {loading ? (
        // Skeleton loading UI
        <div className="animate-pulse">
          <section className="mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
            {/* Skeleton for Wallet Address */}
            <div className="h-5 bg-gray-700 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-32 mb-4 mx-auto"></div>
            <div className="h-5 bg-gray-700 rounded w-12 mb-4 mx-auto"></div>
          </section>

          {/* Skeleton for Position Overview */}
          <section className="mt-2 mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
            <div className="h-5 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="h-10 bg-gray-700 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-700 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-700 rounded w-full mb-4"></div>
          </section>
        </div>
      ) : (
        <>
          {/* Existing content when data is fetched */}
          <section className="mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
            {/* Wallet Address Section */}
            {/* Existing content here */}
          </section>

          <section className="mt-2 mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
            {/* Position Overview */}
            {/* Existing content here */}
          </section>

          <DepositModal
            isOpen={isDepositModalOpen}
            onClose={handleCloseDepositModal}
            walletAddress={walletAddress}
          />
          <WithdrawModal
            isOpen={isWithdrawModalOpen}
            onClose={handleCloseWithdrawModal}
            solPrice={solPrice}
            availableBalance={walletBalance}
          />
        </>
      )}
    </main>
  );
};

export default Home;
