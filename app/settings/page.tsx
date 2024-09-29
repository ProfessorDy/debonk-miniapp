"use client";

import { useState } from "react";
import {
  FaLanguage,
  FaToggleOn,
  FaCog,
  FaMoneyBillAlt,
  FaChartLine,
  FaChartPie,
} from "react-icons/fa";
import { MdOutlinePriceChange, MdOutlineAutoAwesome } from "react-icons/md";

const SettingsPage = () => {
  const [language, setLanguage] = useState("English"); //eslint-disable-line
  //eslint-disable-next-line
  const [autoBuy, setAutoBuy] = useState({
    status: "Disabled",
    value: "0.10 SOL",
  });

  // Settings data array
  const settings = [
    {
      id: 1,
      icon: <MdOutlineAutoAwesome className="text-xl text-blue-400" />,
      description: "Anti Rug",
      after: <FaToggleOn className="text-green-400 text-xl" />,
      onClick: () => console.log("Anti Rug clicked"),
    },
    {
      id: 2,
      icon: <FaLanguage className="text-xl text-blue-400" />,
      description: "Language",
      after: language,
      onClick: () => console.log("Language clicked"),
    },
    {
      id: 3,
      icon: <FaMoneyBillAlt className="text-xl text-blue-400" />,
      description: (
        <div>
          <p>Auto Buy</p>
          <p className="text-sm text-gray-400">
            {autoBuy.status} - {autoBuy.value}
          </p>
        </div>
      ),
      after: <FaToggleOn className="text-green-400 text-xl" />,
      onClick: () => console.log("Auto Buy clicked"),
    },
    {
      id: 4,
      icon: <FaCog className="text-xl text-blue-400" />,
      description: "Buy Config",
      onClick: () => console.log("Buy Config clicked"),
    },
    {
      id: 5,
      icon: <FaCog className="text-xl text-blue-400" />,
      description: "Sell Config",
      onClick: () => console.log("Sell Config clicked"),
    },
    {
      id: 6,
      icon: <FaChartLine className="text-xl text-blue-400" />,
      description: "Slippage Config",
      onClick: () => console.log("Slippage Config clicked"),
    },
    {
      id: 7,
      icon: <MdOutlinePriceChange className="text-xl text-blue-400" />,
      description: "Max Price Input",
      onClick: () => console.log("Max Price Input clicked"),
    },
    {
      id: 8,
      icon: <FaChartPie className="text-xl text-blue-400" />,
      description: "Chart Preview",
      onClick: () => console.log("Chart Preview clicked"),
    },
  ];

  return (
    <main
      className="p-3 bg-black min-h-screen  bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      <h2 className="text-xl font-semibold text-white mb-6">
        General Settings
      </h2>
      <div className="space-y-4">
        {settings.map(({ id, icon, description, after, onClick }) => (
          <div
            key={id}
            onClick={onClick}
            className="flex items-center justify-between p-4 bg-background border border-gray-600 rounded-lg hover:bg-[#252b39] transition duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-4 text-white">
              {icon}
              <div>{description}</div>
            </div>
            <div className="text-gray-400">{after}</div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default SettingsPage;
