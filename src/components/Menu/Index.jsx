import { ExportButton } from "../ExportButton/Index";
import { ImportButton } from "../ImportButton/Index";
import "./styles.css"

export function MenuButtons() {
 

  return (
    <div className="exportAndImport">
      <ExportButton />
      <ImportButton />
    </div>
  );
}
