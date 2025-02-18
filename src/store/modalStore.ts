import { create } from "zustand";

interface ModalStore {
  isCalendarDateModalOpen: boolean;
  setCalendarDateModalOpen: (open: boolean) => void;
  isTodoDetailModalOpen: boolean;
  setTodoDetailModalOpen: (open: boolean) => void;
  isTodoCreateModalOpen: boolean;
  setTodoCreateModalOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isCalendarDateModalOpen: false,
  setCalendarDateModalOpen: (open: boolean) =>
    set(() => ({ isCalendarDateModalOpen: open })),
  isTodoDetailModalOpen: false,
  setTodoDetailModalOpen: (open: boolean) =>
    set(() => ({ isTodoDetailModalOpen: open })),
  isTodoCreateModalOpen: false,
  setTodoCreateModalOpen: (open: boolean) =>
    set(() => ({ isTodoCreateModalOpen: open })),
}));
