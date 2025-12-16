import { NextRequest, NextResponse } from 'next/server';
import type { Conversation } from '@thoughtweaver/types';
import { conversations } from './data';

// GET /api/conversations - List all conversations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const workflow = searchParams.get('workflow');
    const limit = searchParams.get('limit');

    let filteredConversations = [...conversations];

    // Filter by projectId if provided
    if (projectId) {
      filteredConversations = filteredConversations.filter(
        (conv) => conv.projectId === projectId
      );
    }

    // Filter by workflow if provided
    if (workflow) {
      filteredConversations = filteredConversations.filter(
        (conv) => conv.workflow === workflow
      );
    }

    // Sort by timestamp (newest first)
    filteredConversations.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredConversations = filteredConversations.slice(0, limitNum);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: filteredConversations,
        count: filteredConversations.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conversations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, prompt, workflow, assistants, llm, projectId } = body;

    // Validation
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

    // Create new conversation
    const newConversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      prompt,
      workflow,
      assistants,
      timestamp: new Date(),
      ...(llm && { llm }),
      ...(projectId && { projectId }),
    };

    conversations.push(newConversation);

    return NextResponse.json(
      {
        success: true,
        data: newConversation,
        message: 'Conversation created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create conversation',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
