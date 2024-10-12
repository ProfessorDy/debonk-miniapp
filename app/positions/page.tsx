"use client";

import { useEffect, useState } from "react";
import { GiPlainCircle } from "react-icons/gi";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoCopySharp } from "react-icons/io5";
import useTelegramUserStore from "@/store/useTelegramUserStore";

type Position = {
  name: string;
  value: number;
  price: number;
  change: number;
  mc: string;
  liq: string;
  valueInUsd: number;
};

const PositionsPage = () => {
  const [positions, setPositions] = useState<Position[]>([]);
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
      <div className="space-y-4">
        {positions.length > 0 ? (
          positions.map((position, index) => (
            <div
              key={index}
              className="bg-[#1C1C1C] border-[#2F2F2F] border-[1px] p-4 rounded-lg shadow-lg"
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
                  <p>{position.valueInUsd} USD</p>
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
    </main>
  );
};

export default PositionsPage;
