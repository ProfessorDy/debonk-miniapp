"use client";

import React, { useState, useEffect } from "react";
import { IoCopySharp, IoWalletOutline, IoLinkSharp } from "react-icons/io5";
import { PiDownloadDuotone, PiTestTubeFill } from "react-icons/pi";
import { SlRefresh } from "react-icons/sl";
import { CiCircleAlert } from "react-icons/ci";
import { GiPlainCircle } from "react-icons/gi";
import { copyToClipboard } from "@/utils/clipboardUtils";
import DepositModal from "@/components/DepositModal";
import SkeletonLoader from "@/components/SkeletonLoader";
import useTelegramUserStore from "@/store/useTelegramUserStore";
import useLiveTradingStore from "@/store/useLiveTradingStore";
import useWalletAddressStore from "@/store/useWalletAddressStore";
import { formatNumber, formatWalletBalance } from "@/utils/numberUtils";
import { useRouter } from "next/navigation";
import {
  fetchSolPrice,
  fetchWalletBalance,
  fetchUserPositions,
} from "@/utils/apiUtils";
import { pasteFromClipboard } from "@/utils/clipboardUtils";
import { toast } from "react-toastify";
import TokenModal from "@/components/TokenModal";

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

  const handleSell = async (tokenAddress: string) => {
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
      isLiveTrading
        ? setLivePositions(newPositions)
        : setSimulationPositions(newPositions);
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

        console.log(`Token with address ${tokenAddress} sold successfully!`);
      } catch (error) {
        console.error("Error while selling token:", error);
        toast.error("Failed to sell the token. Reverting changes.");

        // Revert optimistic changes if the API call fails
        isLiveTrading
          ? setLivePositions(prevPositions)
          : setSimulationPositions(prevPositions);
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

          const totalValue = walletBalance * price;
          setTotalValueInUsd(totalValue);

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

  const buttons = [
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
                    <PiTestTubeFill className="text-sm" /> Simulation
                  </>
                ) : (
                  <>
                    <PiTestTubeFill className="text-sm" /> Live Trading
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
          {/* Positions Overview */}
          <section className="mt-2 text-white shadow-lg rounded-xl p-3">
            <p className="text-xs font-light">Position Overview</p>
            <div className="flex flex-col gap-2 mt-2">
              {isLiveTrading ? (
                livePositions.length > 0 ? (
                  livePositions.map((position, idx) => (
                    <div
                      key={idx}
                      className="bg-[#3C3C3C3B] backdrop-blur-2xl border-[1px] px-2 py-1 shadow-sm flex justify-between"
                    >
                      {/* Render live position */}
                      <div className="space-y-1">
                        <p className="text-base font-bold mb-1">
                          {position.token.name}
                        </p>
                        <div>
                          <p>
                            <span className="font-bold"> MC </span>
                            {position.token.mc
                              ? formatNumber(position.token.mc)
                              : "N/A"}
                          </p>
                          <p>
                            <span className="font-bold"> LIQ </span>
                            {position.token.liquidityInUsd
                              ? formatNumber(position.token.liquidityInUsd)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <p
                          className={`font-bold text-[9.45px] ${
                            position.PNL_Sol_percent &&
                            Number(position.PNL_Sol_percent) > 0
                              ? "text-[#1DD75B]"
                              : "text-[#E82E2E]"
                          }`}
                        >
                          {position.PNL_Sol_percent
                            ? `${
                                Number(position.PNL_Sol_percent) > 0 ? "+" : ""
                              }${Number(position.PNL_Sol_percent)}%`
                            : "N/A"}
                        </p>
                        <div className="text-sm">
                          <p>
                            {position.PNL_sol
                              ? position.PNL_sol.toFixed(2)
                              : "0.00"}{" "}
                            sol
                          </p>
                          <p className="font-light">
                            $
                            {position.PNL_usd
                              ? position.PNL_usd.toFixed(2)
                              : "0.00"}
                          </p>
                        </div>
                        <button
                          className={`flex flex-col items-center gap-[3px] p-2 min-w-20 text-[9.45px] rounded-md bg-[#E82E2E] text-white w-[60px] ${
                            sellLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => handleSell(position.tokenAddress)}
                          disabled={sellLoading}
                        >
                          {sellLoading ? "Selling..." : "Sell 100%"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center text-gray-400">
                    You have no active live positions.
                  </p>
                )
              ) : simulationPositions.length > 0 ? (
                simulationPositions.map((position, idx) => (
                  <div
                    key={idx}
                    className="bg-[#3C3C3C3B] backdrop-blur-2xl border-[1px] px-2 py-1 shadow-sm flex justify-between"
                  >
                    {/* Render simulation position */}
                    {/* The same rendering structure as live positions */}
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-400">
                  You have no active demo positions.
                </p>
              )}
            </div>
          </section>

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
