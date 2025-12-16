# Conversations API Documentation

RESTful API for managing chatbot conversations with full CRUD operations.

## Base URL

```
/api/conversations
```

## Data Model

### Conversation Object

```typescript
{
  id: string;              // Unique identifier (auto-generated)
  title: string;           // Conversation title
  prompt: string;          // Initial prompt that started the conversation
  workflow: string;        // Workflow type used
  assistants: string[];    // Array of assistant IDs
  timestamp: Date;         // Creation timestamp (auto-generated)
  llm?: string;           // Optional: LLM model used
  projectId?: string;      // Optional: Associated project ID
}
```

## Endpoints

### 1. List All Conversations

Get a list of all conversations with optional filtering.

**Endpoint:** `GET /api/conversations`

**Query Parameters:**
- `projectId` (optional): Filter by project ID
- `workflow` (optional): Filter by workflow type
- `limit` (optional): Limit number of results (integer)

**Example Request:**
```bash
# Get all conversations
curl http://localhost:3000/api/conversations

# Get conversations for a specific project
curl http://localhost:3000/api/conversations?projectId=proj-123

# Get latest 10 conversations
curl http://localhost:3000/api/conversations?limit=10

# Filter by workflow
curl http://localhost:3000/api/conversations?workflow=build-as-we-go
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "conv-1234567890-abc123",
      "title": "Build a chat interface",
      "prompt": "Create a modern chat interface with real-time messaging",
      "workflow": "build-as-we-go",
      "assistants": ["assistant-1", "assistant-2"],
      "timestamp": "2024-01-15T10:30:00.000Z",
      "llm": "gpt-4",
      "projectId": "proj-123"
    }
  ],
  "count": 1
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to fetch conversations",
  "message": "Error details"
}
```

---

### 2. Create a Conversation

Create a new conversation.

**Endpoint:** `POST /api/conversations`

**Request Body:**
```json
{
  "title": "string (required)",
  "prompt": "string (required)",
  "workflow": "string (required)",
  "assistants": ["string"] (required, non-empty array),
  "llm": "string (optional)",
  "projectId": "string (optional)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build a chat interface",
    "prompt": "Create a modern chat interface with real-time messaging",
    "workflow": "build-as-we-go",
    "assistants": ["assistant-1", "assistant-2"],
    "llm": "gpt-4",
    "projectId": "proj-123"
  }'
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "conv-1234567890-abc123",
    "title": "Build a chat interface",
    "prompt": "Create a modern chat interface with real-time messaging",
    "workflow": "build-as-we-go",
    "assistants": ["assistant-1", "assistant-2"],
    "timestamp": "2024-01-15T10:30:00.000Z",
    "llm": "gpt-4",
    "projectId": "proj-123"
  },
  "message": "Conversation created successfully"
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation error",
  "message": "Title is required and must be a string"
}
```

---

### 3. Get a Single Conversation

Retrieve a specific conversation by ID.

**Endpoint:** `GET /api/conversations/[id]`

**Example Request:**
```bash
curl http://localhost:3000/api/conversations/conv-1234567890-abc123
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "conv-1234567890-abc123",
    "title": "Build a chat interface",
    "prompt": "Create a modern chat interface with real-time messaging",
    "workflow": "build-as-we-go",
    "assistants": ["assistant-1", "assistant-2"],
    "timestamp": "2024-01-15T10:30:00.000Z",
    "llm": "gpt-4",
    "projectId": "proj-123"
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": "Not found",
  "message": "Conversation with id 'conv-xxx' not found"
}
```

---

### 4. Update a Conversation (Partial)

Update specific fields of a conversation.

**Endpoint:** `PATCH /api/conversations/[id]`

**Updatable Fields:**
- `title`
- `workflow`
- `assistants`
- `llm`
- `projectId`

**Note:** Cannot update `id`, `timestamp`, or `prompt`.

**Request Body:**
```json
{
  "title": "string (optional)",
  "workflow": "string (optional)",
  "assistants": ["string"] (optional),
  "llm": "string (optional)",
  "projectId": "string (optional)"
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:3000/api/conversations/conv-1234567890-abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated chat interface title",
    "llm": "gpt-4-turbo"
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "conv-1234567890-abc123",
    "title": "Updated chat interface title",
    "prompt": "Create a modern chat interface with real-time messaging",
    "workflow": "build-as-we-go",
    "assistants": ["assistant-1", "assistant-2"],
    "timestamp": "2024-01-15T10:30:00.000Z",
    "llm": "gpt-4-turbo",
    "projectId": "proj-123"
  },
  "message": "Conversation updated successfully"
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation error",
  "message": "Cannot modify id, timestamp, or prompt fields"
}
```

---

### 5. Replace a Conversation (Full Update)

Replace entire conversation (all required fields must be provided).

**Endpoint:** `PUT /api/conversations/[id]`

**Request Body:**
```json
{
  "title": "string (required)",
  "prompt": "string (required)",
  "workflow": "string (required)",
  "assistants": ["string"] (required),
  "llm": "string (optional)",
  "projectId": "string (optional)"
}
```

**Note:** `id` and `timestamp` are preserved from the original conversation.

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/conversations/conv-1234567890-abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Completely new conversation data",
    "prompt": "Original prompt cannot be changed via this endpoint",
    "workflow": "sequential",
    "assistants": ["assistant-3"],
    "llm": "claude-3"
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "conv-1234567890-abc123",
    "title": "Completely new conversation data",
    "prompt": "Original prompt cannot be changed via this endpoint",
    "workflow": "sequential",
    "assistants": ["assistant-3"],
    "timestamp": "2024-01-15T10:30:00.000Z",
    "llm": "claude-3"
  },
  "message": "Conversation replaced successfully"
}
```

---

### 6. Delete a Conversation

Delete a conversation by ID.

**Endpoint:** `DELETE /api/conversations/[id]`

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/conversations/conv-1234567890-abc123
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "conv-1234567890-abc123",
    "title": "Build a chat interface",
    "prompt": "Create a modern chat interface with real-time messaging",
    "workflow": "build-as-we-go",
    "assistants": ["assistant-1", "assistant-2"],
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "message": "Conversation deleted successfully"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": "Not found",
  "message": "Conversation with id 'conv-xxx' not found"
}
```

---

## Response Format

All responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": <response data>,
  "message": "Optional success message",
  "count": <optional count for list endpoints>
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## HTTP Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or malformed request |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

## Data Storage

**Current Implementation:** In-memory storage (resets on server restart)

**Production Recommendation:** Replace with a database:
- PostgreSQL with Prisma ORM
- MongoDB with Mongoose
- Supabase
- Firebase Firestore

To integrate a database:
1. Update `/app/api/conversations/data.ts` with your database connection
2. Replace array operations with database queries
3. Add proper error handling for database operations
4. Implement connection pooling for performance

## Examples with Different Tools

### JavaScript/Fetch
```javascript
// Create a conversation
const response = await fetch('/api/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Conversation',
    prompt: 'Hello world',
    workflow: 'build-as-we-go',
    assistants: ['assistant-1']
  })
});
const data = await response.json();
```

### Python/Requests
```python
import requests

# Get all conversations
response = requests.get('http://localhost:3000/api/conversations')
conversations = response.json()

# Create a conversation
payload = {
    'title': 'My Conversation',
    'prompt': 'Hello world',
    'workflow': 'build-as-we-go',
    'assistants': ['assistant-1']
}
response = requests.post('http://localhost:3000/api/conversations', json=payload)
```

### TypeScript/Axios
```typescript
import axios from 'axios';

// Update a conversation
const response = await axios.patch('/api/conversations/conv-123', {
  title: 'Updated Title'
});

// Delete a conversation
await axios.delete('/api/conversations/conv-123');
```

## Testing the API

### Using cURL

```bash
# 1. Create a conversation
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","prompt":"Test prompt","workflow":"test","assistants":["ai-1"]}'

# 2. List all conversations
curl http://localhost:3000/api/conversations

# 3. Get specific conversation (use ID from step 1)
curl http://localhost:3000/api/conversations/conv-1234567890-abc123

# 4. Update conversation
curl -X PATCH http://localhost:3000/api/conversations/conv-1234567890-abc123 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# 5. Delete conversation
curl -X DELETE http://localhost:3000/api/conversations/conv-1234567890-abc123
```

### Using Postman

1. Import the endpoints as a new collection
2. Set base URL to `http://localhost:3000`
3. Create requests for each endpoint
4. Test the full CRUD cycle

## Security Considerations

For production use, consider adding:

1. **Authentication & Authorization**
   - JWT tokens
   - API keys
   - User-based access control

2. **Rate Limiting**
   - Prevent API abuse
   - Use packages like `express-rate-limit`

3. **Input Sanitization**
   - Validate and sanitize all inputs
   - Prevent injection attacks

4. **CORS Configuration**
   - Configure allowed origins
   - Restrict API access

5. **Data Validation**
   - Use Zod or Yup for schema validation
   - Validate IDs, lengths, formats

## Error Handling

The API implements comprehensive error handling:

- **Validation Errors (400)**: Missing or invalid fields
- **Not Found Errors (404)**: Resource doesn't exist
- **Server Errors (500)**: Unexpected failures

All errors include descriptive messages to help with debugging.

## Limitations

**Current Implementation Limitations:**

1. Data is stored in memory and will be lost on server restart
2. No authentication/authorization
3. No rate limiting
4. No pagination for large datasets
5. No advanced search/filtering capabilities
6. No message history storage within conversations

**Future Enhancements:**

- Add message CRUD operations nested under conversations
- Implement pagination with cursor-based or offset pagination
- Add search functionality with fuzzy matching
- Add conversation analytics endpoints
- Implement real-time updates via WebSocket
- Add export/import functionality
