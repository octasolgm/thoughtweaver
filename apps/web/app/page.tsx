'use client'

import { Suspense, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SignupPage } from '@/components/auth/SignupPage';
import { HomePage } from '@/components/home/HomePage';
import { ConversationView } from '@/components/conversation/ConversationView';
import { ContextBuilder } from '@/components/context/ContextBuilder';
import { WorkflowBuilder } from '@/components/workflow/WorkflowBuilder';
import { WorkflowEditor } from '@/components/workflow/WorkflowEditor';
import { PreferencesPage } from '@/components/preferences/PreferencesPage';
import { BillingPage } from '@/components/billing/BillingPage';
import { SelectLLMsPage } from '@/components/llms/SelectLLMsPage';
import { TeamPage } from '@/components/team/TeamPage';
import { AccountPage } from '@/components/account/AccountPage';
import { AssistantCreator } from '@/components/assistant/AssistantCreator';
import { AIAssistantsPage } from '@/components/assistant/AIAssistantsPage';
import { AIAssistantEditor } from '@/components/assistant/AIAssistantEditor';
import { ProjectsPage } from '@/components/projects/ProjectsPage';
import { useAuth, useNavigation } from '@/lib/contexts';

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const { currentPage, navigate } = useNavigation();

  // Auto-navigate authenticated users to home if they're on signup
  useEffect(() => {
    if (isAuthenticated && currentPage === 'signup') {
      navigate('home');
    }
  }, [isAuthenticated, currentPage, navigate]);

  // Show signup page if not authenticated
  if (!isAuthenticated) {
    return <SignupPage />;
  }

  return (
    <AppLayout>
      <Suspense fallback={<LoadingSpinner />}>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'conversation' && <ConversationView />}
        {currentPage === 'context' && <ContextBuilder />}
        {currentPage === 'workflow' && <WorkflowBuilder />}
        {currentPage === 'workflow-editor' && <WorkflowEditor />}
        {currentPage === 'preferences' && <PreferencesPage />}
        {currentPage === 'billing' && <BillingPage />}
        {currentPage === 'llms' && <SelectLLMsPage />}
        {currentPage === 'team' && <TeamPage />}
        {currentPage === 'account' && <AccountPage />}
        {currentPage === 'assistant-creator' && <AssistantCreator />}
        {currentPage === 'ai-assistants' && <AIAssistantsPage />}
        {currentPage.startsWith('ai-assistant-editor-') && (
          <AIAssistantEditor
            assistantId={currentPage.replace('ai-assistant-editor-', '')}
          />
        )}
        {currentPage === 'projects' && <ProjectsPage />}
      </Suspense>
    </AppLayout>
  );
}

export default function Page() {
  return <AppContent />;
}
