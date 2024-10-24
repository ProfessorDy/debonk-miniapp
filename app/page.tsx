"use client";

import React, { useState, useEffect } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { PiDownloadDuotone } from "react-icons/pi";
import { SlRefresh } from "react-icons/sl";
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
  simulateSellToken,
} from "@/utils/apiUtils";
import { toast } from "react-toastify";
import PositionOverview from "@/components/Home/PositionOverview";
import ActionButtons from "@/components/Home/ActionButton";
import WalletInfo from "@/components/Home/WalletInfo";

const Home = () => {
  const { walletAddress, setWalletAddress } = useWalletAddressStore();
  const { setUserId } = useTelegramUserStore();
  const { isLiveTrading, toggleLiveTrading } = useLiveTradingStore();
  const [unrealizedPNL, setUnrealizedPNL] = useState(-0.0);
  const [unrealizedPNLUSD, setUnrealizedPNLUSD] = useState(-0.0);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [liveBalance, setLiveBalance] = useState<number>(0);
  const [simulationBalance, setSimulationBalance] = useState<number>(0);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [totalValueInUsd, setTotalValueInUsd] = useState<number | null>(null);
  const [livePositions, setLivePositions] = useState<TokenDataArray>([]);
  const [simulationPositions, setSimulationPositions] =
    useState<TokenDataArray>([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

  const DepositModal = dynamic(() => import("@/components/DepositModal"));

  // Add loading state for selling action
  const [sellLoading, setSellLoading] = useState(false);

  const handleSell = async (tokenAddress: string, tokenName: string) => {
    const telegram = window.Telegram?.WebApp;

    if (telegram?.initDataUnsafe?.user) {
      const { id: userId } = telegram.initDataUnsafe.user;

      const activePositions = isLiveTrading
        ? livePositions
        : simulationPositions;

      const positionToSell = activePositions.find(
        (position) => position.tokenAddress === tokenAddress
      );

      if (!positionToSell) {
        toast.error("Position not found.");
        return;
      }

      // Set token to 'pending' state
      const updatedPositions = activePositions.map((position) =>
        position.tokenAddress === tokenAddress
          ? { ...position, isPending: true }
          : position
      );
      isLiveTrading
        ? setLivePositions(updatedPositions)
        : setSimulationPositions(updatedPositions);

      try {
        setSellLoading(true);

        await simulateSellToken({
          telegramId: userId,
          tokenAddress,
          amountPercent: 100,
          type: "PERCENT",
        });

        toast.success(`${tokenName} sold successfully`);

        // Filter out sold token after successful sell
        const newPositions = activePositions.filter(
          (position) => position.tokenAddress !== tokenAddress
        );
        isLiveTrading
          ? setLivePositions(newPositions)
          : setSimulationPositions(newPositions);
      } catch (error) {
        toast.error("Failed to sell the token.");

        // Revert 'pending' state in case of failure
        const revertedPositions = activePositions.map((position) =>
          position.tokenAddress === tokenAddress
            ? { ...position, isPending: false }
            : position
        );
        isLiveTrading
          ? setLivePositions(revertedPositions)
          : setSimulationPositions(revertedPositions);
      } finally {
        setSellLoading(false);
      }
    }
  };

  // Inside the Home component
  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    const cachedPositions = localStorage.getItem("positions");

    if (cachedPositions) {
      const parsedPositions = JSON.parse(cachedPositions);
      setLivePositions(parsedPositions.live || []);
      setSimulationPositions(parsedPositions.simulation || []);
    }

    if (telegram?.initDataUnsafe?.user) {
      const { id: userId } = telegram.initDataUnsafe.user;

      const getSolData = async () => {
        setLoading(true);
        try {
          // Fetch price, balance, and positions
          const price = await fetchSolPrice();
          setSolPrice(price);

          const userPositions = await fetchUserPositions(userId.toString());
          const live = userPositions.filter((position) => !position.isSim);
          const simulation = userPositions.filter((position) => position.isSim);

          // Store positions in localStorage for future use
          localStorage.setItem(
            "positions",
            JSON.stringify({ live, simulation })
          );

          setLivePositions(live);
          setSimulationPositions(simulation);
        } finally {
          setLoading(false);
        }
      };

      getSolData();
    }
  }, [setLivePositions, setSimulationPositions]);

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
  const handleCopy = () => {
    copyToClipboard(walletAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  useEffect(() => {
    if (isLiveTrading) {
      const totalUnrealizedPnLUsd = livePositions.reduce(
        (acc, position) => acc + position.PNL_usd,
        0
      );

      const totalCapital = livePositions.reduce(
        (acc, position) => acc + parseFloat(position.capital),
        0
      );

      const weightedPnLPercent = livePositions.reduce(
        (acc, position) =>
          acc +
          (parseFloat(position.PNL_usd_percent) *
            parseFloat(position.capital)) /
            totalCapital,
        0
      );

      setUnrealizedPNL(weightedPnLPercent);
      setUnrealizedPNLUSD(totalUnrealizedPnLUsd);
    } else {
      const totalUnrealizedPnLUsd = simulationPositions.reduce(
        (acc, position) => acc + position.PNL_usd,
        0
      );

      const totalCapital = simulationPositions.reduce(
        (acc, position) => acc + parseFloat(position.capital),
        0
      );

      const weightedPnLPercent = simulationPositions.reduce(
        (acc, position) =>
          acc +
          (parseFloat(position.PNL_usd_percent) *
            parseFloat(position.capital)) /
            totalCapital,
        0
      );

      setUnrealizedPNL(weightedPnLPercent);
      setUnrealizedPNLUSD(totalUnrealizedPnLUsd);
    }
  }, [livePositions, simulationPositions, isLiveTrading]);

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
          className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y relative"
          style={{ backgroundImage: "url('/Rectangle.png')" }}
        >
          <section className="mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
            {/* Wallet Address Section */}
            <WalletInfo
              walletAddress={walletAddress}
              unrealizedPNL={unrealizedPNL}
              unrealizedPNLUSD={unrealizedPNLUSD}
              walletBalance={isLiveTrading ? liveBalance : simulationBalance}
              totalValueInUsd={totalValueInUsd}
              isLiveTrading={isLiveTrading}
              handleCopy={handleCopy}
              toggleLiveTrading={toggleLiveTrading}
              copySuccess={copySuccess}
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
