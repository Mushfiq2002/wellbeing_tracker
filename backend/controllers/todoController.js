const Todo = require('../models/Todo');

// @desc    Get all todos for logged in user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.status(200).json(todos);
};

// @desc    Create a todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Please add a text field');
  }

  const todo = await Todo.create({
    user: req.user.id,
    text: req.body.text,
  });

  res.status(201).json(todo);
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(400);
    throw new Error('Todo not found');
  }

  // Check for user
  if (todo.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedTodo);
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(400);
    throw new Error('Todo not found');
  }

  // Check for user
  if (todo.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await todo.deleteOne();

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
