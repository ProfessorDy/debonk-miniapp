import React, { useState, useEffect, useCallback } from "react";
import { IoLinkSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const ContractAddressPaster = () => {
  const TokenModal = dynamic(() => import("@/components/TokenModal"));
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    if (tokenInput) {
      setIsPasteModalOpen(true);
    }
  }, [tokenInput]);

  // Handle the onPaste event
  const handleOnPaste: React.ClipboardEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        // Get the pasted content from clipboard
        const pasteContent = event.clipboardData.getData("text");

        // Prevent the default paste behavior
        event.preventDefault();

        // Update the input value with the modified content
        setTokenInput(pasteContent);

        // Show a toast notification after successful paste
        toast.success("Address pasted from clipboard!", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
      },
      [setTokenInput]
    );

  return (
    <>
      <section className="px-3 mt-6">
        <div className="bg-background rounded-xl py-2 px-[8px] text-sm border-accent border">
          <div className="flex items-center text-[#797979]">
            <IoLinkSharp className="text-2xl" />
            <input
              type="text"
              placeholder="Contract Address or Token Link"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onPaste={handleOnPaste}
              className="flex-grow px-1 leading-4 font-light bg-background border-none focus:outline-none"
            />
            <button
              onClick={() =>
                navigator.clipboard
                  .readText()
                  .then((text) => setTokenInput(text))
              }
              onTouchStart={() =>
                navigator.clipboard
                  .readText()
                  .then((text) => setTokenInput(text))
              }
              className="text-accent p-4"
            >
              Paste
            </button>
          </div>
        </div>
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
