import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home/Index";
import { Fluxos } from "./pages/fluxos/Index";
import "./assets/styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fluxos" element={<Fluxos />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
