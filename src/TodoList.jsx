import React, { useState, useEffect } from "react";
import "./TodoList.css";
import Icone from "./assets/icon.png";
import IconeFiltro from "./assets/filtro.png";

function TodoList() {
  const [lista, setLista] = useState([]);
  const [listaVisivel, setListaVisivel] = useState([]);
  const [novoItem, setNovoItem] = useState("");
  const [busca, setBusca] = useState("");
  const [visivel, setVisivel] = useState(false);

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
    setListaVisivel(
      lista.filter((item) =>
        item.text.toLowerCase().includes(busca.toLowerCase())
      )
    );
  }, [lista, busca]);

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
        },
      ];
      localStorage.setItem("Lista", JSON.stringify(novaLista));
      return novaLista;
    });
    setNovoItem("");
    document.getElementById("input-entrada").focus();
  }

  function clicou(id) {
    const novaLista = lista.map((item) => {
      if (item.id === id) {
        item.isCompleted = !item.isCompleted;
      }
      return item;
    });
    localStorage.setItem("Lista", JSON.stringify(novaLista));

    setLista(novaLista);
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

  function toggleFiltro() {
    setVisivel(!visivel);
    if (!visivel) {
      setListaVisivel(lista);
      setBusca("");
    }
  }

  return (
    <div>
      <h1>Lista de Tarefas</h1>

      <form onSubmit={adicionaItem}>
        <button type="button" onClick={toggleFiltro} className="filter">
          <img className="iconFiltro" src={IconeFiltro} />
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
        <button className="add" type="submit" style={{fontWeight: '300', fontSize: '25px'}}>
          +
        </button>
      </form>

      {visivel && (
        <input
          type="text"
          value={busca}
          onChange={filtrarTarefas}
          placeholder="Filtre suas tarefas"
          style={{ width: "550px", margin: "10px auto" }}
        />
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
                <span
                  onClick={() => {
                    clicou(item.id);
                  }}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => {
                    deleta(item.id);
                  }}
                  className="del"
                >
                  Deletar
                </button>
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
