import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const useList2 = create(
  persist((set, get) => ({
    listCopy: [],
    list: [],
    filter: "",
    valueFilter: "",
    buscaVisivel: false,
    set
  })),
  {
    name: 'list-storage',
    storage: createJSONStorage(() => localStorage),
  }
);

export default useList2;