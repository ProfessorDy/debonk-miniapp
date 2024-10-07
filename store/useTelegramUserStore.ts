import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  userId: string;
  setUserId: (userId: string) => void;
}

const useTelegramUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: '',
      setUserId: (userId) => set(() => ({ userId })),
    }),
    {
      name: 'telegram-user', // Unique name for the storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTelegramUserStore;
