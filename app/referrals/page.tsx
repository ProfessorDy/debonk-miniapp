"use client";

import React, { useState } from "react";
import { FaDownload, FaHistory, FaLock, FaWallet } from "react-icons/fa";
import { IoLinkSharp } from "react-icons/io5";

const Referrals = () => {
  const [balance] = useState("0.000 SOL");
  const [unrealizedPNL] = useState("-0.00%");
  const [tokenInput, setTokenInput] = useState("");

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const clipboardText = await navigator.clipboard.readText();
        setTokenInput(clipboardText);
      } else {
        console.log("Clipboard API not supported");
      }
    } catch (error) {
      console.error("Failed to paste content: ", error);
    }
  };

  return (
    <div
      className="p-3 bg-black min-h-screen  bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      Referral
    </div>
  );
};

export default Referrals;
