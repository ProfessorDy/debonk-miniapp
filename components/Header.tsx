import Image from "next/image";
import { FaQuestionCircle, FaBell } from "react-icons/fa";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-black p-4 shadow-md">
      <Image src="/LOGO.png" alt="App Logo" width={105} height={40} />

      <div className="flex items-center space-x-4">
        <FaQuestionCircle className="text-white text-2xl cursor-pointer" />

        <FaBell className="text-white text-2xl cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;
