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
  const buttonColor = type === "buy" ? "bg-[#1DD75B]" : "bg-[#E82E2E]";
  const buttonText = isLoading ? "..." : label;

  return (
    <button
      className={`${buttonColor} text-white text-xs px-4 py-3 rounded-lg min-w-20 ${
        isLoading ? "opacity-50 cursor-not-allowed font-semibold" : ""
      }`}
      onClick={!isLoading ? onClick : undefined}
      disabled={isLoading}
    >
      {buttonText}
    </button>
  );
};

export default InvestmentButton;
