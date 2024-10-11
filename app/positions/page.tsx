"use client";

import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoCopySharp } from "react-icons/io5";
import useTelegramUserStore from "@/store/useTelegramUserStore";

const PositionsPage = () => {
  const [positions, setPositions] = useState<any[]>([]); //eslint-disable-line
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = useTelegramUserStore((state) => state.userId);

  // Fetch positions data from API
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch(`/api/getUserPositions?telegramId=${userId}`);
        const data = await res.json();
        setPositions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching positions:", error);
        setError("Failed to load positions.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchPositions();
    }
  }, [userId]);

  if (loading) {
    return (
      <main
        className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y"
        style={{ backgroundImage: "url('/Rectangle.png')" }}
      >
        <h2 className="text-2xl font-semibold text-center font-poppins mb-2 text-white">
          Loading Positions...
        </h2>
      </main>
    );
  }

  if (error) {
    return (
      <main
        className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y"
        style={{ backgroundImage: "url('/Rectangle.png')" }}
      >
        <h2 className="text-2xl font-semibold text-center font-poppins mb-2 text-white">
          {error}
        </h2>
      </main>
    );
  }

  return (
    <main
      className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      <h2 className="text-2xl font-semibold text-center font-poppins mb-2 text-white">
        Positions
      </h2>
      {/* Positions Table */}
      <div className="space-y-4">
        {positions.length > 0 ? (
          positions.map((position, index) => (
            <div
              key={index}
              className="bg-[#1C1C1C] border-[#2F2F2F] border-[1px] p-4 rounded-lg shadow-lg"
            >
              {/* Position Details */}
              <div className="flex justify-between items-start">
                {/* Left side: Name, MC, Liq */}
                <div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold text-white">
                      {position.token?.name || "N/A"}
                    </div>
                    <IoCopySharp
                      className="cursor-pointer text-[10px] text-gray-400 ml-2"
                      title="Copy Address"
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    MC ${position.mc?.toLocaleString() || "N/A"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Liq ${position.token?.liquidityInUsd?.toFixed(2) || "N/A"}
                  </p>
                </div>

                {/* Right side: Capital, Value, PNL */}
                <div className="flex items-center space-x-6">
                  <div className="text-sm text-right">
                    <p className="text-gray-400">Capital</p>
                    <p className="text-white font-medium">
                      {position.capital ? `${position.capital} SOL` : "N/A"}
                    </p>
                  </div>
                  <div className="text-sm text-right">
                    <p className="text-gray-400">Value</p>
                    <p className="text-white font-medium">
                      {position.balance ? `${position.balance} SOL` : "N/A"}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      parseFloat(position.PNL_usd_percent) < 0
                        ? "text-red-500"
                        : "text-green-500"
                    } text-right`}
                  >
                    <p>
                      PNL:{" "}
                      {position.PNL_usd
                        ? `$${position.PNL_usd.toFixed(2)}`
                        : "N/A"}
                    </p>
                    <p>{position.PNL_sol || "N/A"} SOL</p>
                    <p>{position.PNL_Sol_percent || "N/A"}%</p>
                  </div>
                </div>
              </div>

              {/* External Link Icon */}
              <button className="flex justify-end mt-2">
                <FaExternalLinkAlt className="text-accent text-base" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-center text-gray-400">
            You have no active positions at the moment.
          </p>
        )}
      </div>
    </main>
  );
};

export default PositionsPage;
