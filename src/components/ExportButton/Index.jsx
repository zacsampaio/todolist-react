import { AiOutlineExport } from "react-icons/ai";
import useList from "../../store/useList";
import ExcelJS from "exceljs";


export function ExportButton(){
    const {listCopy} = useList()


    const exportList = async () => {
        if (listCopy.length === 0) {
          alert("A lista está vazia. Adicione tarefas antes de exportar.");
          return;
        }
    
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tarefas");
    
        worksheet.columns = [
          { header: "Tarefa", key: "text" },
          { header: "Concluída", key: "isCompleted" },
          { header: "Nível de Prioridade", key: "isPriority" },
        ];
    
        listCopy.forEach((item) => {
          worksheet.addRow({
            text: item.text || "Texto ausente",
            isCompleted: item.isCompleted ? "Sim" : "Não",
            isPriority: Number(item.isPriority) || 0,
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

    return (<button onClick={exportList}><AiOutlineExport /> Exportar</button>)
}