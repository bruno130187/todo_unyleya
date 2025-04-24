import { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface ContextoTodos {
  todos: Todo[];
  setTodos: (novosTodos: Todo[]) => void;
  carregando: boolean;
}

const TodosContext = createContext<ContextoTodos | undefined>(undefined);

export function TodosProvider({ children }: { children: ReactNode }) {
  
  const [todos, setTodosState] = useState<Todo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const armazenados = localStorage.getItem("todos");
    if (armazenados) {

      const dados = JSON.parse(armazenados);
      setTodosState(dados);
      setCarregando(false);

    } else {

      fetch("https://dummyjson.com/todos")
        .then(res => res.json())
        .then(dados => {
          setTodosState(dados.todos);
          setCarregando(false);
          localStorage.setItem("todos", JSON.stringify(dados.todos));
        });

    }
  }, []);

  const setTodos = (novosTodos: Todo[]) => {
    setTodosState(novosTodos);
    localStorage.setItem("todos", JSON.stringify(novosTodos));
  };

  return (
    <TodosContext.Provider value={{ todos, setTodos, carregando }}>
      {children}
    </TodosContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTodos() {
  const contexto = useContext(TodosContext);
  if (!contexto) throw new Error("useTodos deve ser usado dentro de <TodosProvider>");
  return contexto;
}
