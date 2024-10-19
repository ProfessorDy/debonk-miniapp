"use client";

import React, { useState, useEffect, useMemo } from "react";
import { IoCopySharp, IoWalletOutline, IoLinkSharp } from "react-icons/io5";
import { PiDownloadDuotone, PiTestTubeFill } from "react-icons/pi";
import { SlRefresh } from "react-icons/sl";
import { CiCircleAlert } from "react-icons/ci";
import { GiPlainCircle } from "react-icons/gi";
import { copyToClipboard } from "@/utils/clipboardUtils";
import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/Home/SkeletonLoader";
import useTelegramUserStore from "@/store/useTelegramUserStore";
import useLiveTradingStore from "@/store/useLiveTradingStore";
import useWalletAddressStore from "@/store/useWalletAddressStore";
import { formatWalletBalance } from "@/utils/numberUtils";
import { useRouter } from "next/navigation";
import {
  fetchSolPrice,
  fetchWalletBalance,
  fetchUserPositions,
} from "@/utils/apiUtils";
import { pasteFromClipboard } from "@/utils/clipboardUtils";
import { toast } from "react-toastify";
import PositionOverview from "@/components/Home/PositionOverview";
import ActionButtons from "@/components/Home/ActionButton";
import WalletInfo from "@/components/Home/WalletInfo";

const Home = () => {
  const { walletAddress, setWalletAddress } = useWalletAddressStore();
  const { setUserId } = useTelegramUserStore();
  const { isLiveTrading, toggleLiveTrading } = useLiveTradingStore();
  const [unrealizedPNL] = useState("-0.00%");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [liveBalance, setLiveBalance] = useState<number>(0);
  const [simulationBalance, setSimulationBalance] = useState<number>(0);

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState("");

  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [totalValueInUsd, setTotalValueInUsd] = useState<number | null>(null);
  const [livePositions, setLivePositions] = useState<TokenDataArray>([]);
  const [simulationPositions, setSimulationPositions] =
    useState<TokenDataArray>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const DepositModal = dynamic(() => import("@/components/DepositModal"));
  const TokenModal = dynamic(() => import("@/components/TokenModal"));

  // Add loading state for selling action
  const [sellLoading, setSellLoading] = useState(false);

  const handlePaste = async () => {
    const clipboardText = await pasteFromClipboard();
    if (clipboardText) {
      setTokenInput(clipboardText);
      setIsPasteModalOpen(true); // Open modal immediately after pasting
      toast.success("Successfully pasted from clipboard!");
    }
  };

  useEffect(() => {
    if (tokenInput) {
      setIsPasteModalOpen(true);
    }
  }, [tokenInput]);

  const handleSell = async (tokenAddress: string, tokenName: string) => {
    const telegram = window.Telegram?.WebApp;

    if (telegram?.initDataUnsafe?.user) {
      const { id: userId } = telegram.initDataUnsafe.user;

      const activePositions = isLiveTrading
        ? livePositions
        : simulationPositions;

      // Find the position to sell
      const positionToSell = activePositions.find(
        (position) => position.tokenAddress === tokenAddress
      );

      if (!positionToSell) {
        toast.error("Position not found.");
        return;
      }

      // Optimistic Updates
      const newPositions = activePositions.filter(
        (position) => position.tokenAddress !== tokenAddress
      );
      const newWalletBalance =
        walletBalance + (positionToSell.PNL_usd || 0) / solPrice;

      const prevPositions = activePositions; // Backup previous positions
      const prevWalletBalance = walletBalance; // Backup previous balance

      // Update UI immediately (optimistic update)
      if (isLiveTrading) {
        setLivePositions(newPositions);
      } else {
        setSimulationPositions(newPositions);
      }

      setWalletBalance(newWalletBalance);

      try {
        setSellLoading(true);

        // Define the correct API endpoint based on trading mode
        const apiEndpoint = isLiveTrading
          ? `/api/sellToken` //  API route for live trading
          : `/api/simulationSellToken`; // Existing API route for simulation

        const response = await fetch(
          `${apiEndpoint}?telegramId=${userId}&tokenAddress=${tokenAddress}&amountPercent=${100}&type=PERCENT`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to sell token: ${errorMessage}`);
        }

        toast.success(`${tokenName} sold successfully`);
        console.log(`Token with address ${tokenAddress} sold successfully!`);
      } catch (error) {
        console.error("Error while selling token:", error);
        toast.error("Failed to sell the token.");

        // Revert optimistic changes if the API call fails
        if (isLiveTrading) {
          setLivePositions(prevPositions);
        } else {
          setSimulationPositions(prevPositions);
        }
        setWalletBalance(prevWalletBalance);
      } finally {
        setSellLoading(false);
      }
    } else {
      toast.error("Telegram user data is not available.");
    }
  };

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

          const parsedLiveBalance = formatWalletBalance(balance) || 0;
          const parsedSimulationBalance =
            formatWalletBalance(simulationBalance) || 0;

          setLiveBalance(parsedLiveBalance);
          setSimulationBalance(parsedSimulationBalance);

          // Set the balance based on the current trading mode
          setWalletBalance(
            isLiveTrading ? parsedLiveBalance : parsedSimulationBalance
          );

          const totalValueInUsd = useMemo(() => {
            return walletBalance && solPrice ? walletBalance * solPrice : 0;
          }, [walletBalance, solPrice]);

          setTotalValueInUsd(totalValueInUsd);

          const userPositions = await fetchUserPositions(userId.toString());
          if (userPositions.length === 0) {
            setLivePositions([]);
            setSimulationPositions([]);
            console.log("No active positions found.");
          } else {
            // Filter based on whether the position is for live trading or simulation
            const live = userPositions.filter((position) => !position.isSim);
            const simulation = userPositions.filter(
              (position) => position.isSim
            );

            setLivePositions(live);
            setSimulationPositions(simulation);
            console.log("Fetched Live Positions:", live);
            console.log("Fetched Simulation Positions:", simulation);
          }
        } finally {
          setLoading(false);
        }
      };

      getSolData();
    }
  }, [setWalletBalance, setUserId, isLiveTrading, walletBalance]);

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
            console.log("Error fetching Solana address:", data.error);
          }
        })
        .catch((err) => {
          console.error("Error fetching address:", err);
        });
    } else {
      console.log("No Telegram user data available.");
    }
  }, [setWalletAddress]);

  // Toggle between live and simulation balances when trading mode changes
  useEffect(() => {
    setWalletBalance(isLiveTrading ? liveBalance : simulationBalance);

    const totalValue =
      (isLiveTrading ? liveBalance : simulationBalance) * solPrice;
    setTotalValueInUsd(totalValue);
  }, [isLiveTrading, liveBalance, simulationBalance, solPrice]);

  const handleOpenDepositModal = () => setIsDepositModalOpen(true);
  const handleCloseDepositModal = () => setIsDepositModalOpen(false);
  const handleCopy = () => copyToClipboard(walletAddress);
  const handleRefresh = () => window.location.reload();
  const handleWithdraw = () => router.push(`/withdraw`);

  const actionButtons = [
    {
      label: "Deposit",
      icon: <IoWalletOutline className="text-[20px]" />,
      action: handleOpenDepositModal,
    },
    {
      label: "Withdraw",
      icon: <PiDownloadDuotone className="text-[20px]" />,
      action: handleWithdraw,
    },
    {
      label: "Refresh",
      icon: <SlRefresh className="text-[20px]" />,
      action: handleRefresh,
    },
  ];

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <main
          className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y"
          style={{ backgroundImage: "url('/Rectangle.png')" }}
        >
          <section className="mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
            {/* Wallet Address Section */}
            <WalletInfo
              walletAddress={walletAddress}
              unrealizedPNL={unrealizedPNL}
              walletBalance={isLiveTrading ? liveBalance : simulationBalance}
              totalValueInUsd={totalValueInUsd}
              handleCopy={handleCopy}
            />

            {/* Action Buttons */}
            <ActionButtons buttons={actionButtons} />
          </section>
          {/* Positions Overview */}
          <PositionOverview
            positions={isLiveTrading ? livePositions : simulationPositions}
            isLiveTrading={isLiveTrading}
            sellLoading={sellLoading}
            handleSell={handleSell}
          />

          <section className="fixed bottom-0 w-full shadow-lg space-y-2 z-50">
            <div className="px-3">
              <div className="bg-background rounded-xl py-2 px-[8px] text-sm border-accent border">
                <div className="flex items-center text-[#797979]">
                  <IoLinkSharp className="text-2xl" />
                  <input
                    type="text"
                    placeholder="Contract Address or Token Link"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="flex-grow px-1 leading-4 font-light bg-background border-none focus:outline-none"
                  />
                  <button onClick={handlePaste} className="text-accent p-4">
                    Paste
                  </button>
                </div>
              </div>
            </div>
          </section>

          <TokenModal
            isOpen={isPasteModalOpen}
            onClose={() => setIsPasteModalOpen(false)}
            tokenAddress={tokenInput}
          />
          <DepositModal
            isOpen={isDepositModalOpen}
            onClose={handleCloseDepositModal}
            walletAddress={walletAddress}
          />
        </main>
      )}
    </>
  );
};

export default Home;
