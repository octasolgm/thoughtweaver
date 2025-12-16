import type { Conversation } from '@thoughtweaver/types';

// In-memory storage for conversations
// This is shared across all API routes in the conversations module
// Replace with a database connection in production (e.g., PostgreSQL, MongoDB, etc.)
export const conversations: Conversation[] = [];
