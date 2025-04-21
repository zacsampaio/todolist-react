import { AiOutlineImport } from "react-icons/ai";
import useList from "../../store/useList";
import { useFluxos } from "../../store/useFluxos";
import { useEffect, useRef } from "react";
import ExcelJS from "exceljs";
import { useLocation } from "react-router-dom";
import "./styles.css"

export function ImportButton() {
  const {addItem} = useList()
  const {addFluxo, addAtividade, fluxos} = useFluxos()
  const InputRef = useRef();
  const location = useLocation()
  const isFluxosPage = location.pathname === "/fluxos"

  useEffect(() => {
    if (InputRef.current) {
      InputRef.current.addEventListener("change", importList);
    }
    return () => {
      if (InputRef.current) {
        InputRef.current.removeEventListener("change", importList);
      }
    };
  }, []);

  const importList = async (evento) => {
    if (evento.target.files.length) {
      const arquivo = evento.target.files[0];

      if (arquivo) {
        const reader = new FileReader();
        reader.onload = async () => {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(reader.result);
          const worksheet = workbook.getWorksheet(1);

          if (isFluxosPage) {
            // Importação de fluxos
            const headers = worksheet.getRow(1).values;
            if (!headers || headers.length < 2 || headers[1] !== "Fluxo") {
              alert("Formato de arquivo inválido para importação de fluxos. A primeira coluna deve ser 'Fluxo'.");
              return;
            }

            // Encontrar o maior ID existente
            const maiorIdFluxo = fluxos.reduce((maior, fluxo) => Math.max(maior, fluxo.id), 0);
            let proximoIdFluxo = maiorIdFluxo + 1;

            // Processar cada linha do arquivo
            worksheet.eachRow((row, rowNumber) => {
              if (rowNumber > 1) { // Pular o cabeçalho
                const values = row.values;
                if (values && values.length > 1) {
                  const fluxoNome = values[1]; // A primeira coluna é o nome do fluxo
                  if (fluxoNome) {
                    // Criar o fluxo com ID único
                    const novoFluxo = {
                      id: proximoIdFluxo++,
                      nome: fluxoNome,
                      atividades: []
                    };

                    // Adicionar o fluxo
                    addFluxo(fluxoNome);

                    // Adicionar as atividades do fluxo (começando da coluna 2)
                    for (let i = 2; i < values.length; i++) {
                      const atividadeText = values[i];
                      if (atividadeText && atividadeText.trim() !== "") {
                        // Adicionar a atividade ao fluxo
                        addAtividade(novoFluxo.id, {
                          text: atividadeText.trim(),
                          isCompleted: false
                        });
                      }
                    }
                  }
                }
              }
            });
          } else {
            // Importação de tarefas (comportamento original)
            worksheet.eachRow((row, rowNumber) => {
              if (rowNumber > 1) {
                const values = row.values;
                if (values && values.length >= 3) {
                  addItem(
                    values[1] || "Tarefa sem título",
                    values[2] === "Sim" || values[2] === true,
                    Number(values[3]) || 0
                  );
                }
              }
            });
          }
        };
        reader.readAsArrayBuffer(arquivo);
      }
    }
  };

  return (
    <div className="inputFileImport">
      <label htmlFor="fileImport" className="cursor-pointer">
        <AiOutlineImport /> Importar
      </label>
      <input
        id="fileImport"
        type="file"
        accept=".xlsx"
        ref={InputRef}
        className="uploadFile"
      />
    </div>
  );
}
