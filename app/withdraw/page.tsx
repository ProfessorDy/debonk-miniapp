import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import useTelegramUserStore from "@/store/useTelegramUserStore";
import { useRouter } from "next/navigation";

interface WithdrawPageProps {
  solPrice: number;
  availableBalance: number;
}

const WithdrawPage: React.FC<WithdrawPageProps> = ({
  availableBalance,
  solPrice,
}) => {
  const { userId } = useTelegramUserStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(0.0);
  const [walletAddress, setWalletAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  const handleConfirmAndSend = async () => {
    try {
      const response = await fetch(
        `/api/withdrawSol?telegramId=${userId}&amount=${amount}&destinationAddress=${walletAddress}`
      );
      const result = await response.json();
      if (response.ok) {
        setStep(3); // Move to success screen
      } else {
        console.error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Error while processing withdrawal:", error);
    }
  };

  const validateAddress = (address: string) => {
    if (address.length < 10) {
      setAddressError("Invalid wallet address. Too short.");
      return false;
    }
    setAddressError("");
    return true;
  };

  const renderStepOne = () => (
    <div className="flex flex-col justify-between h-full">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Enter Withdrawal Details
      </h2>

      <div className="flex flex-col items-start mb-4 w-full">
        <label htmlFor="walletAddress" className="text-gray-400 mb-2">
          Wallet Address
        </label>
        <input
          type="text"
          id="walletAddress"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          onBlur={() => validateAddress(walletAddress)}
          placeholder="Enter wallet address"
          className="bg-gray-800 text-white p-3 w-full rounded-md"
        />
        {addressError && (
          <p className="text-red-500 text-sm mt-2">{addressError}</p>
        )}
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="text-5xl text-white font-bold">{amount} SOL</div>
        <div className="text-base text-gray-400">
          ${amount && solPrice ? (amount * solPrice).toFixed(2) : "0.00"}
        </div>
      </div>

      <div className="flex justify-between text-white mb-4">
        <button
          onClick={() => setAmount(availableBalance)}
          className="bg-gray-800 px-4 py-2 rounded-md"
        >
          MAX
        </button>
        <span className="text-gray-500">Available: {availableBalance} SOL</span>
      </div>

      <button
        onClick={() => {
          if (validateAddress(walletAddress)) {
            setStep(2);
          }
        }}
        className={`${
          !walletAddress || addressError ? "bg-gray-600" : "bg-[#0493CC]"
        } text-white font-semibold py-3 rounded-lg w-full mb-6`}
        disabled={!walletAddress || !!addressError}
      >
        Continue
      </button>
    </div>
  );

  const renderStepTwo = () => (
    <div className="flex flex-col justify-between h-full">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Confirm Withdrawal
      </h2>

      <div className="bg-gray-900 p-4 rounded-lg text-left text-gray-300 mb-4">
        <div className="mb-2">Address: {walletAddress}</div>
        <div>Amount: {amount} SOL</div>
      </div>

      <button
        onClick={handleConfirmAndSend}
        className="bg-[#0493CC] text-white font-semibold py-3 rounded-lg w-full mb-6"
      >
        Confirm & Send
      </button>
    </div>
  );

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
        onClick={() => router.push("/")}
        className="bg-[#0493CC] text-white font-semibold py-3 rounded-lg w-full mb-6"
      >
        Close
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 pb-16">
      <div className="bg-[#1B1B1B] h-[90%] w-full max-w-md p-6 text-center shadow-lg relative rounded-lg flex flex-col">
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 text-white"
        >
          <IoClose size={24} />
        </button>

        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderSuccess()}
      </div>
    </div>
  );
};

export default WithdrawPage;
