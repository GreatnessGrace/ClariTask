const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Test = require("mocha/lib/test");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
});

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/todoapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Todo Schema
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: { type: Date, default: Date.now },
});
const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.post("/api/todos", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({ title, description });
    await newTodo.save();
    console.log("newTodo", newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

app.get("/api/todos", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const todos = await Todo.find().skip(skip).limit(limit).sort({ date: -1 });
  const total = await Todo.countDocuments();

  res.json({ todos, total, page, limit });
});

app.put("/api/todos/:id", async (req, res) => {
  console.log("here", req.params);

  const { id } = req.params;
  const { title, description } = req.body;

  console.log("Update Request ID:", id);
  console.log("Data Received:", title, description);

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

app.get("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  res.json(todo);
});

// Start server
app.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000`);
});
