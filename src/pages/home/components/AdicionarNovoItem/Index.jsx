import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import useList from "../../../../store/useList";
import "./styles.css";

export function AdicionarNovoItem() {
  const { addItem } = useList();
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim() !== "") {
      addItem(text, false, 0);
      setText("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="addItemContainer">
      <input
        id="input-addItem"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Adicione uma nova tarefa..."
      />
      <button type="submit" className="add">
        <AiOutlinePlus style={{ color: "white", fontSize: "20px" }} />
      </button>
    </form>
  );
}
