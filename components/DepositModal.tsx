import React, { useState } from "react";
import { IoClose, IoCopyOutline } from "react-icons/io5";
import { QRCodeSVG } from "qrcode.react";
import { FaCheck } from "react-icons/fa";
import { copyToClipboard } from "@/utils/clipboardUtils";
import { toast } from "react-toastify";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share Wallet Address",
          text: walletAddress,
        });
        console.log("Address shared successfully");
      } catch (error) {
        console.error("Error sharing address:", error);
      }
    } else {
      toast.info(
        "Sharing is not supported on your device. Please copy the wallet address below and paste it into your preferred app to share it manually"
      );
    }
  };

  const handleCopy = () => {
    copyToClipboard(walletAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-40 pb-16">
      <div className="bg-black h-[90%] w-full max-w-md p-6 text-center shadow-lg relative rounded-lg flex flex-col justify-center">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 left-4 text-accent">
          <IoClose size={24} />
        </button>

        <div className="fixed bottom-0"></div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-6">Deposit</h2>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <QRCodeSVG
            value={walletAddress}
            size={160}
            fgColor="#0493CC"
            bgColor="#000000"
          />
        </div>

        {/* Address Info */}
        <p className="text-white text-sm mb-4">
          Your Debonk Solana Address <br />
          Receive tokens using this address as your deposit address
        </p>

        {/* Address with Copy Button */}
        <div className="bg-[#0493CC] rounded-lg p-3 mb-6 flex justify-center items-center text-black">
          <p
            className="flex gap-1 relative text-sm items-baseline cursor-pointer"
            onClick={handleCopy}
          >
            <span>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(
              -4
            )}`}</span>
            {copySuccess ? (
              <FaCheck className="text-[10px]" />
            ) : (
              <IoCopyOutline className="text-[10px]" title="Copy Address" />
            )}
          </p>
        </div>

        {/* Share Button */}
        <button
          className="bg-transparent border border-accent w-full text-white py-2 px-6 rounded-lg p-3 mb-6"
          onClick={handleShare}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default DepositModal;
