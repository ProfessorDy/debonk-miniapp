"use client";

import { useState } from "react";
import { RiHome3Fill } from "react-icons/ri";
import { FaCog } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { TbChartCandleFilled } from "react-icons/tb";
import { RiTokenSwapFill } from "react-icons/ri";

import { useRouter } from "next/navigation";

const tabs = [
  { id: 1, url: "/", Icon: RiHome3Fill },
  { id: 2, url: "/positions", Icon: TbChartCandleFilled },
  { id: 3, url: "/swap", Icon: RiTokenSwapFill },
  { id: 4, url: "/referrals", Icon: IoMdPeople },
  { id: 5, url: "/settings", Icon: FaCog },
];

const Navbar = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0].id);
  const router = useRouter();

  const handleTabClick = (id: number, url: string) => {
    setCurrentTab(id);
    router.push(url);
  };

  return (
    <div className="fixed bottom-0 w-full bg-background shadow-lg">
      <div className="flex justify-around items-center h-16">
        {tabs.map(({ id, url, Icon }) => (
          <button
            key={id}
            onClick={() => handleTabClick(id, url)}
            className={`flex flex-col items-center ${
              id === currentTab ? "text-blue-500" : "text-primary"
            }`}
          >
            <Icon size={24} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
