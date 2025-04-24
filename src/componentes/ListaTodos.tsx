import { useNavigate, useLocation } from "react-router-dom";
import { useTodos } from "../context/TodoContext";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

function ListaTodos() {
  const { todos, carregando } = useTodos();
  const navegar = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.mensagem) {
      toast.success(location.state.mensagem);
      navegar(".", { replace: true, state: {} });
    }
  }, [location.state, navegar]);

  return (
    <div className="container">
      <ToastContainer />
      <div className="cabecalho">
        <h1>Lista de TODOs</h1>
        <button 
          onClick={() => navegar("/detalhe/novo")} 
          title="Adiciona novo TODO">
          <FaPlus size={22} />
        </button>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        todos.map((todo) => (
          <div
            key={todo.id}
            className="lista-item"
            onClick={() => navegar(`/detalhe/${todo.id}`)}
          >
            {todo.todo}
          </div>
        ))
      )}
    </div>
  );
}

export default ListaTodos;
