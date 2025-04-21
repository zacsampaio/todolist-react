import { useState, useEffect } from "react";
import { useFluxos } from "../../store/useFluxos";
import { AdicionarAtividadeFluxo } from "../AdicionarAtividadeFluxo/Index";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { VscSaveAs } from "react-icons/vsc";
import { TbPencilCancel } from "react-icons/tb";
import "./styles.css";

export function ListaFluxos() {
  const [fluxoSelecionado, setFluxoSelecionado] = useState(null);
  const [atividades, setAtividades] = useState([]);

  const fluxos = useFluxos((state) => state.fluxos);
  const removeFluxo = useFluxos((state) => state.removeFluxo);
  const editFluxo = useFluxos((state) => state.editFluxo);
  const editAtividade = useFluxos((state) => state.editAtividade);
  const updateAtividadeOrdem = useFluxos((state) => state.updateAtividadeOrdem);

  useEffect(() => {
    if (fluxoSelecionado) {
      const fluxo = fluxos.find((f) => f.id === fluxoSelecionado);
      if (fluxo && fluxo.atividades) {
        setAtividades(fluxo.atividades.map(atividade => ({
          id: atividade.id,
          text: atividade.text || '',
          ordem: atividade.ordem || 0,
          isEdit: atividade.isEdit || false,
          textEdit: atividade.textEdit || '',
        })));
      } else {
        // Se o fluxo não existe mais, limpa as atividades
        setAtividades([]);
        setFluxoSelecionado(null);
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

  const handleRemoveFluxo = (fluxoId) => {
    removeFluxo(fluxoId);
    if (fluxoId === fluxoSelecionado) {
      setFluxoSelecionado(null);
      setAtividades([]);
    }
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
            {fluxo.isEdit ? (
              <form className="inputEdit">
                <input
                  type="text"
                  value={fluxo.textEdit}
                  onChange={(e) =>
                    editFluxo(fluxo.id, { textEdit: e.target.value })
                  }
                />
                <button
                  className="editSave"
                  type="submit"
                  onClick={(e) => {
                    e.stopPropagation();
                    editFluxo(fluxo.id, {
                      nome: fluxo.textEdit,
                      isEdit: false,
                    });
                  }}
                >
                  <VscSaveAs style={{ color: "white", fontSize: "20px" }} />
                </button>
                <button
                  className="editCancel"
                  onClick={(e) => {
                    e.stopPropagation();
                    editFluxo(fluxo.id, {
                      isEdit: false,
                      textEdit: fluxo.nome,
                    });
                  }}
                >
                  <TbPencilCancel style={{ color: "white", fontSize: "20px" }} />
                </button>
              </form>
            ) : (
              <>
                <span>{fluxo.nome}</span>
                <div className="fluxoButtons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editFluxo(fluxo.id, { isEdit: true });
                    }}
                    className="edit"
                  >
                    <AiFillEdit style={{ color: "white", fontSize: "20px" }} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFluxo(fluxo.id);
                    }}
                    className="del"
                  >
                    <AiFillDelete style={{ color: "white", fontSize: "20px" }} />
                  </button>
                </div>
              </>
            )}
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
                            {atividade.isEdit ? (
                              <form className="inputEdit">
                                <input
                                  type="text"
                                  value={atividade.textEdit}
                                  onChange={(e) =>
                                    editAtividade(fluxoSelecionado, atividade.id, {
                                      textEdit: e.target.value,
                                    })
                                  }
                                />
                                <button
                                  className="editSave"
                                  type="submit"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    editAtividade(fluxoSelecionado, atividade.id, {
                                      text: atividade.textEdit,
                                      isEdit: false,
                                    });
                                  }}
                                >
                                  <VscSaveAs
                                    style={{ color: "white", fontSize: "20px" }}
                                  />
                                </button>
                                <button
                                  className="editCancel"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    editAtividade(fluxoSelecionado, atividade.id, {
                                      isEdit: false,
                                      textEdit: atividade.text,
                                    });
                                  }}
                                >
                                  <TbPencilCancel
                                    style={{ color: "white", fontSize: "20px" }}
                                  />
                                </button>
                              </form>
                            ) : (
                              <div className="conteudoAtividade">
                                <span className="textoAtividade">
                                  {atividade.text}
                                </span>
                                <div className="atividadeButtons">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      editAtividade(fluxoSelecionado, atividade.id, {
                                        isEdit: true,
                                      });
                                    }}
                                    className="edit"
                                  >
                                    <AiFillEdit
                                      style={{ color: "white", fontSize: "20px" }}
                                    />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      editAtividade(fluxoSelecionado, atividade.id, {
                                        isEdit: false,
                                      });
                                    }}
                                    className="del"
                                  >
                                    <AiFillDelete
                                      style={{ color: "white", fontSize: "20px" }}
                                    />
                                  </button>
                                </div>
                              </div>
                            )}
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