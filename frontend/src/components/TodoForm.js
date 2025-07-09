import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag } from 'lucide-react';

const TodoForm = ({ todo, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
    });
    const [errors, setErrors] = useState({});

    const isEditing = !!todo;

    useEffect(() => {
        if (todo) {
            setFormData({
                title: todo.title || '',
                description: todo.description || '',
                priority: todo.priority || 'medium',
                dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
            });
        }
    }, [todo]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 200) {
            newErrors.title = 'Title must be less than 200 characters';
        }

        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }

        if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
            newErrors.dueDate = 'Due date cannot be in the past';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const submitData = {
            ...formData,
            title: formData.title.trim(),
            description: formData.description.trim(),
            dueDate: formData.dueDate || null,
        };

        onSubmit(submitData);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-danger-600';
            case 'medium': return 'text-warning-600';
            case 'low': return 'text-success-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEditing ? 'Edit Todo' : 'Create New Todo'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`input ${errors.title ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                            placeholder="Enter todo title"
                            maxLength={200}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-danger-600">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className={`input resize-none ${errors.description ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                            placeholder="Enter todo description (optional)"
                            maxLength={1000}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-danger-600">{errors.description}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            {formData.description.length}/1000 characters
                        </p>
                    </div>

                    {/* Priority */}
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['low', 'medium', 'high'].map((priority) => (
                                <button
                                    key={priority}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'priority', value: priority } })}
                                    className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors ${formData.priority === priority
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    <Flag className={`h-4 w-4 ${getPriorityColor(priority)}`} />
                                    <span className="capitalize">{priority}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className={`input pl-10 ${errors.dueDate ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        {errors.dueDate && (
                            <p className="mt-1 text-sm text-danger-600">{errors.dueDate}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary"
                        >
                            {isEditing ? 'Update Todo' : 'Create Todo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoForm; 