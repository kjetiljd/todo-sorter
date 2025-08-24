import { test, describe } from 'node:test';
import assert from 'node:assert';
import sortingService from '../src/services/sortingService.js';

// Sample test data
const sampleTodos = [
    {
        id: 1,
        title: 'Zebra task',
        completed: false,
        priority: 'LOW',
        dueDate: '2024-01-15',
        createdAt: '2024-01-10T10:00:00Z'
    },
    {
        id: 2, 
        title: 'Alpha task',
        completed: true,
        priority: 'HIGH',
        dueDate: '2024-01-12',
        createdAt: '2024-01-11T10:00:00Z'
    },
    {
        id: 3,
        title: 'Beta task',
        completed: false,
        priority: 'MEDIUM',
        dueDate: null,
        createdAt: '2024-01-12T10:00:00Z'
    }
];

describe('SortingService', () => {
    
    test('should sort by priority correctly', () => {
        const result = sortingService.sortTodos(sampleTodos, 'priority');
        
        // HIGH priority should come first
        assert.strictEqual(result[0].priority, 'HIGH');
        assert.strictEqual(result[1].priority, 'MEDIUM');
        assert.strictEqual(result[2].priority, 'LOW');
    });
    
    test('should sort by due date correctly', () => {
        const result = sortingService.sortTodos(sampleTodos, 'dueDate');
        
        // Items with due dates should come first, sorted by date
        assert.strictEqual(result[0].dueDate, '2024-01-12'); // Earliest due date
        assert.strictEqual(result[1].dueDate, '2024-01-15'); // Later due date
        assert.strictEqual(result[2].dueDate, null); // No due date last
    });
    
    test('should sort alphabetically correctly', () => {
        const result = sortingService.sortTodos(sampleTodos, 'alphabetical');
        
        assert.strictEqual(result[0].title, 'Alpha task');
        assert.strictEqual(result[1].title, 'Beta task');
        assert.strictEqual(result[2].title, 'Zebra task');
    });
    
    test('should sort by completion status correctly', () => {
        const result = sortingService.sortTodos(sampleTodos, 'completion');
        
        // Incomplete tasks should come first
        assert.strictEqual(result[0].completed, false);
        assert.strictEqual(result[1].completed, false);
        assert.strictEqual(result[2].completed, true);
    });
    
    test('should sort by created date correctly', () => {
        const result = sortingService.sortTodos(sampleTodos, 'createdAt');
        
        // Newest first
        assert.strictEqual(result[0].id, 3); // 2024-01-12
        assert.strictEqual(result[1].id, 2); // 2024-01-11
        assert.strictEqual(result[2].id, 1); // 2024-01-10
    });
    
    test('should handle empty array', () => {
        const result = sortingService.sortTodos([], 'priority');
        assert.strictEqual(result.length, 0);
    });
    
    test('should throw error for invalid input', () => {
        assert.throws(() => {
            sortingService.sortTodos(null, 'priority');
        }, /Todos must be an array/);
    });
    
    test('should return supported strategies', () => {
        const strategies = sortingService.getSupportedStrategies();
        assert(Array.isArray(strategies));
        assert(strategies.includes('priority'));
        assert(strategies.includes('dueDate'));
        assert(strategies.includes('alphabetical'));
        assert(strategies.includes('completion'));
        assert(strategies.includes('createdAt'));
    });
    
    test('should validate strategies correctly', () => {
        assert.strictEqual(sortingService.isValidStrategy('priority'), true);
        assert.strictEqual(sortingService.isValidStrategy('invalid'), false);
    });
    
    test('should not mutate original array', () => {
        const original = [...sampleTodos];
        sortingService.sortTodos(sampleTodos, 'priority');
        
        // Original array should remain unchanged
        assert.deepStrictEqual(sampleTodos, original);
    });
});