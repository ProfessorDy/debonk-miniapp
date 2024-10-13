import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  walletAddress: string;
  setWalletAddress: (userId: string) => void;
}

const useWalletAddressStore = create<UserState>()(
  persist(
    (set) => ({
      walletAddress: '',
      setWalletAddress: (walletAddress) => set(() => ({ walletAddress })),
    }),
    {
      name: 'user-wallet-address', // Unique name for the storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useWalletAddressStore;
