import express from 'express';
import sortingService from '../services/sortingService.js';

const router = express.Router();

/**
 * POST /sort
 * Sort todos by specified strategy
 */
router.post('/sort', (req, res) => {
    try {
        const { todos, sortBy = 'createdAt' } = req.body;

        // Validation
        if (!todos) {
            return res.status(400).json({
                error: 'Missing required field: todos',
                message: 'Request body must include a "todos" array'
            });
        }

        if (!Array.isArray(todos)) {
            return res.status(400).json({
                error: 'Invalid todos format',
                message: 'Field "todos" must be an array'
            });
        }

        if (!sortingService.isValidStrategy(sortBy)) {
            return res.status(400).json({
                error: 'Invalid sorting strategy',
                message: `Supported strategies: ${sortingService.getSupportedStrategies().join(', ')}`
            });
        }

        console.log(`Sorting ${todos.length} todos by: ${sortBy}`);

        // Sort todos
        const sortedTodos = sortingService.sortTodos(todos, sortBy);

        res.json(sortedTodos);

    } catch (error) {
        console.error('Error sorting todos:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to sort todos'
        });
    }
});

/**
 * GET /sort/strategies
 * Get list of supported sorting strategies
 */
router.get('/sort/strategies', (req, res) => {
    try {
        const strategies = sortingService.getSupportedStrategies().map(strategy => ({
            key: strategy,
            name: formatStrategyName(strategy),
            description: getStrategyDescription(strategy)
        }));

        res.json({
            strategies,
            count: strategies.length
        });
    } catch (error) {
        console.error('Error getting strategies:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to get sorting strategies'
        });
    }
});

/**
 * Helper function to format strategy names
 */
function formatStrategyName(strategy) {
    const names = {
        'priority': 'Priority',
        'dueDate': 'Due Date',
        'alphabetical': 'Alphabetical',
        'completion': 'Completion Status',
        'createdAt': 'Creation Date'
    };
    return names[strategy] || strategy;
}

/**
 * Helper function to get strategy descriptions
 */
function getStrategyDescription(strategy) {
    const descriptions = {
        'priority': 'Sort by priority level (High → Medium → Low)',
        'dueDate': 'Sort by due date (upcoming first, then by date)',
        'alphabetical': 'Sort alphabetically by title',
        'completion': 'Sort by completion status (incomplete first)',
        'createdAt': 'Sort by creation date (newest first)'
    };
    return descriptions[strategy] || 'No description available';
}

export default router;