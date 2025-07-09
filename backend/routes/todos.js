const express = require('express');
const { body, validationResult } = require('express-validator');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all todos for the authenticated user
router.get('/', async (req, res) => {
    try {
        const { completed, priority, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        // Build filter object
        const filter = { user: req.user._id };
        if (completed !== undefined) {
            filter.completed = completed === 'true';
        }
        if (priority) {
            filter.priority = priority;
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const todos = await Todo.find(filter)
            .sort(sort)
            .limit(100); // Limit to prevent performance issues

        res.json({
            success: true,
            data: todos
        });
    } catch (error) {
        console.error('Get todos error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch todos'
        });
    }
});

// Get a single todo by ID
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.json({
            success: true,
            data: todo
        });
    } catch (error) {
        console.error('Get todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch todo'
        });
    }
});

// Create a new todo
router.post('/', [
    body('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { title, description, priority, dueDate, completed } = req.body;

        const todo = new Todo({
            title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            user: req.user._id,
            completed: completed !== undefined ? completed : false
        });

        await todo.save();

        res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            data: todo
        });
    } catch (error) {
        console.error('Create todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create todo'
        });
    }
});

// Update a todo
router.put('/:id', [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { title, description, priority, dueDate, completed } = req.body;

        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        // Update fields
        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (priority !== undefined) todo.priority = priority;
        if (dueDate !== undefined) todo.dueDate = dueDate ? new Date(dueDate) : null;
        if (completed !== undefined) todo.completed = completed;

        await todo.save();

        res.json({
            success: true,
            message: 'Todo updated successfully',
            data: todo
        });
    } catch (error) {
        console.error('Update todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update todo'
        });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.json({
            success: true,
            message: 'Todo deleted successfully'
        });
    } catch (error) {
        console.error('Delete todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete todo'
        });
    }
});

// Toggle todo completion status
router.patch('/:id/toggle', async (req, res) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        todo.completed = !todo.completed;
        await todo.save();

        res.json({
            success: true,
            message: `Todo marked as ${todo.completed ? 'completed' : 'incomplete'}`,
            data: todo
        });
    } catch (error) {
        console.error('Toggle todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle todo'
        });
    }
});

// Get todo statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await Todo.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: { $sum: { $cond: ['$completed', 1, 0] } },
                    pending: { $sum: { $cond: ['$completed', 0, 1] } },
                    highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
                    mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
                    lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
                }
            }
        ]);

        const summary = stats[0] || {
            total: 0,
            completed: 0,
            pending: 0,
            highPriority: 0,
            mediumPriority: 0,
            lowPriority: 0
        };

        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

module.exports = router; 