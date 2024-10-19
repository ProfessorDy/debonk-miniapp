import React, { useState, useEffect } from "react";
import { IoLinkSharp } from "react-icons/io5";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

const ContractAddressPaster: React.FC = () => {
  const TokenModal = dynamic(() => import("@/components/TokenModal"));
  const [tokenInput, setTokenInput] = useState("");
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [showClipboardNotification, setShowClipboardNotification] =
    useState(false);

  useEffect(() => {
    if (tokenInput) {
      setIsPasteModalOpen(true);
    }
  }, [tokenInput]);

  const handlePaste = async () => {
    try {
      // Notify the user to allow clipboard access
      setShowClipboardNotification(true);

      // Wait for user interaction
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setTokenInput(clipboardText);

        // Show a toast notification after successful paste
        toast.success("Address pasted from clipboard!", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        setShowClipboardNotification(false); // Hide notification after success
      }
    } catch (err) {
      toast.error("Failed to paste from clipboard. Please allow access.", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      console.log("failed to paste from clipboard", err);
      setShowClipboardNotification(false); // Hide notification on error
    }
  };

  return (
    <>
      <section className="px-3">
        <div className="bg-background rounded-xl py-2 px-[8px] text-sm border-accent border">
          <div className="flex items-center text-[#797979]">
            <IoLinkSharp className="text-2xl" />
            <input
              type="text"
              placeholder="Contract Address or Token Link"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-grow px-1 leading-4 font-light bg-background border-none focus:outline-none"
            />
            <button
              onClick={handlePaste}
              onTouchStart={handlePaste} // Ensure touch support for mobile
              className="text-accent p-4"
            >
              Paste
            </button>
          </div>
        </div>
        {showClipboardNotification && (
          <div className="mt-2 p-2 bg-yellow-200 text-yellow-800 rounded">
            Please allow clipboard access for automatic pasting.
          </div>
        )}
      </section>

      <TokenModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        tokenAddress={tokenInput}
      />
    </>
  );
};

export default ContractAddressPaster;
