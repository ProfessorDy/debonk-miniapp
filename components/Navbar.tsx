"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiHome3Fill } from "react-icons/ri";
import { IoLinkSharp } from "react-icons/io5";
import { FaCog } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { TbChartCandleFilled } from "react-icons/tb";
import { RiTokenSwapFill } from "react-icons/ri";

import { pasteFromClipboard } from "@/utils/clipboardUtils";

const tabs = [
  { id: 1, url: "/", Icon: RiHome3Fill },
  { id: 2, url: "/positions", Icon: TbChartCandleFilled },
  { id: 3, url: "/swap", Icon: RiTokenSwapFill },
  { id: 4, url: "/referrals", Icon: IoMdPeople },
  { id: 5, url: "/settings", Icon: FaCog },
];

const Navbar = () => {
  const [tokenInput, setTokenInput] = useState("");
  const pathname = usePathname();

  const showContractInput = pathname === "/" || pathname === "/positions";

  const handlePaste = async () => {
    const clipboardText = await pasteFromClipboard();
    if (clipboardText) {
      setTokenInput(clipboardText);
    }
  };

  return (
    <footer className="fixed bottom-0 w-full shadow-lg space-y-2">
      {showContractInput && (
        <div className="px-4">
          <div className="bg-background rounded-xl py-[24px] px-[8px] text-sm border-accent border">
            <div className="flex items-center text-[#797979]">
              <IoLinkSharp className="text-2xl" />
              <input
                type="text"
                placeholder="Contract Address or Token Link"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-grow px-1 leading-4 font-light bg-background border-none focus:outline-none"
              />
              <button onClick={handlePaste} className="text-accent">
                Paste
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-around items-center h-16 bg-background">
        {tabs.map(({ id, url, Icon }) => (
          <Link key={id} href={url}>
            <div
              className={`flex flex-col items-center ${
                pathname === url ? "text-blue-500" : "text-primary"
              }`}
            >
              <Icon size={url === "swap" ? 34 : 27} />
            </div>
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Navbar;
