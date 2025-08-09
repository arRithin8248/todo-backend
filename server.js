// index.js (or server.js)
import cors from "cors";
import dotenv from "dotenv";
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
// In server.js BEFORE routes
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));



// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ DB connection error:', err);
});

// Schema
const todolistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String
});

// Model
const todolistModel = mongoose.model('ToDo', todolistSchema);

// Create a new todo item
app.post('/todos', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new todolistModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all items
app.get('/todos', async (req, res) => {
  try {
    const todos = await todolistModel.find();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Update todo
app.put('/todos/:id', async (req, res) => {
  const { title, description } = req.body;
  try {
    const updatedToDo = await todolistModel.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!updatedToDo) {
      return res.status(404).json({ message: 'ToDo not found' });
    }
    res.json(updatedToDo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete todo
app.delete('/todos/:id', async (req, res) => {
  try {
    await todolistModel.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
