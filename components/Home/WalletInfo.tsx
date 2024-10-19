import { IoCopySharp } from "react-icons/io5";
import { CiCircleAlert } from "react-icons/ci";

interface WalletInfoProps {
  walletAddress: string;
  unrealizedPNL: string;
  walletBalance: number;
  totalValueInUsd: number | null;
  handleCopy: () => void;
}

const WalletInfo: React.FC<WalletInfoProps> = ({
  walletAddress,
  unrealizedPNL,
  walletBalance,
  totalValueInUsd,
  handleCopy,
}) => (
  <div className="wallet-info">
    <p className="text-sm font-light">
      Unrealized PNL: <span className="text-red-500">{unrealizedPNL}</span>
    </p>
    <p className="text-xs text-primary font-light">$0.00</p>
    <div className="flex flex-col items-center justify-center">
      <p className="flex gap-1 relative text-sm items-baseline text-primary">
        <span>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(
          -4
        )}`}</span>
        <IoCopySharp
          className="cursor-pointer text-[10px]"
          onClick={handleCopy}
          title="Copy Address"
        />
      </p>
      <h2 className="text-[34px] ">{walletBalance} SOL</h2>
      <p className="text-primary flex gap-[2px] items-center">
        {totalValueInUsd !== null ? `$${totalValueInUsd.toFixed(2)}` : "$0.00"}{" "}
        <CiCircleAlert className="text-xs" />
      </p>
    </div>
  </div>
);

export default WalletInfo;
