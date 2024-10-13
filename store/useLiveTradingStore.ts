import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LiveTradingState {
  isLiveTrading: boolean;
  toggleLiveTrading: () => void;
}

const useLiveTradingStore = create<LiveTradingState>()(
  persist(
    (set) => ({
      isLiveTrading: false, 
      toggleLiveTrading: () => set((state) => ({ isLiveTrading: !state.isLiveTrading })),
    }),
    {
      name: 'live-trading', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useLiveTradingStore;
