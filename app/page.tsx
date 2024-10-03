// pages/index.tsx (or Home.tsx)
import ClientHome from "@/components/ClientHome";

const Home = () => {
  return (
    <main
      className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y"
      style={{ backgroundImage: "url('/Rectangle.png')" }}
    >
      <ClientHome />
      {/* Other sections can remain server-rendered */}
      <section>
        <h2 className="text-[17px] leading-[25.5px] font-poppins mb-2">
          Position Overview
        </h2>
        <ul className="space-y-2">
          {[
            { name: "Hexacat", value: 0.5, price: 72.46, change: -98 },
            { name: "Hexacat", value: 0.5, price: 72.46, change: +88 },
            { name: "Hexacat", value: 0.5, price: 72.46, change: -98 },
          ].map((position, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center p-4 bg-background"
            >
              <div>
                <p>{position.name}</p>
                <p className="text-sm text-gray-400">
                  MC: {position.value} sol
                </p>
                <p className="text-sm text-gray-400">LIQ: ${position.price}</p>
              </div>
              <div
                className={`text-[9.45px] px-7 py-[9.45px] rounded-[6.3px] w-[78px] ${
                  position.change < 0 ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {position.change}%
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Home;
