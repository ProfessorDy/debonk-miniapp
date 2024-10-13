import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  walletAddress: string;
  setWallateAddress: (userId: string) => void;
}

const useTelegramUserStore = create<UserState>()(
  persist(
    (set) => ({
      walletAddress: '',
      setWallateAddress: (walletAddress) => set(() => ({ walletAddress })),
    }),
    {
      name: 'user-wallet-address', // Unique name for the storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTelegramUserStore;
