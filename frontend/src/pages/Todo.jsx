import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/todos');
      setTodos(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await axiosInstance.post('/todos', { text });
      setText('');
      fetchTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add todo');
    }
  };

  const handleToggle = async (todo) => {
    try {
      await axiosInstance.put(`/todos/${todo._id}`, { completed: !todo.completed });
      fetchTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete todo');
    }
  };

  const done = todos.filter(t => t.completed).length;

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold mb-6">To-Do List</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm mb-1">Total</p>
            <p className="text-3xl font-bold">{todos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm mb-1">Done</p>
            <p className="text-3xl font-bold text-green-600">{done}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm mb-1">Remaining</p>
            <p className="text-3xl font-bold text-orange-500">{todos.length - done}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Todo */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </form>

      {/* Todo List */}
      {loading && <p>Loading todos...</p>}
      {!loading && todos.length === 0 && (
        <p className="text-gray-500 italic">No tasks yet. Add one above!</p>
      )}
      <div className="space-y-3">
        {todos.map(todo => (
          <Card key={todo._id} className={todo.completed ? 'border-green-200 bg-green-50' : ''}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className={todo.completed ? 'line-through text-gray-400' : ''}>
                  {todo.text}
                </span>
                {todo.completed && <Badge variant="success">Done</Badge>}
              </div>
              <Button variant="destructive" onClick={() => handleDelete(todo._id)}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Todo;
