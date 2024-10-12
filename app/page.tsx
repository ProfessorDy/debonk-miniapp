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
  const [walletAddress, setWalletAddress] = useState("A1BbDsD4E5F6G7HHtQJ");
  const [error, setError] = useState<string | null>(null); //eslint-disable-line
  const [unrealizedPNL] = useState("-0.00%");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [totalValueInUsd, setTotalValueInUsd] = useState<number | null>(null);
  const [positions, setPositions] = useState<Position[]>([]); //eslint-disable-line

  const [loading, setLoading] = useState(true); // Added loading state

  const setUserId = useTelegramUserStore((state) => state.setUserId);
  const isLiveTrading = useLiveTradingStore((state) => state.isLiveTrading);
  const toggleLiveTrading = useLiveTradingStore(
    (state) => state.toggleLiveTrading
  );

  // Fetch data on mount
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
          setPositions(userPositions.length > 0 ? userPositions : []);
          setLoading(false); // Data has finished loading
        } catch (error) {
          console.error(
            "Error fetching SOL price, balance, or positions",
            error
          );
          setLoading(false); // Stop loading even if there's an error
        }
      };

      getSolData();
    }
  }, [setWalletBalance, setUserId, isLiveTrading]);

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

  if (loading) {
    // Show a loading skeleton while data is being fetched
    return (
      <main
        className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y"
        style={{ backgroundImage: "url('/Rectangle.png')" }}
      >
        {/* Skeleton Placeholder */}
        <section className="animate-pulse mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
          <div className="h-6 w-1/3 bg-gray-700 rounded-md mb-4"></div>
          <div className="h-12 w-1/2 bg-gray-700 rounded-md mb-4 mx-auto"></div>
          <div className="h-4 w-1/4 bg-gray-700 rounded-md mb-2 mx-auto"></div>
          <div className="flex justify-center gap-2">
            <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
          </div>
        </section>

        <section className="animate-pulse bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
          <div className="h-6 w-1/3 bg-gray-700 rounded-md mb-4"></div>
          <div className="h-12 w-full bg-gray-700 rounded-md mb-4"></div>
          <div className="h-12 w-full bg-gray-700 rounded-md"></div>
        </section>
      </main>
    );
  }

  return (
    <main
      className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      {/* Normal content when loading is complete */}
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
          <p className="flex gap-1 items-center text-center text-lg">
            SOL Balance:{" "}
            <span className="text-[#0493CC]">
              ${totalValueInUsd?.toFixed(2)}
            </span>
          </p>
          <div
            className="flex gap-1 items-center text-xs cursor-pointer text-accent underline"
            onClick={handleCopy}
          >
            {walletAddress}
            <IoCopySharp className="text-accent" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              className="flex flex-col items-center justify-center gap-1 bg-black text-accent text-xs rounded-lg border border-accent w-20 p-2"
              onClick={btn.action}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
        {/* Positions Table */}
        <h4 className="text-xs font-light mb-3">Active Positions</h4>

        {positions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1">
            <CiCircleAlert className="text-[#0493CC] text-4xl" />
            <p className="text-xs text-[#0493CC] text-center">
              No open positions at this time.
            </p>
          </div>
        ) : (
          <table className="text-xs w-full table-auto">
            <thead className="border-b">
              <tr>
                <th className="text-start">Asset</th>
                <th className="text-center">Value</th>
                <th className="text-center">Price</th>
                <th className="text-center">Change</th>
                <th className="text-center">MC</th>
                <th className="text-center">Liq</th>
                <th className="text-end">Value (USD)</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, idx) => (
                <tr key={idx} className="text-center">
                  <td className="flex items-center gap-2">
                    <GiPlainCircle className="text-[#0493CC] text-[7px]" />
                    <span>{position.name}</span>
                  </td>
                  <td>{position.value}</td>
                  <td>{position.price}</td>
                  <td
                    className={
                      position.change >= 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    {position.change}%
                  </td>
                  <td>{position.mc}</td>
                  <td>{position.liq}</td>
                  <td className="text-end">{position.valueInUsd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Deposit and Withdraw Modals */}
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
    </main>
  );
};

export default Home;
