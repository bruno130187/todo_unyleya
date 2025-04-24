import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListaTodos from "../componentes/ListaTodos";
import DetalheTodo from "../componentes/DetalheTodo";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListaTodos />} />
        <Route path="/detalhe/:id" element={<DetalheTodo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
