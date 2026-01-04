import React, { useState } from 'react';
import { PreChatForm } from './PreChatForm';
import { ChatInterface } from './ChatInterface';
import { useChatbot } from '../../hooks/useChatbot';
import { CheckCircle } from 'lucide-react';

interface PodcastChatTabProps {
  contextType: 'podcast_hub' | 'podcast_detail';
  contextId?: number;
  contextTitle?: string;
}

export const PodcastChatTab: React.FC<PodcastChatTabProps> = ({
  contextType,
  contextId,
  contextTitle,
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; phone: string } | null>(
    null
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { startConversation, sessionId, conversationId, isLoading, error } = useChatbot();

  const handleFormSubmit = async (data: { name: string; email: string; phone: string }) => {
    setUserInfo(data);

    const result = await startConversation({
      ...data,
      context_type: contextType,
      context_id: contextId,
    });

    if (result.success) {
      setShowConfirmation(true);
      // Hide confirmation message after 3 seconds and show chat
      setTimeout(() => {
        setShowConfirmation(false);
        setIsStarted(true);
      }, 3000);
    }
  };

  if (showConfirmation) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Teşekkürler!</h3>
        <p className="text-gray-600 mb-2">
          Size e-posta ile de ulaşacağız, {userInfo?.name}.
        </p>
        <p className="text-sm text-gray-500">Sohbet başlatılıyor...</p>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="py-8">
        <PreChatForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        {error && (
          <div className="max-w-md mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    );
  }

  if (!sessionId || !conversationId || !userInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Bir hata oluştu. Lütfen sayfayı yenileyin.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <ChatInterface
        sessionId={sessionId}
        conversationId={conversationId}
        userName={userInfo.name}
      />
    </div>
  );
};
