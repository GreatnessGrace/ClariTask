"use client";
import React from "react";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const fetchTodos = async (page = 1) => {
  const res = await axios.get(`http://localhost:5000/api/todos?page=${page}`);
  return res.data;
};

const fetchTodo = async (id) => {
  const res = await axios.get(`http://localhost:5000/api/todos/${id}`);
  return res.data;
};

export default function TodosPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const selectedTodoId = searchParams.get("id");

  const [todosData, setTodosData] = React.useState({
    todos: [],
    total: 0,
    limit: 10,
  });
  const [selectedTodo, setSelectedTodo] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  // Fetch Todos
  React.useEffect(() => {
    const loadTodos = async () => {
      const data = await fetchTodos(page);
      setTodosData(data);
    };
    loadTodos();
  }, [page]);

  // Fetch Selected Todo
  React.useEffect(() => {
    if (selectedTodoId) {
      const loadTodo = async () => {
        const data = await fetchTodo(selectedTodoId);
        setSelectedTodo(data);
      };
      loadTodo();
    }
  }, [selectedTodoId]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const description = formData.get("description");

    try {
      await axios.post("http://localhost:5000/api/todos", {
        title,
        description,
      });
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const { todos, total, limit } = todosData;

  return (
    <>
      <div style={{ width: "10%", margin: "5px 25px" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>📝 Todo</h1>
      </div>

      <div
        style={{
          display: "flex",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "300px",
            backgroundColor: "#f4f4f4",
            padding: "20px",
            borderRight: "1px solid #ddd",
          }}
        >
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "10px",
              backgroundColor: "black",
              color: "#fff",
              width: "100%",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            ➕ Add Todo
          </button>

          {/* List of Todos */}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {todos.map((todo) => (
              <li key={todo._id} style={{ marginBottom: "10px" }}>
                <Link
                  href={`/todos?page=${page}&id=${todo._id}`}
                  style={{
                    padding: "10px",
                    backgroundColor: "#fff",
                    borderRadius: "5px",
                    textDecoration: "none",
                    color: "#333",
                    border: "1px solid #ddd",
                    display: "block",
                  }}
                >
                  <strong>{todo.title}</strong>
                  <p style={{ margin: "5px 0 0", color: "#666" }}>
                    {todo.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Edit Todo Panel */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            margin: "5px",
            borderRadius: "5px",
          }}
        >
          {selectedTodo ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const title = formData.get("title");
                const description = formData.get("description");
                const id = selectedTodo._id;

                try {
                  await axios.put(`http://localhost:5000/api/todos/${id}`, {
                    title,
                    description,
                  });
                  window.location.reload();
                } catch (error) {
                  console.error("Error updating todo:", error);
                }
              }}
            >
              <input
                type="text"
                name="title"
                defaultValue={selectedTodo.title}
                required
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              />
              <textarea
                name="description"
                defaultValue={selectedTodo.description}
                required
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  minHeight: "100px",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px",
                  backgroundColor: "black",
                  color: "#fff",
                  width: "100px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
            </form>
          ) : (
            <p>Select a todo from the sidebar to edit.</p>
          )}
        </div>
      </div>

      {/* Modal for Adding Todo */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "5px",
              width: "400px",
            }}
          >
            <h2>Add New Todo</h2>
            <form onSubmit={handleAddTodo}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                required
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  width: "100%",
                }}
              />
              <textarea
                name="description"
                placeholder="Description"
                required
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  minHeight: "100px",
                  width: "100%",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px",
                  backgroundColor: "black",
                  color: "#fff",
                  width: "100%",
                  border: "none",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              >
                Add Todo
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px",
                  backgroundColor: "gray",
                  color: "#fff",
                  width: "100%",
                  border: "none",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
