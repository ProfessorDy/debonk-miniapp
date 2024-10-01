"use client";

import { useState } from "react";
import {
  FaLanguage,
  FaToggleOn,
  FaToggleOff,
  FaCog,
  FaMoneyBillAlt,
  FaChartLine,
  FaChartPie,
} from "react-icons/fa";
import { MdOutlinePriceChange, MdOutlineAutoAwesome } from "react-icons/md";

const SettingsPage = () => {
  const [language, setLanguage] = useState("English"); // eslint-disable-line
  const [autoBuy, setAutoBuy] = useState({
    status: "Enabled",
    value: "0.10 SOL",
  });
  const [isAutoBuyEnabled, setIsAutoBuyEnabled] = useState(true);
  const [isChartPreviewEnabled, setIsChartPreviewEnabled] = useState(false);

  // Common icon styles
  const iconStyles = "text-xl text-accent";

  // Toggle Auto Buy
  const toggleAutoBuy = () => {
    setIsAutoBuyEnabled(!isAutoBuyEnabled);
    setAutoBuy((prev) => ({
      ...prev,
      status: isAutoBuyEnabled ? "Disabled" : "Enabled",
    }));
  };

  // Toggle Chart Preview
  const toggleChartPreview = () => {
    setIsChartPreviewEnabled(!isChartPreviewEnabled);
  };

  // Settings data array
  const settings = [
    {
      id: 1,
      icon: <MdOutlineAutoAwesome className={iconStyles} />,
      description: "Anti Rug",
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
      after: isAutoBuyEnabled ? (
        <FaToggleOn className="text-green-400 text-xl" />
      ) : (
        <FaToggleOff className="text-gray-400 text-xl" />
      ),
      onClick: toggleAutoBuy,
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
      after: isChartPreviewEnabled ? (
        <FaToggleOn className="text-green-400 text-xl" />
      ) : (
        <FaToggleOff className="text-gray-400 text-xl" />
      ),
      onClick: toggleChartPreview,
    },
  ];

  return (
    <main
      className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y font-poppins font-light text-primary"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      <h2 className="text-2xl text-center font-semibold text-white mb-4">
        General Settings
      </h2>
      <div className="space-y-2 bg-[#3C3C3C3B] backdrop-blur-2xl text-white shadow-lg rounded-xl px-2 py-4">
        {settings.map(({ id, icon, description, after, onClick }) => (
          <div
            key={id}
            onClick={onClick}
            className="flex items-center justify-between p-4 bg-black border border-accent rounded-lg cursor-pointer"
          >
            <div className="flex items-center space-x-4 text-white">
              {icon}
              <div>{description}</div>
            </div>
            <div>{after}</div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default SettingsPage;
