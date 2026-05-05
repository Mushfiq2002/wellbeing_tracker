import React, { useState } from 'react';
import { Target, CheckCircle2, Plus, Trophy } from 'lucide-react';

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(1);
  const [points, setPoints] = useState(0);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim() || newGoalTarget < 1) return;

    setGoals([...goals, {
      id: Date.now(),
      text: newGoalText,
      current: 0,
      target: parseInt(newGoalTarget),
      completed: false
    }]);
    setNewGoalText('');
    setNewGoalTarget(1);
  };

  const handleIncreaseProgress = (id) => {
    setGoals(goals.map(goal => {
      if (goal.id === id && !goal.completed) {
        const newCurrent = goal.current + 1;
        const isCompleted = newCurrent >= goal.target;

        if (isCompleted) {
          setPoints(prev => prev + 10);
        }

        return {
          ...goal,
          current: newCurrent,
          completed: isCompleted
        };
      }
      return goal;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header & Points */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="text-blue-500" /> Goal Tracker
          </h1>
          <p className="text-gray-500 mt-1">Set targets, track progress, and earn points!</p>
        </div>
        <div className="bg-yellow-50 px-6 py-3 rounded-xl border border-yellow-200 flex items-center gap-3">
          <Trophy className="text-yellow-500 w-8 h-8" />
          <div>
            <p className="text-sm text-yellow-700 font-medium uppercase tracking-wider">Total Points</p>
            <p className="text-3xl font-bold text-yellow-600">{points}</p>
          </div>
        </div>
      </div>

      {/* Add Goal Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add a New Goal</h2>
        <form onSubmit={handleAddGoal} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Description</label>
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="e.g. Read chapters, Drink water"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
              required
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
            <input
              type="number"
              min="1"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Goal
          </button>
        </form>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Your Goals</h2>
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-white rounded-2xl border border-dashed border-gray-300">
            No goals yet. Start by adding one above!
          </p>
        ) : (
          <div className="grid gap-4">
            {goals.map(goal => (
              <div
                key={goal.id}
                className={`p-5 rounded-2xl border ${goal.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-100 shadow-sm'
                  } flex items-center justify-between transition-all`}
              >
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${goal.completed ? 'text-green-800' : 'text-gray-900'}`}>
                    {goal.text}
                  </h3>

                  {/* Progress Bar */}
                  <div className="mt-3 max-w-md">
                    <div className="flex justify-between text-sm mb-1">
                      <span className={goal.completed ? 'text-green-700' : 'text-gray-600'}>
                        Progress: {goal.current} / {goal.target}
                      </span>
                      <span className={goal.completed ? 'text-green-700 font-medium' : 'text-gray-600'}>
                        {Math.round((goal.current / goal.target) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${goal.completed ? 'bg-green-500' : 'bg-blue-600'
                          }`}
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex-shrink-0">
                  {goal.completed ? (
                    <div className="flex flex-col items-center text-green-600 animate-in zoom-in duration-300">
                      <CheckCircle2 className="w-8 h-8 mb-1" />
                      <span className="text-sm font-bold">Completed!</span>
                      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full mt-1">+10 Points</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleIncreaseProgress(goal.id)}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors border border-blue-200 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Progress
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;
