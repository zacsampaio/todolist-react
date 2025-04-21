import { Menu } from "../../components/Menu/Index";
import { AdicionarNovoFluxo } from "../../components/AdicionarNovoFluxo/Index";
import { ListaFluxos } from "../../components/ListaFluxos/Index";
import "./styles.css";

export function Fluxos() {
  return (
    <div>
      <div className="header">
        <Menu />
        <h1>LISTA DE FLUXOS</h1>
      </div>
      <div className="fluxos-container">
        <AdicionarNovoFluxo />
        <ListaFluxos />
      </div>
    </div>
  );
}
