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
  const { isLiveTrading } = useLiveTradingStore();
  const [unrealizedPNL, setUnrealizedPNL] = useState(-0.0);
  const [unrealizedPNLUSD, setUnrealizedPNLUSD] = useState(-0.0);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [liveBalance, setLiveBalance] = useState<number>(0);
  const [simulationBalance, setSimulationBalance] = useState<number>(0);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [livePositions, setLivePositions] = useState<TokenDataArray>([]);
  const [simulationPositions, setSimulationPositions] =
    useState<TokenDataArray>([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);
  const router = useRouter();

  const DepositModal = dynamic(() => import("@/components/DepositModal"));

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

      // Optimistic update: Set token to 'pending' state
      const updatedPositions = activePositions.map((position) =>
        position.tokenAddress === tokenAddress
          ? { ...position, isPending: true }
          : position
      );
      if (isLiveTrading) {
        setLivePositions(updatedPositions);
      } else {
        setSimulationPositions(updatedPositions);
      }

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
        if (isLiveTrading) {
          setLivePositions(newPositions);
        } else {
          setSimulationPositions(newPositions);
        }
      } catch (error) {
        console.log("Failed to sell the token.", error);
        toast.error("Failed to sell the token.");

        // Revert 'pending' state in case of failure
        const revertedPositions = activePositions.map((position) =>
          position.tokenAddress === tokenAddress
            ? { ...position, isPending: false }
            : position
        );
        if (isLiveTrading) {
          setLivePositions(revertedPositions);
        } else {
          setSimulationPositions(revertedPositions);
        }
      } finally {
        setSellLoading(false);
      }
    }
  };

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;

    if (telegram?.initDataUnsafe?.user) {
      const { id: userId } = telegram.initDataUnsafe.user;
      setUserId(userId.toString());

      const fetchData = async () => {
        setLoading(true);

        try {
          // Fetch price, balance, and positions concurrently
          const [price, walletData, userPositions] = await Promise.all([
            fetchSolPrice(),
            fetchWalletBalance(userId.toString()),
            fetchUserPositions(userId.toString()),
          ]);

          setSolPrice(price);

          const parsedLiveBalance =
            formatWalletBalance(walletData.balance) || 0;
          const parsedSimulationBalance =
            formatWalletBalance(walletData.simulationBalance) || 0;

          setLiveBalance(parsedLiveBalance);
          setSimulationBalance(parsedSimulationBalance);

          // Filter live and simulation positions
          const live = userPositions.filter((position) => !position.isSim);
          const simulation = userPositions.filter((position) => position.isSim);

          setLivePositions(live);
          setSimulationPositions(simulation);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isLiveTrading, setUserId]);

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram?.initDataUnsafe?.user) {
      const { id: userId } = telegram.initDataUnsafe.user;

      const apiUrl = `/api/getAddressFromTelegramId?telegramId=${userId}`;

      fetch(apiUrl)
        .then(async (response) => {
          const contentType = response.headers.get("content-type");

          if (!response.ok) {
            const errorText = await response.text();
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
          } else {
            console.log("Error fetching Solana address:", data.error);
          }
        })
        .catch((err) => {
          console.error("Error fetching address:", err);
        });
    }
  }, [setWalletAddress]);

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

  const handleOpenDepositModal = () => setIsDepositModalOpen(true);
  const handleCloseDepositModal = () => setIsDepositModalOpen(false);
  const handleCopy = () => {
    copyToClipboard(walletAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

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

  const walletBalance = isLiveTrading ? liveBalance : simulationBalance;
  const totalValueInUsd = walletBalance * (solPrice || 0);

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <main
          className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y relative"
          style={{ backgroundImage: "url('/Rectangle.png')" }}
        >
          <section className="mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] py-3 px-5 rounded-[6.3px]">
            <WalletInfo
              walletBalance={walletBalance}
              totalValueInUsd={totalValueInUsd}
              unrealizedPNL={unrealizedPNL}
              unrealizedPNLUSD={unrealizedPNLUSD}
              walletAddress={walletAddress}
              copySuccess={copySuccess}
              handleCopy={handleCopy}
            />
            <ActionButtons buttons={actionButtons} />
          </section>

          <section>
            <PositionOverview
              livePositions={livePositions}
              simulationPositions={simulationPositions}
              handleSell={handleSell}
              isLiveTrading={isLiveTrading}
              sellLoading={sellLoading}
            />
          </section>
        </main>
      )}

      {isDepositModalOpen && (
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={handleCloseDepositModal}
          walletAddress={walletAddress}
        />
      )}
    </>
  );
};

export default Home;
