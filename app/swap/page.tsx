"use client";

import React, { useState } from "react";
import { CgArrowsExchangeV } from "react-icons/cg";
import { pasteFromClipboard } from "@/utils/clipboardUtils";

const Swap = () => {
  const [recipientAddress, setRecipientAddress] = useState("");
  // State for the two wallet selections
  const [payCurrency, setPayCurrency] = useState("USDT BNB");
  const [receiveCurrency, setReceiveCurrency] = useState("USDC AVAX");
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  // Function to swap the wallets
  const handleSwap = () => {
    setPayCurrency(receiveCurrency);
    setReceiveCurrency(payCurrency);
    setPayAmount(receiveAmount);
    setReceiveAmount(payAmount);
  };

  const handlePaste = async () => {
    const clipboardText = await pasteFromClipboard();
    if (clipboardText) {
      setRecipientAddress(clipboardText);
    }
  };
  return (
    <main
      className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      {/* Title */}
      <h2 className="text-2xl font-semibold text-white text-center mb-2">
        Cross Chain Swap
      </h2>

      <section className="mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3 ">
        {/* Pay Wallet Section */}
        <div className="mt-6">
          <div className="flex justify-between text-white text-sm">
            <p>Use Debonk wallet?</p>
            <p>Balance: 1,2837.47</p>
          </div>
          <div className="flex justify-between items-center mt-3 bg-black p-3 rounded-lg">
            <input
              type="text"
              className="bg-black w-1/2 text-white text-lg outline-none"
              placeholder="0.00"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />
            <select
              value={payCurrency}
              onChange={(e) => setPayCurrency(e.target.value)}
              className="bg-background text-white text-lg outline-none"
            >
              <option>USDT BNB</option>
              <option>BTC BNB</option>
              <option>ETH BNB</option>
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-[-4]">
          <button
            onClick={handleSwap}
            className="text-accent text-5xl bg-background"
          >
            <CgArrowsExchangeV />
          </button>
        </div>

        {/* Receive Wallet Section */}
        <div>
          <div className="flex justify-between items-center bg-black p-3 rounded-lg">
            <input
              type="text"
              className="bg-black w-1/2 text-white text-lg outline-none"
              placeholder="0.00"
              value={receiveAmount}
              onChange={(e) => setReceiveAmount(e.target.value)}
            />
            <select
              value={receiveCurrency}
              onChange={(e) => setReceiveCurrency(e.target.value)}
              className="bg-background text-white text-lg outline-none"
            >
              <option>USDC AVAX</option>
              <option>ETH AVAX</option>
              <option>BTC AVAX</option>
            </select>
          </div>
        </div>

        {/* Recipient Address */}
        <p className="text-primary text-xs font-semibold py-3">
          Use Debonk wallet
        </p>
        <div className="bg-black rounded-xl py-[24px] px-[8px] text-sm border-accent border">
          <div className="flex items-center text-[#797979]">
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="flex-grow px-1 text-[10px] leading-4 font-light bg-black border-none focus:outline-none"
            />
            <button onClick={handlePaste} className="text-accent text-sm">
              Paste
            </button>
          </div>
        </div>
      </section>

      {/* Fee Section */}
      <div className="mt-10 text-sm space-y-2 font-poppins font-light">
        <div className="flex justify-between w-full font-normal">
          <p>Fee</p>
          <p>$0.00</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Gas Cost</p>
          <p>0.00 BNB</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Estimated Time For Transfer</p>
          <p>0 Min</p>
        </div>
      </div>

      {/* Continue Button */}
      <button className="bg-gradient-to-r  from-[#0A6183] to-[#108FB9] w-full p-4 text-black font-poppins rounded-lg text-lg mt-20">
        Continue
      </button>
    </main>
  );
};

export default Swap;
