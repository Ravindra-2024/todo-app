import React from 'react';
import { CheckCircle, Circle, Edit, Trash2, Calendar, Flag } from 'lucide-react';
import { format } from 'date-fns';

const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'high':
                return <span className="badge-high">High</span>;
            case 'medium':
                return <span className="badge-medium">Medium</span>;
            case 'low':
                return <span className="badge-low">Low</span>;
            default:
                return null;
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high':
                return <Flag className="h-4 w-4 text-danger-600" />;
            case 'medium':
                return <Flag className="h-4 w-4 text-warning-600" />;
            case 'low':
                return <Flag className="h-4 w-4 text-success-600" />;
            default:
                return null;
        }
    };

    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

    return (
        <div className={`card transition-all duration-200 hover:shadow-md ${todo.completed ? 'opacity-75' : ''
            } ${isOverdue ? 'border-danger-200 bg-danger-50' : ''}`}>
            <div className="flex items-start gap-4">
                {/* Toggle Button */}
                <button
                    onClick={onToggle}
                    className="flex-shrink-0 mt-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    {todo.completed ? (
                        <CheckCircle className="h-6 w-6 text-success-600" />
                    ) : (
                        <Circle className="h-6 w-6 text-gray-400 hover:text-primary-600" />
                    )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                                }`}>
                                {todo.title}
                            </h3>

                            {todo.description && (
                                <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {todo.description}
                                </p>
                            )}

                            {/* Meta Information */}
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                {todo.dueDate && (
                                    <div className={`flex items-center gap-1 ${isOverdue ? 'text-danger-600 font-medium' : ''
                                        }`}>
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {isOverdue ? 'Overdue: ' : 'Due: '}
                                            {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-1">
                                    {getPriorityIcon(todo.priority)}
                                    {getPriorityBadge(todo.priority)}
                                </div>

                                <span className="text-xs">
                                    Created {format(new Date(todo.createdAt), 'MMM dd, yyyy')}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={onEdit}
                                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title="Edit todo"
                            >
                                <Edit className="h-4 w-4" />
                            </button>

                            <button
                                onClick={onDelete}
                                className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                title="Delete todo"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoItem; 