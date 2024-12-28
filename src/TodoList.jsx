import React, { useState, useEffect } from "react";
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
import IconeFiltro from "./assets/filtro.png";
import EstrelaMarcada from "./assets/estrela.png";
import EstrelaNaoMarcada from "./assets/estrelaNaoMarcada.png";

function TodoList() {
  const [lista, setLista] = useState([]);
  const [listaVisivel, setListaVisivel] = useState([]);
  const [novoItem, setNovoItem] = useState("");
  const [busca, setBusca] = useState("");
  const [buscaVisivel, setBuscaVisivel] = useState(false);
  const [menuFiltroAberto, setMenuFiltroAberto] = useState(false);
  const [filtroSelecionado, setFiltroSelecionado] = useState("Nome");
  const [erroPrioridade, setErroPrioridade] = useState("");
  const [editandoID, setEditandoID] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");

  useEffect(() => {
    try {
      const listaStorage = localStorage.getItem("Lista");
      if (listaStorage) {
        setLista(JSON.parse(listaStorage));
      }
    } catch (error) {
      console.error("Erro ao carregar a lista do localstorage: ", error);
    }
  }, []);

  useEffect(() => {
    const listaFiltrada = lista.filter((item) => {
      switch (filtroSelecionado) {
        case "Nome":
          return item.text.toLowerCase().includes(busca.toLowerCase());

        case "Prioridade":
          if (busca && (isNaN(busca) || busca < 1 || busca > 3)) {
            setErroPrioridade(
              "Informe apenas os números 1, 2 ou 3, para buscar as respectivas prioridades!"
            );
            return false;
          }
          setErroPrioridade("");
          return item.isPrioridade.toString().includes(busca);

        case "Concluidas":
          return item.isCompleted === true;

        case "Não Concluidas":
          return item.isCompleted === false;

        default:
          return true;
      }
    });
    setListaVisivel(listaFiltrada);
  }, [lista, busca, filtroSelecionado]);

  function adicionaItem(form) {
    form.preventDefault();
    if (!novoItem || novoItem.length === 0) {
      return;
    }
    setLista((state) => {
      const novaLista = [
        ...state,
        {
          text: novoItem,
          id: state.length > 0 ? state[state.length - 1].id + 1 : 1,
          isCompleted: false,
          isPrioridade: 0,
        },
      ];
      localStorage.setItem("Lista", JSON.stringify(novaLista));
      return novaLista;
    });
    if (filtroSelecionado === "Nome") {
      setBuscaVisivel(false);
    }
    setNovoItem("");
    document.getElementById("input-entrada").focus();
  }

  function definePrioridade(id, valor) {
    setLista((prevLista) => {
      const novaLista = prevLista.map((item) => {
        if (item.id === id) {
          item.isPrioridade = valor;
        }
        return item;
      });
      localStorage.setItem("Lista", JSON.stringify(novaLista));
      return novaLista;
    });
  }

  function completar(id) {
    setLista((prevLista) => {
      const novaLista = prevLista.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      );
      localStorage.setItem("Lista", JSON.stringify(novaLista));
      return novaLista;
    });
  }

  function editar(id) {
    const idParaEditar = lista.find((item) => item.id === id);
    if (idParaEditar) {
      setEditandoID(id);
      setTextoEditado(idParaEditar.text);
    }
  }

  function salvarEdicao(id) {
    setLista((prevLista) => {
      const novaLista = prevLista.map((item) => {
        if (item.id === id) {
          item.text = textoEditado;
        }
        return item;
      });
      localStorage.setItem("Lista", JSON.stringify(novaLista));
      return novaLista;
    });
    setEditandoID(null);
    setTextoEditado("");
  }

  function deleta(id) {
    setLista((state) => {
      const novaLista = state.filter((item) => item.id !== id);
      localStorage.setItem("Lista", JSON.stringify(novaLista));
      return novaLista;
    });
  }

  function deletaTudo() {
    localStorage.setItem("Lista", JSON.stringify([]));
    setLista([]);
  }

  function filtrarTarefas(e) {
    const textoBusca = e.target.value.toLowerCase();
    setBusca(textoBusca);
  }

  function buscarItens() {
    setBuscaVisivel(!buscaVisivel);
    if (!buscaVisivel) {
      setListaVisivel(lista);
      setBusca("");
      setErroPrioridade("");
    }
  }

  function listaSuspensa() {
    setMenuFiltroAberto((prev) => !prev);
    setBusca("");
    setErroPrioridade("");
  }

  function handleClick(filtro) {
    setFiltroSelecionado(filtro);
    setMenuFiltroAberto(false);
    setBusca("");
    setErroPrioridade("");
  }

  return (
    <div>
      <div className="menuTop">
          <>
            <ExportImport lista={lista} setLista={setLista} />
          </>
      </div>

      <h1>Lista de Tarefas</h1>
      <form onSubmit={adicionaItem} className="addItem">
        <button type="button" onClick={buscarItens} className="filter">
          <MdOutlineContentPasteSearch style={{color: 'white', fontSize: "20px"}} />
        </button>
        <input
          id="input-entrada"
          type="text"
          value={novoItem}
          onChange={(e) => {
            setNovoItem(e.target.value);
          }}
          placeholder="Adicione uma tarefa"
        />
        <button
          className="add"
          type="submit"
        >
          <MdAssignmentAdd style={{color: 'white', fontSize: "20px"}} />
        </button>
      </form>

      {buscaVisivel && (
        <form
          className="filtros"
          style={{ marginBottom: menuFiltroAberto ? "110px" : "20px" }}
        >
          {menuFiltroAberto && (
            <div>
              <ul className="filtroAberto">
                <li onClick={() => handleClick("Nome")}>➥ Nome</li>
                <li onClick={() => handleClick("Prioridade")}>➥ Prioridade</li>
                <li onClick={() => handleClick("Concluidas")}>➥ Concluídas</li>
                <li onClick={() => handleClick("Não Concluidas")}>
                  ➥ Não Concluídas
                </li>
              </ul>
            </div>
          )}
          <button type="button" onClick={listaSuspensa}>
            <img className="iconFiltro" src={IconeFiltro} />
          </button>
          <input
            type="text"
            value={busca}
            onChange={filtrarTarefas}
            placeholder={
              filtroSelecionado === "Nome"
                ? "Nome: Busque suas tarefas!"
                : filtroSelecionado === "Concluidas"
                ? "Concluídas: Busque tarefas concluídas!"
                : filtroSelecionado === "Não Concluidas"
                ? "Não Concluídas: Busque tarefas não concluídas!"
                : "Prioridade: Busque suas tarefas (Ex: 1, 2 ou 3)"
            }
          />
          {erroPrioridade && (
            <div className="erroMensagem">{erroPrioridade}</div>
          )}
        </form>
      )}

      <div className="listaTarefas">
        <div style={{ textAlign: "center" }}>
          {listaVisivel.length < 1 ? (
            <img className="icon" src={Icone} />
          ) : (
            listaVisivel.map((item) => (
              <div
                key={item.id}
                className={item.isCompleted ? "item completo" : "item"}
              >
                {editandoID === item.id ? (
                  <div className="inputEdit">
                    <input
                      type="text"
                      value={textoEditado}
                      onChange={(e) => setTextoEditado(e.target.value)}
                    />
                    <button className="editSave" onClick={() => salvarEdicao(item.id)}>
                      <VscSaveAs style={{color: 'white', fontSize: "20px"}} />
                    </button>
                    <button className="editCancel" onClick={() => setEditandoID(null)}>
                      <TbPencilCancel style={{color: 'white', fontSize: "20px"}} />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => definePrioridade(item.id, 1)}
                      className={
                        item.isPrioridade >= 1 ? "botao-selecionado" : ""
                      }
                    >
                      <img
                        className="estrela"
                        src={
                          item.isPrioridade >= 1
                            ? EstrelaMarcada
                            : EstrelaNaoMarcada
                        }
                      />
                    </button>
                    <button
                      onClick={() => definePrioridade(item.id, 2)}
                      className={
                        item.isPrioridade >= 2 ? "botao-selecionado" : ""
                      }
                    >
                      <img
                        className="estrela"
                        src={
                          item.isPrioridade >= 2
                            ? EstrelaMarcada
                            : EstrelaNaoMarcada
                        }
                      />
                    </button>
                    <button
                      onClick={() => definePrioridade(item.id, 3)}
                      className={
                        item.isPrioridade >= 3 ? "botao-selecionado" : ""
                      }
                    >
                      <img
                        className="estrela"
                        src={
                          item.isPrioridade >= 3
                            ? EstrelaMarcada
                            : EstrelaNaoMarcada
                        }
                      />
                    </button>
                    <span onClick={() => completar(item.id)}>{item.text}</span>
                    <button onClick={() => editar(item.id)} className="edit">
                      <AiFillEdit style={{color: 'white', fontSize: "20px"}} />
                    </button>
                    <button onClick={() => deleta(item.id)} className="del">
                      <AiFillDelete style={{color: 'white', fontSize: "20px"}} />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
        {lista.length > 0 && (
          <button onClick={() => deletaTudo()} className="deleteAll">
            Deletar todas
          </button>
        )}
      </div>
    </div>
  );
}

export default TodoList;
