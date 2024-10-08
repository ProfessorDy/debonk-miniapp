import React from "react";

interface InvestmentButtonProps {
  label: string;
  onClick: () => void;
  type: "buy" | "sell";
  isLoading?: boolean;
}

const InvestmentButton: React.FC<InvestmentButtonProps> = ({
  label,
  onClick,
  type,
  isLoading = false,
}) => {
  const buttonColor = type === "buy" ? "bg-green-600" : "bg-red-600";
  const buttonText = isLoading ? "..." : label;

  return (
    <button
      className={`${buttonColor} text-white text-xs px-4 py-2 rounded-lg ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={!isLoading ? onClick : undefined}
      disabled={isLoading}
    >
      {buttonText}
    </button>
  );
};

export default InvestmentButton;
