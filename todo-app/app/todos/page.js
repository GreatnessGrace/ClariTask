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
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              // display: "flex",
              // alihnItems: "center",
              // justifyContent: "center",
            }}
          >
            <Link
              href="/todos/new"
              style={{
                padding: "10px",
                backgroundColor: "black",
                color: "#fff",
                width: "50%",
                textAlign: "center",
                borderRadius: "5px",
                textDecoration: "none",
                marginBottom: "20px",
              }}
            >
              ➕ Add Todo
            </Link>
            <span>icon</span>
          </div>

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

          {/* Pagination */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
              <Link
                key={i + 1}
                href={`/todos?page=${i + 1}`}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#0070f3",
                  color: "#fff",
                  borderRadius: "5px",
                  textDecoration: "none",
                }}
              >
                {i + 1}
              </Link>
            ))}
          </div>
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
            <>
              <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>
                ✏️ Edit Todo
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const title = formData.get("title");
                  const description = formData.get("description");
                  const id = selectedTodo._id;

                  try {
                    const response = await fetch(
                      `http://localhost:5000/api/todos/${id}`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title, description }),
                      }
                    );

                    if (response.ok) {
                      window.location.href = `/todos?id=${id}`;
                    } else {
                      alert("Failed to update todo");
                    }
                  } catch (error) {
                    console.error("Error:", error);
                    alert("An error occurred while updating the todo");
                  }
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedTodo.title}
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                  required
                />
                <textarea
                  name="description"
                  defaultValue={selectedTodo.description}
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    minHeight: "100px",
                  }}
                  required
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
            </>
          ) : (
            <div style={{ margin: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1
                  style={{
                    font: "bold",
                    fontSize: "45px",
                    marginBottom: "5px",
                  }}
                >
                  {" "}
                  New Additions
                </h1>
                icon
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                icon1, icon2, icon3, icon4, icon5
              </div>
              <hr
                style={{ font: "45px", color: "gray", marginTop: "5px" }}
              ></hr>
              <p style={{ marginTop: "15px" }}>
                Select a todo from the sidebar to edit.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
