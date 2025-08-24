/**
 * Sorting service with multiple strategies for todo items
 */

class SortingService {
    
    /**
     * Sort todos by the specified strategy
     * @param {Array} todos - Array of todo objects
     * @param {string} sortBy - Sorting strategy
     * @returns {Array} Sorted array of todos
     */
    sortTodos(todos, sortBy) {
        if (!Array.isArray(todos)) {
            throw new Error('Todos must be an array');
        }

        // Make a copy to avoid mutating the original array
        const todosCopy = [...todos];

        switch (sortBy) {
            case 'priority':
                return this.sortByPriority(todosCopy);
            case 'dueDate':
                return this.sortByDueDate(todosCopy);
            case 'alphabetical':
                return this.sortAlphabetical(todosCopy);
            case 'completion':
                return this.sortByCompletion(todosCopy);
            case 'createdAt':
            default:
                return this.sortByCreatedDate(todosCopy);
        }
    }

    /**
     * Sort by priority: HIGH → MEDIUM → LOW
     */
    sortByPriority(todos) {
        const priorityOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
        
        return todos.sort((a, b) => {
            const priorityDiff = (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
            if (priorityDiff !== 0) return priorityDiff;
            
            // Secondary sort by creation date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    /**
     * Sort by due date: items with due dates first, then by date ascending
     */
    sortByDueDate(todos) {
        return todos.sort((a, b) => {
            // Items with due dates come first
            if (a.dueDate && !b.dueDate) return -1;
            if (!a.dueDate && b.dueDate) return 1;
            
            // If both have due dates, sort by date
            if (a.dueDate && b.dueDate) {
                const dateA = new Date(a.dueDate);
                const dateB = new Date(b.dueDate);
                const dateDiff = dateA - dateB;
                if (dateDiff !== 0) return dateDiff;
            }
            
            // Secondary sort by creation date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    /**
     * Sort alphabetically by title
     */
    sortAlphabetical(todos) {
        return todos.sort((a, b) => {
            const titleA = (a.title || '').toLowerCase();
            const titleB = (b.title || '').toLowerCase();
            return titleA.localeCompare(titleB);
        });
    }

    /**
     * Sort by completion status: incomplete first, then completed
     */
    sortByCompletion(todos) {
        return todos.sort((a, b) => {
            // Incomplete todos first (false < true in JavaScript)
            const completionDiff = a.completed - b.completed;
            if (completionDiff !== 0) return completionDiff;
            
            // Secondary sort by creation date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    /**
     * Sort by creation date: newest first
     */
    sortByCreatedDate(todos) {
        return todos.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    /**
     * Get list of supported sorting strategies
     */
    getSupportedStrategies() {
        return [
            'priority',
            'dueDate', 
            'alphabetical',
            'completion',
            'createdAt'
        ];
    }

    /**
     * Validate sorting strategy
     */
    isValidStrategy(sortBy) {
        return this.getSupportedStrategies().includes(sortBy);
    }
}

export default new SortingService();