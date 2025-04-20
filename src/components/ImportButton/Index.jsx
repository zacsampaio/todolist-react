import { AiOutlineImport } from "react-icons/ai";
import useList from "../../store/useList";
import { useEffect, useRef } from "react";
import ExcelJS from "exceljs";
import "./styles.css"

export function ImportButton() {
  const {addItem} = useList()
  const InputRef = useRef();

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


  const importList = (evento) => {
    if (evento.target.files.length) {
      const arquivo = evento.target.files[0];

      if (arquivo) {
        const reader = new FileReader();
        reader.onload = async () => {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(reader.result);
          const worksheet = workbook.getWorksheet(1);

          worksheet.eachRow((row, numeroLinha) => {
            if (numeroLinha > 1) {
              addItem(
                row.getCell(1).value || "Tarefa sem título",
                row.getCell(2).value === "Sim" || row.getCell(2).value === true,
                Number(row.getCell(3).value) || 0);
            }
          });
        };
        reader.readAsArrayBuffer(arquivo);
      }
    }
  };

  return (
    <div className="inputFileImport">
      <label htmlFor="fileImport" style={{ cursor: "pointer" }}>
        <AiOutlineImport /> Importar
      </label>
      <input
        id="fileImport"
        type="file"
        accept=".xlsx"
        ref={InputRef}
        style={{
          cursor: "pointer",
          inset: "0",
          opacity: "0",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        className="uploadFile"
      />
    </div>
  );
}
