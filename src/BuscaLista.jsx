import React, {useState} from "react";

function BuscaLista({lista}){
  const [busca, setBusca] = useState("");

  const itensFiltrados = busca 
    ? lista.filter((item) =>
        item.text.toLowerCase().includes(busca.toLowerCase())
      )
    : [];

  return (
    <div style={{width: '550px', margin: "10px auto"}}>
      <input
        placeholder="O que deseja procurar?"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}/>
       <ul>
        {itensFiltrados.length === 0 ? (
          <li></li>
        ) : (
          itensFiltrados.map((item, index) => (
            <li key={index}>{item.text}</li> 
          ))
        )}
      </ul>
    </div>
  )
};

export default BuscaLista;