import { create } from 'zustand';

interface UIState {
    modals: Record<string, boolean>;
    openModal: (id: string) => void;
    closeModal: (id: string) => void;
    toggleModal: (id: string) => void;
    isModalOpen: (id: string) => boolean;
}

export const useUIStore = create<UIState>((set, get) => ({
    modals: {},

    openModal: id => set(state => ({ modals: { ...state.modals, [id]: true } })),
    closeModal: id => set(state => ({ modals: { ...state.modals, [id]: false } })),
    toggleModal: id => set(state => ({ modals: { ...state.modals, [id]: !state.modals[id] } })),
    isModalOpen: id => !!get().modals[id],
}));
