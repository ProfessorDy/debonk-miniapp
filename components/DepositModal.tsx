import React from "react";
import { IoClose, IoCopySharp } from "react-icons/io5";
import { QRCodeSVG } from "qrcode.react";
import { copyToClipboard } from "@/utils/clipboardUtils";

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
          <span>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(
            -4
          )}`}</span>
          <button
            className="ml-2"
            onClick={() => copyToClipboard(walletAddress)}
          >
            <IoCopySharp className="text-black" />
          </button>
        </div>

        {/* Share Button */}
        <button className="bg-transparent border border-accent w-full text-white py-2 px-6 rounded-lg">
          Share
        </button>
      </div>
    </div>
  );
};

export default DepositModal;
