import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

const useList = create(
  persist((set, get) => ({
    listCopy: [],
    list: [],
    filter: "",
    valueFilter: "",
    isSearchVisible: false,
    setIsSearchVisible: (value) => set((state) => ({...state, isSearchVisible: value})),
    isFilterMenuOpen: false,
    setIsFilterMenuOpen: (value) => set((state) => ({...state, isFilterMenuOpen: value})),
    // Adicionar itens a lista
    addItem: (title, completed, priority) => {
      set((state) => {
        const newList = [
          ...state.list,
          {
            text: title,
            id: 
              state.list.length > 0
                ? state.list[state.list.length -1].id + 1
                : 1,
            isCompleted: completed ?? false,
            isPriority: priority ?? 0,
            isEdit: false,
            textEdit: title,
          },
        ];
        return {...state, list: newList}
      });
      get().updateList()
    },
    // Função para deletar um item espeficio
    removeItem: (id) => {
      set ((state) => {
        const newList = state.list.filter((item) => item.id !== id);
        return {...state, list: newList};
      });
      get().updateList()
    },
    // Remover todos os itens listados
    removeAll: () => {
      const ids = get().listCopy.map((item) => item.id);

      set ((state) => ({
        ...state,
        listCopy: [],
        list: state.list.filter((item) => !ids.includes(item.id)),
      }));
    },
    // Editar item
    editItem: (id, date) => {
      set ((state) => {
        const newList = state.list.map((item) => {
          if (item.id === id){
            return {...item, ...date};
          }
          return item;
        });
        return {...state, list: newList}
      });
      get().updateList()
    },
    setFilter: (key, value) => {
      let filterValue = value;
  
      if (value === "Concluídas") {
        filterValue = true;
      } else if (value === "Não Concluídas") {
        filterValue = false;
      }
    
      set((state) => {
        return { ...state, filter: key, valueFilter: filterValue };
      });
      get().updateList();
    },
    updateList: () => {
      set ((state) => {
        const filteredList = state.list.filter((item) => {
          if (!state.filter || typeof state.valueFilter === 'undefined') {
            return item;
          }
          let filter = '';
            switch (state.filter){
              case "Nome":
                filter = 'text';
                break
              case "Priority":
                filter = "isPriority"
                break
              case "Concluidas":
              case "Não Concluidas":
                filter = "isCompleted";
                break
              default:
                return item;
            }

          if (typeof state.valueFilter === 'string') {
            return item[filter] && item[filter].toUpperCase().includes(state.valueFilter.toUpperCase());
          } else {
            return item[filter] === state.valueFilter;
          }
        });
        return {...state, listCopy: filteredList};
      })
    } 
  })),
  {
    name: 'list-storage',
    storage: createJSONStorage(() => localStorage),
  }
);

export default useList;