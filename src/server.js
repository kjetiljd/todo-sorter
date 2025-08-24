import express from 'express';
import cors from 'cors';
import sortRoutes from './routes/sortRoutes.js';
import { requestLogger } from './middleware/requestLogger.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:5173'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// Routes
app.use('/', sortRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'todo-sorter',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Root endpoint with service info
app.get('/', (req, res) => {
    res.json({
        service: 'Todo Sorting Service',
        version: '1.0.0',
        description: 'Microservice for sorting todo items with various strategies',
        endpoints: {
            'POST /sort': 'Sort todos by strategy',
            'GET /sort/strategies': 'List supported sorting strategies',
            'GET /health': 'Service health check'
        },
        supportedStrategies: [
            'priority',
            'dueDate',
            'alphabetical', 
            'completion',
            'createdAt'
        ]
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.baseUrl} not found`,
        availableEndpoints: [
            'POST /sort',
            'GET /sort/strategies',
            'GET /health',
            'GET /'
        ]
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on our end'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Todo Sorting Service running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 Service info: http://localhost:${PORT}/`);
    console.log(`🔄 Sort endpoint: http://localhost:${PORT}/sort`);
    console.log(`📋 Strategies: http://localhost:${PORT}/sort/strategies`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 Todo Sorting Service shutting down...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n📴 Todo Sorting Service shutting down...');
    process.exit(0);
});