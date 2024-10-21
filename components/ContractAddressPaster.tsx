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
        const pasteContent = event.clipboardData.getData("text");
        event.preventDefault();
        setTokenInput(pasteContent);
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
      <section className="px-3 mt-6 fixed bottom-0 w-full">
        <div className="bg-background rounded-xl py-2 px-3 text-sm border-accent border w-full flex justify-center items-center">
          <IoLinkSharp className="text-2xl text-[#797979] mr-2" />
          <input
            type="text"
            placeholder="Contract Address or Token Link"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onPaste={handleOnPaste}
            className="flex-grow px-2 py-1 leading-4 font-light bg-background border-none focus:outline-none w-full"
          />
          <button
            onClick={() =>
              navigator.clipboard.readText().then((text) => setTokenInput(text))
            }
            onTouchStart={() =>
              navigator.clipboard.readText().then((text) => setTokenInput(text))
            }
            className="text-accent ml-2 px-4 py-2 rounded-lg bg-accent/20 hover:bg-accent/40 transition-all"
          >
            Paste
          </button>
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
