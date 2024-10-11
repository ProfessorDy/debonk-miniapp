import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  availableBalance: number; // New prop for available balance
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
  availableBalance, // Now being passed as a prop
}) => {
  const [step, setStep] = useState(1); // To track which step of the form we're in
  const [amount, setAmount] = useState<number | string>(""); // Tracking amount, starting as empty
  const [isProcessing, setIsProcessing] = useState(false); // Loading state for the withdrawal

  if (!isOpen) return null;

  // Handle the MAX button click
  const handleMaxClick = () => {
    setAmount(availableBalance);
  };

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value <= availableBalance) {
      setAmount(value);
    }
  };

  // Step 1 - Enter Amount
  const renderStepOne = () => (
    <div className="flex flex-col justify-between h-full">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-white mb-6">Amount</h2>

      {/* Wallet Address */}
      <div className="bg-gray-900 p-4 rounded-lg text-left text-gray-300 mb-4">
        To: {walletAddress.slice(0, 5)}...{walletAddress.slice(-5)}
      </div>

      {/* Amount Input */}
      <div className="flex flex-col items-center mb-6">
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="text-5xl text-white font-bold bg-transparent border-none focus:outline-none w-full text-center"
          placeholder="0.0"
          min="0"
          max={availableBalance}
          step="0.01"
        />
        <div className="text-base text-gray-400">
          {amount
            ? `$${(parseFloat(amount.toString()) * 22.5).toFixed(2)}`
            : "$0.00"}{" "}
          {/* Assuming 1 SOL = $22.5 */}
        </div>
      </div>

      {/* MAX and Available Balance */}
      <div className="flex justify-between text-white mb-4">
        <button
          onClick={handleMaxClick}
          className="bg-gray-800 px-4 py-2 rounded-md"
        >
          MAX
        </button>
        <span className="text-gray-500">Available: {availableBalance} SOL</span>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => amount > 0 && setStep(2)} // Validate amount is more than 0
        className={`${
          amount > 0 ? "bg-[#0493CC]" : "bg-gray-600 cursor-not-allowed"
        } text-white font-semibold py-3 rounded-lg w-full mb-6`}
        disabled={amount <= 0}
      >
        Continue
      </button>
    </div>
  );

  // Step 2 - Confirm Details
  const renderStepTwo = () => (
    <div className="flex flex-col justify-between h-full">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-white mb-6">Withdraw</h2>

      {/* Confirm Details */}
      <div className="bg-gray-900 p-4 rounded-lg text-left text-gray-300 mb-4">
        <div className="mb-2">Address: {walletAddress}</div>
        <div>Amount: {amount} SOL</div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleConfirmAndSend}
        className={`${
          isProcessing ? "bg-gray-600 cursor-not-allowed" : "bg-[#0493CC]"
        } text-white font-semibold py-3 rounded-lg w-full mb-6`}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Confirm & Send"}
      </button>
    </div>
  );

  // Step 3 - Success Screen
  const renderSuccess = () => (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="bg-green-500 rounded-full p-6 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-white mb-6">
        Transaction Sent
      </h2>
      <div className="text-gray-400 mb-6">To: {walletAddress}</div>
      <div className="text-white mb-6">- {amount} SOL</div>
      <button
        onClick={onClose}
        className="bg-[#0493CC] text-white font-semibold py-3 rounded-lg w-full mb-6"
      >
        Close
      </button>
    </div>
  );

  // Simulating the transaction processing
  const handleConfirmAndSend = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setStep(3); // After a short delay, move to success step
      setIsProcessing(false);
    }, 2000); // Simulate a delay of 2 seconds for processing
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 pb-16">
      <div className="bg-[#1B1B1B] h-[90%] w-full max-w-md p-6 text-center shadow-lg relative rounded-lg flex flex-col">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white">
          <IoClose size={24} />
        </button>

        {/* Conditional rendering based on step */}
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderSuccess()}
      </div>
    </div>
  );
};

export default WithdrawModal;
