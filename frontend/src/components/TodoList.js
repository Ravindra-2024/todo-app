import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Plus,
    Search,
    Filter,
    SortAsc,
    SortDesc,
    CheckCircle,
    Circle,
    Edit,
    Trash2,
    Calendar,
    Flag
} from 'lucide-react';
import { format } from 'date-fns';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        completed: 'all',
        priority: 'all',
    });
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
    });

    useEffect(() => {
        fetchTodos();
        fetchStats();
    }, [filters, sortBy, sortOrder]);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (filters.completed !== 'all') {
                params.append('completed', filters.completed);
            }
            if (filters.priority !== 'all') {
                params.append('priority', filters.priority);
            }
            params.append('sortBy', sortBy);
            params.append('sortOrder', sortOrder);

            const response = await axios.get(`/api/todos?${params}`);
            let filteredTodos = response.data.data;

            // Apply search filter
            if (filters.search) {
                filteredTodos = filteredTodos.filter(todo =>
                    todo.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                    todo.description?.toLowerCase().includes(filters.search.toLowerCase())
                );
            }

            setTodos(filteredTodos);
        } catch (error) {
            console.error('Error fetching todos:', error);
            toast.error('Failed to fetch todos');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/todos/stats/summary');
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleCreateTodo = async (todoData) => {
        try {
            const response = await axios.post('/api/todos', todoData);
            setTodos(prev => [response.data.data, ...prev]);
            setShowForm(false);
            fetchStats();
            toast.success('Todo created successfully!');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create todo';
            toast.error(message);
        }
    };

    const handleUpdateTodo = async (id, todoData) => {
        try {
            const response = await axios.put(`/api/todos/${id}`, todoData);
            setTodos(prev => prev.map(todo =>
                todo._id === id ? response.data.data : todo
            ));
            setEditingTodo(null);
            fetchStats();
            toast.success('Todo updated successfully!');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update todo';
            toast.error(message);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await axios.delete(`/api/todos/${id}`);
            setTodos(prev => prev.filter(todo => todo._id !== id));
            fetchStats();
            toast.success('Todo deleted successfully!');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete todo';
            toast.error(message);
        }
    };

    const handleToggleTodo = async (id) => {
        try {
            const response = await axios.patch(`/api/todos/${id}/toggle`);
            setTodos(prev => prev.map(todo =>
                todo._id === id ? response.data.data : todo
            ));
            fetchStats();
            toast.success(response.data.message);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to toggle todo';
            toast.error(message);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-danger-600';
            case 'medium': return 'text-warning-600';
            case 'low': return 'text-success-600';
            default: return 'text-gray-600';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high': return <Flag className="h-4 w-4 text-danger-600" />;
            case 'medium': return <Flag className="h-4 w-4 text-warning-600" />;
            case 'low': return <Flag className="h-4 w-4 text-success-600" />;
            default: return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
                    <p className="text-gray-600 mt-1">Manage your tasks efficiently</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center mt-4 sm:mt-0"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Todo
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="card text-center">
                    <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="card text-center">
                    <div className="text-2xl font-bold text-success-600">{stats.completed}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="card text-center">
                    <div className="text-2xl font-bold text-warning-600">{stats.pending}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="card text-center">
                    <div className="text-2xl font-bold text-danger-600">{stats.highPriority}</div>
                    <div className="text-sm text-gray-600">High Priority</div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search todos..."
                                className="input pl-10"
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <select
                            className="input"
                            value={filters.completed}
                            onChange={(e) => setFilters(prev => ({ ...prev, completed: e.target.value }))}
                        >
                            <option value="all">All Status</option>
                            <option value="false">Pending</option>
                            <option value="true">Completed</option>
                        </select>

                        <select
                            className="input"
                            value={filters.priority}
                            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                        >
                            <option value="all">All Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>

                        <select
                            className="input"
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="dueDate-asc">Due Date (Earliest)</option>
                            <option value="dueDate-desc">Due Date (Latest)</option>
                            <option value="priority-desc">Priority (High to Low)</option>
                            <option value="priority-asc">Priority (Low to High)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Todo Form Modal */}
            {showForm && (
                <TodoForm
                    onSubmit={handleCreateTodo}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Edit Todo Modal */}
            {editingTodo && (
                <TodoForm
                    todo={editingTodo}
                    onSubmit={(data) => handleUpdateTodo(editingTodo._id, data)}
                    onCancel={() => setEditingTodo(null)}
                />
            )}

            {/* Todo List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : todos.length === 0 ? (
                    <div className="card text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Circle className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No todos found</h3>
                        <p className="text-gray-600 mb-4">
                            {filters.search || filters.completed !== 'all' || filters.priority !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Get started by creating your first todo'
                            }
                        </p>
                        {!filters.search && filters.completed === 'all' && filters.priority === 'all' && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn-primary"
                            >
                                Create your first todo
                            </button>
                        )}
                    </div>
                ) : (
                    todos.map((todo) => (
                        <TodoItem
                            key={todo._id}
                            todo={todo}
                            onToggle={() => handleToggleTodo(todo._id)}
                            onEdit={() => setEditingTodo(todo)}
                            onDelete={() => handleDeleteTodo(todo._id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TodoList; 