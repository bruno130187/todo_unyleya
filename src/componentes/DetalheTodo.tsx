import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaArrowLeft, FaSave } from "react-icons/fa";
import { useTodos } from "../context/TodoContext";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

function DetalheTodo() {
  const { id } = useParams<{ id: string }>();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [texto, setTexto] = useState("");
  const { todos, setTodos } = useTodos();
  const navegar = useNavigate();
  const modoCriacao = id === "novo";

  //na tela DetalheTodo.tsx Falta buscar o TODO da lista do context e não do endpoint e vai dar erro ao tentar buscar do endpoint e teremos que esconder esse erro

  useEffect(() => {
    if (!modoCriacao) {
      const encontrado = todos.find((t) => t.id === Number(id));

      if (encontrado) {
        setTodo(encontrado);
        setTexto(encontrado.todo);
      } else {
        setTodo(null);
        setTexto("");
      }
    }
  }, [id, modoCriacao, todos]);

  const salvarNovo = () => {
    const maiorId = todos.reduce(
      (max, todo) => (todo.id > max ? todo.id : max),
      0
    );
    const novoId = maiorId + 1;
    const userIdAleatorio = Math.floor(Math.random() * 200) + 1;

    const novoTodo = {
      id: novoId,
      todo: texto,
      completed: false,
      userId: userIdAleatorio,
    };

    fetch(`https://dummyjson.com/todos/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoTodo),
    }).then(() => {
      setTodos([novoTodo, ...todos]);
      navegar("/", { state: { mensagem: "Novo TODO adicionado!" } });
    });
  };

  const atualizar = () => {
    fetch(`https://dummyjson.com/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: texto }),
    })
      .then((res) => res.json())
      .then((dados) => {
        setTodo(dados);
        const atualizados = todos.map((t) => (t.id === dados.id ? dados : t));
        setTodos(atualizados);
        navegar("/", { state: { mensagem: "TODO atualizado com sucesso!" } });
      });
  };

  const excluir = () => {
    fetch(`https://dummyjson.com/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      const novaLista = todos.filter((t) => t.id !== Number(id));
      setTodos(novaLista);
      navegar("/", { state: { mensagem: "TODO excluído com sucesso!" } });
    });
  };

  const voltar = () => {
    navegar("/");
  };

  return (
    <div className="container">

      {!modoCriacao && !todo && (
        <p style={{ color: "red" }}>TODO não encontrado.</p>
      )}

      <h1>{modoCriacao ? "Novo TODO" : "Detalhe do TODO"}</h1>

      {!modoCriacao && todo && (
        <>
          <p>
            <strong>ID:</strong> {todo.id}
          </p>
          <p>
            <strong>Usuário:</strong> {todo.userId}
          </p>
          <p>
            <strong>Status:</strong> {todo.completed ? "Concluído" : "Pendente"}
          </p>
        </>
      )}

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={4}
        style={{
          width: "30%",
          backgroundColor: "#000",
          color: "#00bfff",
          border: "1px solid #00bfff",
          padding: "8px",
          borderRadius: "4px",
        }}
      />

      <br />
      <br />

      <div className="botoes">
        {modoCriacao ? (
          <button onClick={salvarNovo} title="Salvar">
            <FaSave size={18} /> Salvar
          </button>
        ) : (
          <>
            <button onClick={atualizar} title="Atualizar">
              <FaEdit size={18} /> Atualizar
            </button>

            <button onClick={excluir} title="Excluir">
              <FaTrash size={18} /> Excluir
            </button>
          </>
        )}

        <button onClick={voltar} title="Voltar para a lista">
          <FaArrowLeft size={18} /> Voltar
        </button>
      </div>
    </div>
  );
}

export default DetalheTodo;
