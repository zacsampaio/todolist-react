import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFluxos = create(
  persist(
    (set) => ({
      fluxos: [],
      addFluxo: (nome) =>
        set((state) => {
          // Encontrar o maior ID existente
          const maiorIdFluxo = state.fluxos.reduce((maior, fluxo) => Math.max(maior, fluxo.id), 0);
          const novoId = maiorIdFluxo + 1;

          return {
            fluxos: [
              ...state.fluxos,
              {
                id: novoId,
                nome,
                atividades: [],
              },
            ],
          };
        }),
      removeFluxo: (id) =>
        set((state) => ({
          fluxos: state.fluxos.filter((fluxo) => fluxo.id !== id),
        })),
      addAtividade: (fluxoId, atividade) =>
        set((state) => {
          const fluxo = state.fluxos.find((f) => f.id === fluxoId);
          if (!fluxo) return state;

          // Encontrar o maior ID de atividade existente
          const maiorIdAtividade = state.fluxos.reduce((maior, f) => {
            const maiorAtividade = f.atividades.reduce((m, a) => Math.max(m, a.id), 0);
            return Math.max(maior, maiorAtividade);
          }, 0);
          const novoIdAtividade = maiorIdAtividade + 1;

          const novaAtividade = {
            id: novoIdAtividade,
            text: atividade.text,
            ordem: fluxo.atividades.length,
          };

          return {
            fluxos: state.fluxos.map((f) =>
              f.id === fluxoId
                ? {
                    ...f,
                    atividades: [...f.atividades, novaAtividade],
                  }
                : f
            ),
          };
        }),
      removeAtividade: (fluxoId, atividadeId) =>
        set((state) => ({
          fluxos: state.fluxos.map((fluxo) =>
            fluxo.id === fluxoId
              ? {
                  ...fluxo,
                  atividades: fluxo.atividades.filter(
                    (atividade) => atividade.id !== atividadeId
                  ),
                }
              : fluxo
          ),
        })),
      updateAtividadeOrdem: (fluxoId, atividades) =>
        set((state) => ({
          fluxos: state.fluxos.map((fluxo) =>
            fluxo.id === fluxoId
              ? {
                  ...fluxo,
                  atividades: atividades.map((atividade, index) => ({
                    ...atividade,
                    ordem: index,
                  })),
                }
              : fluxo
          ),
        })),
      resetFluxos: () => set({ fluxos: [] }),
    }),
    {
      name: "fluxos-storage",
      onRehydrateStorage: (state) => {
        // Verifica se os dados do localStorage são válidos
        if (state && state.fluxos) {
          // Garante que cada fluxo tem um ID único
          const fluxosComIdsUnicos = state.fluxos.map((fluxo, index) => ({
            ...fluxo,
            id: fluxo.id || Date.now() + index,
            atividades: fluxo.atividades.map((atividade, idx) => ({
              ...atividade,
              id: atividade.id || Date.now() + index + idx,
              ordem: atividade.ordem || idx,
            })),
          }));
          
          // Retorna o estado atualizado
          return { fluxos: fluxosComIdsUnicos };
        }
        return state;
      },
    }
  )
);

// Função para limpar o localStorage se necessário
export const limparLocalStorage = () => {
  localStorage.removeItem("fluxos-storage");
  window.location.reload();
}; 