"use client";

import Image from "next/image";
import { FaQuestionCircle, FaBell, FaHistory } from "react-icons/fa";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  // Check if pathname matches either "/swap" or "/referrals"
  const showHistoryIcon = pathname === "/swap" || pathname === "/referrals";

  return (
    <header className="flex items-center justify-between bg-black p-4 shadow-md text-primary">
      <Image src="/LOGO.png" alt="App Logo" width={105} height={40} />

      <div className="flex items-center space-x-4">
        {showHistoryIcon && <FaHistory />}
        <FaQuestionCircle />
        <FaBell />
      </div>
    </header>
  );
};

export default Header;
