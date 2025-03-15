export default function NewTodoPage() {
  return (
    <div style={{ flex: 1, padding: "20px" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Add New Todo</h2>
      <form
        action="/api/todos"
        method="POST"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
        <textarea
          name="description"
          placeholder="Description"
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
          Add Todo
        </button>
      </form>
    </div>
  );
}
