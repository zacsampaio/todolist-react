import { useState } from "react";
import ExportImport from "./ExportImport";

import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { VscSaveAs } from "react-icons/vsc";
import { TbPencilCancel } from "react-icons/tb";
import { MdAssignmentAdd } from "react-icons/md";
import { MdOutlineContentPasteSearch } from "react-icons/md";

import "./TodoList.css";

// Importação de imagens
import Icone from "./assets/icon.png";
import IconeFiltro from "./assets/filter.png";
import EstrelaMarcada from "./assets/estrela.png";
import EstrelaNaoMarcada from "./assets/estrelaNaoMarcada.png";
import useList from "./store/useList";

function TodoList() {
  const {
    addItem,
    removeItem,
    removeAll,
    editItem,
    listCopy,
    setFilter,
    filter,
    valueFilter,
    isSearchVisible,
    setIsSearchVisible,
    isFilterMenuOpen,
    setIsFilterMenuOpen,
      } = useList();
  const [newItem, setNewItem] = useState("");
  const [errorPriority, setErrorPriority] = useState("");

  // Adicionar item a lista

  function adicionaItem(form) {
    form.preventDefault();
    if (!newItem || newItem.length === 0) {
      return;
    }
    addItem(newItem);
    setNewItem("");
    document.getElementById("input-addItem").focus();
  }

  function filtrarTarefas(e) {
    const textSearch = e.target.value;
    setFilter(
      filter,
      filter === "Priority" ? Number(textSearch) : textSearch,
    );
  }

  function searchItems() {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setFilter("Nome", undefined);
      setErrorPriority("");
    }
  }

  function listaSuspensa() {
    setIsFilterMenuOpen(!isFilterMenuOpen);
    setFilter("Nome", undefined);
    setErrorPriority("");
  }

  return (
    <div>
      <div className="menuTop">
        <>
          <ExportImport />
        </>
      </div>

      <h1>Lista de Tarefas</h1>
      <form onSubmit={adicionaItem} className="addItem">
        <button type="button" onClick={searchItems} className="filter">
          <MdOutlineContentPasteSearch
            style={{ color: "white", fontSize: "20px" }}
          />
        </button>
        <input
          id="input-addItem"
          type="text"
          value={newItem}
          onChange={(e) => {
            setNewItem(e.target.value);
          }}
          placeholder="Adicione uma tarefa"
        />
        <button className="add" type="submit">
          <MdAssignmentAdd style={{ color: "white", fontSize: "20px" }} />
        </button>
      </form>

      {isSearchVisible && (
        <form
          className="filters"
          style={{ marginBottom: isFilterMenuOpen ? "110px" : "20px" }}
        >
          {isFilterMenuOpen && (
            <div>
              <ul className="filterAberto">
                <li
                  onClick={() => {
                    setIsFilterMenuOpen(false);
                    setFilter("Nome", "");
                  }}
                >
                  ➥ Nome
                </li>
                <li
                  onClick={() => {
                    setIsFilterMenuOpen(false);
                    setFilter("Priority", 0);
                  }}
                >
                  ➥ Prioridade
                </li>
                <li
                  onClick={() => {
                    setIsFilterMenuOpen(false);
                    setFilter("Concluidas", true);
                  }}
                >
                  ➥ Concluídas
                </li>
                <li
                  onClick={() => {
                    setIsFilterMenuOpen(false);
                    setFilter("Não Concluidas", false);
                  }}
                >
                  ➥ Não Concluídas
                </li>
              </ul>
            </div>
          )}
          <button type="button" onClick={listaSuspensa}>
            <img className="iconFiltro" src={IconeFiltro} />
          </button>
          <input
            type={filter === "Priority" ? "number" : "text"}
            value={valueFilter ?? ""}
            onChange={filtrarTarefas}
            placeholder={
              filter === "Nome"
                ? "Nome: Busque suas tarefas!"
                : "Priority: Busque suas tarefas (Ex: 1, 2 ou 3)"
            }
          />
          {errorPriority && (
            <div className="erroMensagem">{errorPriority}</div>
          )}
        </form>
      )}

      <div className="listaTarefas">
        <div style={{ textAlign: "center" }}>
          {listCopy.length < 1 ? (
            <img className="icon" src={Icone} />
          ) : (
            listCopy.map((item) => (
              <div
                key={item.id}
                className={item.isCompleted ? "item completo" : "item"}
              >
                {item.isEdit ? (
                  <div className="inputEdit">
                    <input
                      id="input-edit"
                      type="text"
                      value={item.textEdit}
                      onChange={(e) =>
                        editItem(item.id, { textEdit: e.target.value })
                      }
                    />
                    <button
                      className="editSave"
                      onClick={() =>
                        editItem(item.id, {
                          text: item.textEdit,
                          isEdit: false,
                        })
                      }
                    >
                      <VscSaveAs style={{ color: "white", fontSize: "20px" }} />
                    </button>
                    <button
                      className="editCancel"
                      onClick={() =>
                        editItem(item.id, {
                          isEdit: false,
                          textEdit: item.text,
                        })
                      }
                    >
                      <TbPencilCancel
                        style={{ color: "white", fontSize: "20px" }}
                      />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => editItem(item.id, { isPriority: 1 })}
                      className={
                        item.isPriority >= 1 ? "botao-selecionado" : ""
                      }
                    >
                      <img
                        className="estrela"
                        src={
                          item.isPriority >= 1
                            ? EstrelaMarcada
                            : EstrelaNaoMarcada
                        }
                      />
                    </button>
                    <button
                      onClick={() => editItem(item.id, { isPriority: 2 })}
                      className={
                        item.isPriority >= 2 ? "botao-selecionado" : ""
                      }
                    >
                      <img
                        className="estrela"
                        src={
                          item.isPriority >= 2
                            ? EstrelaMarcada
                            : EstrelaNaoMarcada
                        }
                      />
                    </button>
                    <button
                      onClick={() => editItem(item.id, { isPriority: 3 })}
                      className={
                        item.isPriority >= 3 ? "botao-selecionado" : ""
                      }
                    >
                      <img
                        className="estrela"
                        src={
                          item.isPriority >= 3
                            ? EstrelaMarcada
                            : EstrelaNaoMarcada
                        }
                      />
                    </button>
                    <span
                      onClick={() =>
                        editItem(item.id, { isCompleted: !item.isCompleted })
                      }
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => editItem(item.id, { isEdit: true })}
                      className="edit"
                    >
                      <AiFillEdit
                        style={{ color: "white", fontSize: "20px" }}
                      />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="del">
                      <AiFillDelete
                        style={{ color: "white", fontSize: "20px" }}
                      />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
        {listCopy.length > 0 && (
          <button onClick={() => removeAll()} className="deleteAll">
            Deletar todas
          </button>
        )}
      </div>
    </div>
  );
}

export default TodoList;
