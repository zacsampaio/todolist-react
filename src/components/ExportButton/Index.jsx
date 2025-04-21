import { AiOutlineExport } from "react-icons/ai";
import useList from "../../store/useList";
import { useFluxos } from "../../store/useFluxos";
import ExcelJS from "exceljs";
import { useLocation } from "react-router-dom";

export function ExportButton() {
  const { listCopy } = useList();
  const fluxos = useFluxos((state) => state.fluxos);
  const location = useLocation();
  const isFluxosPage = location.pathname === "/fluxos";

  const exportList = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(isFluxosPage ? "Fluxos" : "Tarefas");

    if (isFluxosPage) {
      if (fluxos.length === 0) {
        alert("A lista de fluxos está vazia. Adicione fluxos antes de exportar.");
        return;
      }

      // Encontrar o número máximo de atividades em um fluxo
      const maxAtividades = Math.max(...fluxos.map(fluxo => fluxo.atividades.length));

      // Criar cabeçalhos dinâmicos baseados no número máximo de atividades
      const headers = ["Fluxo"];
      for (let i = 1; i <= maxAtividades; i++) {
        headers.push(`Atividade ${i}`);
      }

      worksheet.columns = headers.map(header => ({ header, key: header }));

      // Adicionar dados dos fluxos
      fluxos.forEach(fluxo => {
        const rowData = {
          "Fluxo": fluxo.nome
        };

        // Adicionar atividades do fluxo
        fluxo.atividades.forEach((atividade, index) => {
          rowData[`Atividade ${index + 1}`] = atividade.text;
        });

        worksheet.addRow(rowData);
      });
    } else {
      if (listCopy.length === 0) {
        alert("A lista está vazia. Adicione tarefas antes de exportar.");
        return;
      }

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
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = isFluxosPage ? "lista_fluxos.xlsx" : "lista_tarefas.xlsx";
    link.click();
  };

  return (
    <button onClick={exportList} className="button">
      <AiOutlineExport /> Exportar
    </button>
  );
}