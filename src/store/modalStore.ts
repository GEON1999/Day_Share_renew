import { create } from "zustand";

interface ModalStore {
  isCalendarDateModalOpen: boolean;
  setCalendarDateModalOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isCalendarDateModalOpen: false,
  setCalendarDateModalOpen: (open: boolean) =>
    set(() => ({ isCalendarDateModalOpen: open })),
}));
