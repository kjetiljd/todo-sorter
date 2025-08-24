/**
 * Simple request logging middleware
 */

export function requestLogger(req, res, next) {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    
    // Log the incoming request
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
    
    // Log request body for POST requests (but limit size)
    if (req.method === 'POST' && req.body) {
        const bodyStr = JSON.stringify(req.body);
        const truncated = bodyStr.length > 200 ? bodyStr.substring(0, 200) + '...' : bodyStr;
        console.log(`  Body: ${truncated}`);
    }
    
    // Override res.json to log response
    const originalJson = res.json;
    res.json = function(obj) {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
        return originalJson.call(this, obj);
    };
    
    next();
}

export default requestLogger;