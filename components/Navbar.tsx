"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiHome3Fill } from "react-icons/ri";
import { FaCog } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { TbChartCandleFilled } from "react-icons/tb";
import { RiTokenSwapFill } from "react-icons/ri";

const tabs = [
  { id: 1, url: "/", Icon: RiHome3Fill },
  { id: 2, url: "/positions", Icon: TbChartCandleFilled },
  { id: 3, url: "/swap", Icon: RiTokenSwapFill },
  { id: 4, url: "/referrals", Icon: IoMdPeople },
  { id: 5, url: "/settings", Icon: FaCog },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 w-full bg-background shadow-lg">
      <div className="flex justify-around items-center h-16">
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
