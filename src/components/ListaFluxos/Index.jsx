import { useState, useEffect } from "react";
import { useFluxos } from "../../store/useFluxos";
import { AdicionarAtividadeFluxo } from "../AdicionarAtividadeFluxo/Index";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./styles.css";

export function ListaFluxos() {
  const [fluxoSelecionado, setFluxoSelecionado] = useState(null);
  const [atividades, setAtividades] = useState([]);

  const fluxos = useFluxos((state) => state.fluxos);
  const removeFluxo = useFluxos((state) => state.removeFluxo);
  const updateAtividadeOrdem = useFluxos((state) => state.updateAtividadeOrdem);

  useEffect(() => {
    if (fluxoSelecionado) {
      const fluxo = fluxos.find((f) => f.id === fluxoSelecionado);
      if (fluxo && fluxo.atividades) {
        setAtividades(fluxo.atividades.map(atividade => ({
          id: atividade.id,
          text: atividade.text || '',
          ordem: atividade.ordem || 0
        })));
      }
    } else {
      setAtividades([]);
    }
  }, [fluxoSelecionado, fluxos]);

  const handleDragEnd = (result) => {
    if (!result.destination || !fluxoSelecionado) return;

    const items = Array.from(atividades);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Atualizar a ordem das atividades
    const atividadesComOrdem = items.map((item, index) => ({
      ...item,
      ordem: index
    }));

    setAtividades(atividadesComOrdem);
    updateAtividadeOrdem(fluxoSelecionado, atividadesComOrdem);
  };

  return (
    <div className="containerFluxos">
      <div className="listaFluxos">
        {fluxos.map((fluxo) => (
          <div
            key={`fluxo-${fluxo.id}`}
            className={`fluxoItem ${
              fluxoSelecionado === fluxo.id ? "selecionado" : ""
            }`}
            onClick={() => setFluxoSelecionado(fluxo.id)}
          >
            <span>{fluxo.nome}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFluxo(fluxo.id);
              }}
              className="removerFluxo"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="conteudoFluxo">
        {fluxoSelecionado && (
          <>
            <AdicionarAtividadeFluxo fluxoId={fluxoSelecionado} />
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId={`droppable-${fluxoSelecionado}`}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="listaAtividades"
                  >
                    {atividades.map((atividade, index) => (
                      <Draggable
                        key={`atividade-${atividade.id}`}
                        draggableId={`atividade-${atividade.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="atividade"
                          >
                            <div className="conteudoAtividade">
                              <span className="textoAtividade">{atividade.text}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </>
        )}
      </div>
    </div>
  );
}