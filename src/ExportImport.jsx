import React, { useEffect, useRef } from "react";
import ExcelJS from "exceljs";

function ExportImport({ lista, setLista }) {
  const InputRef = useRef();
  useEffect(() => {
    console.log(InputRef);
    if (InputRef) {
      InputRef.current.addEventListener("change", importarLista);
    }
    return () => {
      if (InputRef) {
        // InputRef.current.removeEventListener("change", importarLista);
      }
    };
  }, [InputRef]);
  const exportarLista = async () => {
    if (!lista || lista.length === 0) {
      alert("A lista está vazia. Adicione tarefas antes de exportar.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tarefas");

    worksheet.columns = [
      { header: "Tarefa", key: "text" },
      { header: "Concluída", key: "isCompleted" },
      { header: "Nível de Prioridade", key: "isPrioridade" },
    ];

    lista.forEach((item) => {
      worksheet.addRow({
        text: item.text || "Texto ausente",
        isCompleted: !!item.isCompleted || false,
        isPrioridade: Number(item.isPrioridade) || 0,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "lista_tarefas.xlsx";
    link.click();
  };

  const importarLista = (evento) => {
    console.log(evento);
    if (evento.target.files.length) {
      const arquivo = evento.target.files[0];

      if (arquivo) {
        const reader = new FileReader();
        reader.onload = async () => {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(reader.result);
          const worksheet = workbook.getWorksheet(1);
          const novosItens = [];

          worksheet.eachRow((row, numeroLinha) => {
            if (numeroLinha > 1) {
              const novoItem = {
                text: row.getCell(1).value,
                isCompleted:
                  row.getCell(2).value === "Sim" ||
                  row.getCell(2).value === true,
                isPrioridade: Number(row.getCell(3).value) || 0,
              };
              novosItens.push(novoItem);
            }
          });

          setLista((state) => {
            let id = state.length > 0 ? state[state.length - 1].id + 1 : 1
            const novaLista = [
              ...state,
              ...novosItens.map((item, index) => ({...item, id: id + index}))
            ];
            localStorage.setItem("Lista", JSON.stringify(novaLista));
            return novaLista;
          })
        };
        reader.readAsArrayBuffer(arquivo);
      }
    }
  };

  return (
    <div className="menuOpcoesAberto">
      <button onClick={exportarLista} style={{ marginRight: "10px" }}>
        Exportar
      </button>
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => console.log(e)}
        ref={InputRef}
        onSubmit={(e) => console.log(e)}
        style={{ display: "inline-block", cursor: "pointer" }}
        className="uploadFile"
      />
    </div>
  );
}

export default ExportImport;
