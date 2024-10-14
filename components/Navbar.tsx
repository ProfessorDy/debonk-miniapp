"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiHome3Fill } from "react-icons/ri";
import { IoLinkSharp } from "react-icons/io5";
import { FaCog } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { TbChartCandleFilled } from "react-icons/tb";
import { RiTokenSwapFill } from "react-icons/ri";
import { toast } from "react-toastify";

import { pasteFromClipboard } from "@/utils/clipboardUtils";

import TokenModal from "./TokenModal";

const tabs = [
  { id: 1, url: "/", Icon: RiHome3Fill },
  { id: 2, url: "/positions", Icon: TbChartCandleFilled },
  { id: 3, url: "/swap", Icon: RiTokenSwapFill },
  { id: 4, url: "/referrals", Icon: IoMdPeople },
  { id: 5, url: "/settings", Icon: FaCog },
];

const Navbar = () => {
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const pathname = usePathname();

  const showContractInput = pathname === "/" || pathname === "/positions";
  const showReferralSection = pathname === "/referrals";

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

  return (
    <footer className="fixed bottom-0 w-full shadow-lg space-y-2 z-50">
      {showContractInput && (
        <div className="px-3">
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

      {showReferralSection && (
        <div className="px-3">
          <div className="w-full p-4 bg-background rounded-xl flex flex-col gap-4">
            <div className="flex items-center">
              <span className="text-sm">Referral link</span>
              <input
                type="text"
                value="t.me/Debonk_bot?start=8947749837"
                className="ml-4 w-full text-sm bg-black p-2 rounded-lg"
                readOnly
              />
            </div>
            <button className="ml-4 px-4 py-2 bg-accent text-black rounded-lg">
              Invite A Friend
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-around items-center h-16 bg-background">
        {tabs.map(({ id, url, Icon }) => (
          <Link key={id} href={url}>
            <div
              className={`flex flex-col items-center ${
                pathname === url ? "text-accent" : "text-primary"
              }`}
            >
              <Icon
                className={url === "swap" ? "text-[34px]" : "text-[27px]"}
              />
            </div>
          </Link>
        ))}
      </div>

      <TokenModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        tokenAddress={tokenInput}
      />
    </footer>
  );
};

export default Navbar;
