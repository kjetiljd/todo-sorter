# Todo Sorter Service

A lightweight Node.js microservice for sorting todo items using various strategies.

## Features

- Multiple sorting strategies (priority, due date, alphabetical, completion status, creation date)
- RESTful API with JSON responses
- CORS support for frontend integration
- Request logging and error handling
- Health check endpoint
- Unit tests with Node.js test runner

## Tech Stack

- Node.js with ES modules
- Express.js web framework
- CORS middleware
- No external database (stateless service)

## Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3001)
npm run dev

# Start production server
npm start

# Run tests
npm test
```

## API Endpoints

### POST /sort
Sort an array of todos by specified strategy.

**Request Body:**
```json
{
  "todos": [
    {
      "id": 1,
      "title": "Sample todo",
      "completed": false,
      "priority": "HIGH",
      "dueDate": "2024-01-15",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ],
  "sortBy": "priority"
}
```

**Response:** Array of sorted todos

### GET /sort/strategies
Get list of supported sorting strategies.

**Response:**
```json
{
  "strategies": [
    {
      "key": "priority",
      "name": "Priority", 
      "description": "Sort by priority level (High → Medium → Low)"
    }
  ],
  "count": 5
}
```

### GET /health
Service health check.

**Response:**
```json
{
  "status": "OK",
  "service": "todo-sorter",
  "version": "1.0.0",
  "timestamp": "2024-01-10T10:00:00Z",
  "uptime": 123.456
}
```

## Sorting Strategies

- **priority** - Sort by priority level (HIGH → MEDIUM → LOW)
- **dueDate** - Sort by due date (upcoming first, no due date last)
- **alphabetical** - Sort alphabetically by title
- **completion** - Sort by completion status (incomplete first)
- **createdAt** - Sort by creation date (newest first)

## Integration

This service is designed to be called by the Todo Backend API but can be used independently. It integrates seamlessly with the meta-repository demo application.

## Configuration

Environment variables:
- `PORT` - Server port (default: 3001)

## Docker

Build and run the service in a container:

```bash
# Build image
docker build -t todo-sorter:latest .

# Run container (maps host 3001 -> container 3001)
docker run --rm -p 3001:3001 --name todo-sorter todo-sorter:latest

# Optional: customize port
# docker run --rm -e PORT=8080 -p 8080:8080 todo-sorter:latest
```

Health check endpoint inside the container: GET http://localhost:3001/health
