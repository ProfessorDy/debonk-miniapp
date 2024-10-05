import React from "react";
import { IoClose } from "react-icons/io5";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 pb-16">
      <div className="bg-[#1B1B1B] h-[90%] w-full max-w-md p-6 text-center shadow-lg relative rounded-lg flex flex-col justify-between">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white">
          <IoClose size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-6">Amount</h2>

        <p>{walletAddress}</p>

        {/* Amount Display */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-5xl text-white font-bold">0.0 SOL</div>
          <div className="text-base text-gray-400">$0.00</div>
        </div>

        {/* MAX and Available Balance */}
        <div className="flex justify-between text-white mb-4">
          <button className="bg-gray-800 px-4 py-2 rounded-md">MAX</button>
          <span className="text-gray-500">Available: 0 SOL</span>
        </div>

        {/* Continue Button */}
        <button className="bg-[#0493CC] text-white font-semibold py-3 rounded-lg w-full mb-6">
          Continue
        </button>
      </div>
    </div>
  );
};

export default WithdrawModal;
