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
  const [language, setLanguage] = useState("English"); // eslint-disable-line
  const [autoBuy, setAutoBuy] = useState({
    status: "Disabled",
    value: "0.10 SOL",
  });

  // Common icon styles
  const iconStyles = "text-xl text-accent";

  // Settings data array
  const settings = [
    {
      id: 1,
      icon: <MdOutlineAutoAwesome className={iconStyles} />,
      description: "Anti Rug",
      after: <FaToggleOn className="text-green-400 text-xl" />,
      onClick: () => console.log("Anti Rug clicked"),
    },
    {
      id: 2,
      icon: <FaLanguage className={iconStyles} />,
      description: "Language",
      after: language,
      onClick: () => console.log("Language clicked"),
    },
    {
      id: 3,
      icon: <FaMoneyBillAlt className={iconStyles} />,
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
      icon: <FaCog className={iconStyles} />,
      description: "Buy Config",
      onClick: () => console.log("Buy Config clicked"),
    },
    {
      id: 5,
      icon: <FaCog className={iconStyles} />,
      description: "Sell Config",
      onClick: () => console.log("Sell Config clicked"),
    },
    {
      id: 6,
      icon: <FaChartLine className={iconStyles} />,
      description: "Slippage Config",
      onClick: () => console.log("Slippage Config clicked"),
    },
    {
      id: 7,
      icon: <MdOutlinePriceChange className={iconStyles} />,
      description: "Max Price Input",
      onClick: () => console.log("Max Price Input clicked"),
    },
    {
      id: 8,
      icon: <FaChartPie className={iconStyles} />,
      description: "Chart Preview",
      onClick: () => console.log("Chart Preview clicked"),
    },
  ];

  return (
    <main
      className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      <h2 className="text-xl font-semibold text-white mb-6">
        General Settings
      </h2>
      <div className="space-y-2">
        {settings.map(({ id, icon, description, after, onClick }) => (
          <div
            key={id}
            onClick={onClick}
            className="flex items-center justify-between p-4 bg-background border border-accent rounded-lg cursor-pointer"
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
