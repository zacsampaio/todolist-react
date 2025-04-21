import { AiOutlineControl } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";

export function FlowControlButton() {
  const navigate = useNavigate();

  const location = useLocation();
  const isFluxosPage = location.pathname === "/fluxos";

  const handleClick = () => {
    if (isFluxosPage) {
      navigate("/");
    } else {
      navigate("/fluxos");
    }
  };

  return (
    <button onClick={handleClick} className="button">
      {isFluxosPage ? (
        <>
          <AiOutlineControl /> Atividades
        </>
      ) : (
        <>
          <AiOutlineControl /> Fluxos
        </>
      )}
    </button>
  );
} 