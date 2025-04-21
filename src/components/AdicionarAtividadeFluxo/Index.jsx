import { useState } from "react";
import PropTypes from "prop-types";
import { useFluxos } from "../../store/useFluxos";
import "./styles.css";

export function AdicionarAtividadeFluxo({ fluxoId }) {
  const [text, setText] = useState("");
  const addAtividade = useFluxos((state) => state.addAtividade);

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim() === "") return;

    addAtividade(fluxoId, {
      text,
    });
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="formAtividadeFluxo">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Adicionar nova atividade ao fluxo..."
        className="inputAtividadeFluxo"
      />
      <button type="submit" className="buttonAtividadeFluxo">
        +
      </button>
    </form>
  );
}

AdicionarAtividadeFluxo.propTypes = {
  fluxoId: PropTypes.number.isRequired,
}; 