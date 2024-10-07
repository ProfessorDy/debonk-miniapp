import React from "react";

interface InvestmentButtonProps {
  label: string;
  onClick: () => void;
  type: "buy" | "sell";
}

const InvestmentButton: React.FC<InvestmentButtonProps> = ({
  label,
  onClick,
  type,
}) => {
  const buttonColor = type === "buy" ? "bg-green-600" : "bg-red-600";

  return (
    <button
      className={`${buttonColor} text-white text-xs px-4 py-2 rounded-lg`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default InvestmentButton;
