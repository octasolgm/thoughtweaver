import { NextRequest, NextResponse } from 'next/server';
import type { Conversation } from '@thoughtweaver/types';

// In-memory storage (replace with database in production)
// Note: This should be replaced with a shared data store in production
// For now, we'll import from the parent route
import { conversations } from '../data';

// GET /api/conversations/[id] - Get a specific conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const conversation = conversations.find((conv) => conv.id === id);

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Conversation with id '${id}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: conversation,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conversation',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PATCH /api/conversations/[id] - Update a conversation
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const conversationIndex = conversations.findIndex((conv) => conv.id === id);

    if (conversationIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Conversation with id '${id}' not found`,
        },
        { status: 404 }
      );
    }

    // Validate update fields
    const allowedFields = ['title', 'workflow', 'assistants', 'llm', 'projectId'];
    const updateFields: Partial<Conversation> = {};

    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        // Type-specific validations
        if (key === 'title' && (typeof value !== 'string' || value.trim() === '')) {
          return NextResponse.json(
            {
              success: false,
              error: 'Validation error',
              message: 'Title must be a non-empty string',
            },
            { status: 400 }
          );
        }

        if (key === 'workflow' && typeof value !== 'string') {
          return NextResponse.json(
            {
              success: false,
              error: 'Validation error',
              message: 'Workflow must be a string',
            },
            { status: 400 }
          );
        }

        if (key === 'assistants' && (!Array.isArray(value) || value.length === 0)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Validation error',
              message: 'Assistants must be a non-empty array',
            },
            { status: 400 }
          );
        }

        updateFields[key as keyof Conversation] = value;
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'No valid fields provided for update',
        },
        { status: 400 }
      );
    }

    // Prevent modifying immutable fields
    if (body.id || body.timestamp || body.prompt) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Cannot modify id, timestamp, or prompt fields',
        },
        { status: 400 }
      );
    }

    // Update conversation
    conversations[conversationIndex] = {
      ...conversations[conversationIndex],
      ...updateFields,
    };

    return NextResponse.json(
      {
        success: true,
        data: conversations[conversationIndex],
        message: 'Conversation updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update conversation',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations/[id] - Delete a conversation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const conversationIndex = conversations.findIndex((conv) => conv.id === id);

    if (conversationIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Conversation with id '${id}' not found`,
        },
        { status: 404 }
      );
    }

    const deletedConversation = conversations[conversationIndex];
    conversations.splice(conversationIndex, 1);

    return NextResponse.json(
      {
        success: true,
        data: deletedConversation,
        message: 'Conversation deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete conversation',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/conversations/[id] - Replace entire conversation (optional, strict update)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const conversationIndex = conversations.findIndex((conv) => conv.id === id);

    if (conversationIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: `Conversation with id '${id}' not found`,
        },
        { status: 404 }
      );
    }

    // Validate all required fields are present
    const { title, prompt, workflow, assistants } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Title is required and must be a string',
        },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Prompt is required and must be a string',
        },
        { status: 400 }
      );
    }

    if (!workflow || typeof workflow !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Workflow is required and must be a string',
        },
        { status: 400 }
      );
    }

    if (!assistants || !Array.isArray(assistants) || assistants.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Assistants is required and must be a non-empty array',
        },
        { status: 400 }
      );
    }

    // Preserve id and timestamp from original
    const originalConversation = conversations[conversationIndex];

    const updatedConversation: Conversation = {
      id: originalConversation.id,
      timestamp: originalConversation.timestamp,
      title,
      prompt,
      workflow,
      assistants,
      ...(body.llm && { llm: body.llm }),
      ...(body.projectId && { projectId: body.projectId }),
    };

    conversations[conversationIndex] = updatedConversation;

    return NextResponse.json(
      {
        success: true,
        data: updatedConversation,
        message: 'Conversation replaced successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to replace conversation',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
