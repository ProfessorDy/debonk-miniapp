import { FaExternalLinkAlt } from "react-icons/fa";

const PositionsPage = () => {
  const positions = [
    {
      name: "Hexacat",
      mc: "S3165",
      liq: "$72.46",
      capital: "0.50 SOL",
      value: "0.50 SOL",
      pnl: "-$1.72",
      pnlColor: "text-red-500", // Loss styling
    },
    {
      name: "Hexacat",
      mc: "S3165",
      liq: "$72.46",
      capital: "0.50 SOL",
      value: "0.50 SOL",
      pnl: "+$1.93",
      pnlColor: "text-green-500", // Profit styling
    },
    // Add more positions here as needed
  ];

  return (
    <div
      className="p-3 bg-black min-h-screen  bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Positions Overview</h1>
        <button className="text-accent border border-accent rounded-lg px-3 py-1">
          View On Solscan
        </button>
      </header>

      {/* Contract Input */}
      <div className="flex items-center justify-between bg-[#1B2330] p-3 rounded-lg mb-4">
        <input
          type="text"
          placeholder="Contract Address or Token link"
          className="bg-transparent w-full placeholder-gray-400 text-white outline-none"
        />
        <button className="text-accent ml-3">Paste</button>
      </div>

      {/* Positions List */}
      <div className="space-y-4">
        {positions.map((position, index) => (
          <div
            key={index}
            className="bg-[#1B2330] p-4 rounded-lg shadow-md space-y-2"
          >
            {/* Position Header */}
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">{position.name}</div>
              <FaExternalLinkAlt className="text-accent" />
            </div>

            {/* Position Details */}
            <div className="flex justify-between items-center text-sm">
              <div>
                <p>MC {position.mc}</p>
                <p>Liq {position.liq}</p>
              </div>
              <div>
                <p>Capital: {position.capital}</p>
                <p>Value: {position.value}</p>
              </div>
              <div className={`font-bold ${position.pnlColor}`}>
                PNL: {position.pnl}
              </div>
            </div>

            {/* Action Button */}
            <div className="text-right">
              <button className="text-accent">Descreener</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PositionsPage;
