import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaArrowLeft, FaSave } from "react-icons/fa";
import { useTodos } from "../context/TodoContext";
import { useForm } from "react-hook-form";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

function DetalheTodo() {
  const { id } = useParams<{ id: string }>();
  const { todos, setTodos } = useTodos();
  const navegar = useNavigate();
  const modoCriacao = id === "novo";

  const [todo, setTodo] = useState<Todo | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ texto: string }>();

  useEffect(() => {
    if (!modoCriacao) {
      const encontrado = todos.find((t) => t.id === Number(id));

      if (encontrado) {
        setTodo(encontrado);
        setValue("texto", encontrado.todo);
      } else {
        setTodo(null);
        setValue("texto", "");
      }
    }
  }, [id, modoCriacao, todos, setValue]);

  const salvarNovo = (dados: { texto: string }) => {
    const maiorId = todos.reduce(
      (max, todo) => (todo.id > max ? todo.id : max),
      0
    );
    const novoId = maiorId + 1;
    const userIdAleatorio = Math.floor(Math.random() * 200) + 1;

    const novoTodo = {
      id: novoId,
      todo: dados.texto,
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

  const atualizar = (dados: { texto: string }) => {
    fetch(`https://dummyjson.com/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: dados.texto }),
    })
      .then((res) => res.json())
      .then((dadosAtualizados) => {
        setTodo(dadosAtualizados);
        const atualizados = todos.map((t) =>
          t.id === dadosAtualizados.id ? dadosAtualizados : t
        );
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

      <form onSubmit={handleSubmit(modoCriacao ? salvarNovo : atualizar)}>
        <textarea
          {...register("texto", { required: "O campo texto é obrigatório." })}
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

        {errors.texto && (
          <p style={{ color: "red", marginTop: "4px" }}>
            {errors.texto.message}
          </p>
        )}

        <br />
        <br />

        <div className="botoes">
          {modoCriacao ? (
            <button type="submit" title="Salvar">
              <FaSave size={18} /> Salvar
            </button>
          ) : (
            <>
              <button type="submit" title="Atualizar">
                <FaEdit size={18} /> Atualizar
              </button>

              <button type="button" onClick={excluir} title="Excluir">
                <FaTrash size={18} /> Excluir
              </button>
            </>
          )}
          <button type="button" onClick={voltar} title="Voltar para a lista">
            <FaArrowLeft size={18} /> Voltar
          </button>
        </div>
      </form>
    </div>
  );
}

export default DetalheTodo;
