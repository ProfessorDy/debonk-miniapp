import React from "react";
import { IoClose, IoCopySharp } from "react-icons/io5";
import { QRCodeSVG } from "qrcode.react";
import { FaCopy } from "react-icons/fa";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black  top-40 rounded-xl w-full ] p-6 text-center relative shadow-lg">
        <button onClick={onClose} className="absolute top-2 left-2 text-accent">
          <IoClose size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-4">Deposit</h2>
        <div className="flex justify-center mb-4">
          <QRCodeSVG
            value={walletAddress}
            size={128}
            fgColor="#000000"
            bgColor="#0493CC"
          />
        </div>
        <p className="text-white mb-4">
          Your Debonk Solana Address <br />
          Receive tokens using this address as your deposit address
        </p>
        <div className="bg-accent rounded-lg p-2 mb-4 flex justify-center items-center text-black">
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
        <button className="border-accent border w-full text-white py-2 px-6 rounded-lg">
          Share
        </button>
      </div>
    </div>
  );
};

export default DepositModal;
