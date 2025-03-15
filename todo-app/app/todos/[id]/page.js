"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function TodoDetailPage({ params }) {
  const router = useRouter();
  const [todo, setTodo] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        console.log("Fetching Todo with ID:", params.id);
        const res = await fetch(`/api/todos/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch todo");
        const data = await res.json();
        setTodo(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (params.id) fetchTodo();
  }, [params.id]);

  const handleUpdate = async (e) => {
    e.preventDefault(); // ❌ Prevents form from making a GET request

    console.log("Updating Todo with ID:", params.id);
    console.log("Data Sent:", {
      title: todo.title,
      description: todo.description,
    });

    try {
      const res = await fetch(`/api/todos/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
        }),
      });

      if (res.ok) {
        router.push(`/todos?id=${params.id}`);
      } else {
        alert("Failed to update todo");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating the todo.");
    }
  };

  return (
    <div style={{ flex: 1, padding: "20px" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Edit Todo</h2>
      <form
        onSubmit={handleUpdate} // ✅ Now properly handles update
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          name="title"
          value={todo.title}
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
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
          value={todo.description}
          onChange={(e) => setTodo({ ...todo, description: e.target.value })}
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
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Update
        </button>
      </form>
    </div>
  );
}
