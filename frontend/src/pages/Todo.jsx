import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Trash2, CheckCircle, Circle } from 'lucide-react';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/todos');
      setTodos(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch to-dos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      await axiosInstance.post('/todos', { text: newTodo });
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to-do');
    }
  };

  const handleToggleTodo = async (id, currentStatus) => {
    try {
      await axiosInstance.put(`/todos/${id}`, { completed: !currentStatus });
      fetchTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update to-do');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete to-do');
    }
  };

  const totalCount = todos.length;
  const doneCount = todos.filter(t => t.completed).length;
  const remainCount = totalCount - doneCount;

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-8">
      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">To-Do List</h1>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleAddTodo} className="flex gap-3 mb-8">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 text-lg py-6 shadow-sm"
            />
            <Button type="submit" className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-lg font-medium shadow-md">
              Add
            </Button>
          </form>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center border shadow-sm">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-800">{totalCount}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100 shadow-sm">
              <p className="text-green-600 text-sm font-medium uppercase tracking-wider mb-1">Done</p>
              <p className="text-3xl font-bold text-green-700">{doneCount}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100 shadow-sm">
              <p className="text-orange-600 text-sm font-medium uppercase tracking-wider mb-1">Remaining</p>
              <p className="text-3xl font-bold text-orange-700">{remainCount}</p>
            </div>
          </div>

          <div className="space-y-3">
            {loading && <p className="text-center text-gray-500 py-4 animate-pulse">Loading tasks...</p>}
            
            {!loading && todos.length === 0 ? (
              <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No tasks yet. Add one above to get started!</p>
              </div>
            ) : (
              todos.map(todo => (
                <div 
                  key={todo._id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}
                >
                  <div 
                    className="flex items-center gap-4 flex-1 cursor-pointer group" 
                    onClick={() => handleToggleTodo(todo._id, todo.completed)}
                  >
                    {todo.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                    )}
                    <span className={`text-lg transition-all ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {todo.text}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4 focus:outline-none focus:ring-2 focus:ring-red-200"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Todo;
