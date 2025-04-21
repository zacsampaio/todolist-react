import { ExportButton } from "../ExportButton/Index";
import { FlowControlButton } from "../FlowControlButton/Index";
import { ImportButton } from "../ImportButton/Index";
import "./styles.css";

export function Menu() {
  return (
    <div className="menuTop">
      <FlowControlButton />
      <div className="exportAndImport">
        <ExportButton />
        <ImportButton />
      </div>
    </div>
  );
}
