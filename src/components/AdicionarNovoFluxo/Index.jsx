import { useState } from "react";
import { useFluxos } from "../../store/useFluxos";
import "./styles.css";

export function AdicionarNovoFluxo() {
  const [text, setText] = useState("");
  const addFluxo = useFluxos((state) => state.addFluxo);

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim() === "") return;

    addFluxo(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="formFluxo">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Adicionar novo fluxo..."
        className="inputFluxo"
      />
      <button type="submit" className="buttonFluxo">
        +
      </button>
    </form>
  );
} 