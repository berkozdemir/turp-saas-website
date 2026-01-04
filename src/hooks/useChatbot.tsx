import { useState, useCallback } from 'react';
import { fetchAPI } from '../lib/contentApi';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
  sources?: ChatSource[];
}

export interface ChatSource {
  type: 'podcast' | 'blog' | 'faq' | 'static';
  id: number | null;
  title: string;
  url?: string;
}

export interface StartConversationData {
  email: string;
  name: string;
  phone?: string;
  context_type: 'podcast_hub' | 'podcast_detail';
  context_id?: number;
}

export interface ConversationState {
  sessionId: string | null;
  conversationId: number | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export function useChatbot(initialSessionId: string | null = null) {
  const [state, setState] = useState<ConversationState>({
    sessionId: initialSessionId,
    conversationId: null,
    messages: [],
    isLoading: false,
    error: null,
  });

  /**
   * Start a new conversation
   */
  const startConversation = useCallback(async (data: StartConversationData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetchAPI('chatbot_start', data, 'POST');

      if (response.error) {
        setState(prev => ({ ...prev, error: response.error, isLoading: false }));
        return { success: false, error: response.error };
      }

      setState(prev => ({
        ...prev,
        sessionId: response.session_id,
        conversationId: response.conversation_id,
        isLoading: false,
      }));

      return {
        success: true,
        sessionId: response.session_id,
        conversationId: response.conversation_id,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bir hata oluştu';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Send a message in the conversation
   */
  const sendMessage = useCallback(async (message: string) => {
    if (!state.sessionId) {
      return { success: false, error: 'Oturum bulunamadı' };
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Add user message optimistically
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    try {
      const response = await fetchAPI(
        'chatbot_send_message',
        {
          session_id: state.sessionId,
          message,
        },
        'POST'
      );

      if (response.error) {
        setState(prev => ({ ...prev, error: response.error, isLoading: false }));
        return { success: false, error: response.error };
      }

      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.reply,
        sources: response.sources || [],
        created_at: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));

      return {
        success: true,
        reply: response.reply,
        sources: response.sources,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bir hata oluştu';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, [state.sessionId]);

  /**
   * Get conversation history
   */
  const getHistory = useCallback(async (sessionId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetchAPI('chatbot_get_history', { session_id: sessionId });

      if (response.error) {
        setState(prev => ({ ...prev, error: response.error, isLoading: false }));
        return { success: false, error: response.error };
      }

      setState(prev => ({
        ...prev,
        messages: response.messages || [],
        isLoading: false,
      }));

      return { success: true, messages: response.messages };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bir hata oluştu';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Clear conversation state
   */
  const clearConversation = useCallback(() => {
    setState({
      sessionId: null,
      conversationId: null,
      messages: [],
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    startConversation,
    sendMessage,
    getHistory,
    clearConversation,
  };
}
