import React from "react";

const SkeletonLoader = () => {
  return (
    <main className="pt-0 p-3 pb-20 bg-black min-h-screen bg-repeat-y">
      <section className="mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
        {/* Wallet Address Section */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-light bg-gray-600 animate-pulse h-4 w-1/3 rounded"></p>
            <p className="text-xs text-primary font-light bg-gray-600 animate-pulse h-4 w-1/4 rounded"></p>
          </div>
          <button className="bg-gray-600 animate-pulse h-8 w-24 rounded"></button>
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="flex gap-1 relative text-sm items-baseline text-primary">
            <span className="bg-gray-600 animate-pulse h-4 w-24 rounded"></span>
            <div className="bg-gray-600 animate-pulse h-4 w-4 rounded"></div>
          </p>
          <h2 className="bg-gray-600 animate-pulse h-10 w-32 rounded"></h2>
          <p className="text-primary flex gap-[2px] items-center">
            <span className="bg-gray-600 animate-pulse h-4 w-28 rounded"></span>
          </p>
        </div>

        <div className="flex justify-center items-center text-sm gap-1 pt-2 font-poppins">
          <span className="bg-gray-600 animate-pulse h-4 w-16 rounded"></span>
        </div>

        {/* Action Buttons */}
        <div className="flex w-3/5 mx-auto justify-between mt-4 text-[10px] text-accent font-light">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-[3px] p-2 rounded-lg shadow border border-accent w-[60px] bg-gray-600 animate-pulse h-16"
            ></div>
          ))}
        </div>
      </section>

      <section className="mt-2 mb-5 bg-[#3C3C3C3B] backdrop-blur-2xl border-[#0493CC] border-[.5px] text-white shadow-lg rounded-xl p-3">
        <p className="text-xs font-light bg-gray-600 animate-pulse h-4 w-1/4 rounded"></p>
        <div className="flex flex-col gap-2 mt-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-[#1C1C1C] border-[#2F2F2F] border-[1px] p-3 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-base font-bold bg-gray-600 animate-pulse h-4 w-1/2 rounded"></p>
              </div>
              <div className="text-sm flex justify-between items-center">
                <div>
                  <p className="bg-gray-600 animate-pulse h-4 w-1/2 rounded"></p>
                  <p className="bg-gray-600 animate-pulse h-4 w-1/2 rounded"></p>
                </div>
                <div className="text-right">
                  <p className="bg-gray-600 animate-pulse h-4 w-16 rounded"></p>
                  <p className="bg-gray-600 animate-pulse h-4 w-16 rounded"></p>
                </div>
              </div>
              <div className="mt-2 text-right">
                <p className="bg-gray-600 animate-pulse h-4 w-16 rounded"></p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default SkeletonLoader;
