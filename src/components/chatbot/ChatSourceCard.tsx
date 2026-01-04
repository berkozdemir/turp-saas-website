import React from 'react';
import { Podcast, FileText, HelpCircle, Book, ExternalLink } from 'lucide-react';
import { ChatSource } from '../../hooks/useChatbot';

interface ChatSourceCardProps {
  source: ChatSource;
}

export const ChatSourceCard: React.FC<ChatSourceCardProps> = ({ source }) => {
  const getIcon = () => {
    switch (source.type) {
      case 'podcast':
        return <Podcast className="w-4 h-4" />;
      case 'blog':
        return <FileText className="w-4 h-4" />;
      case 'faq':
        return <HelpCircle className="w-4 h-4" />;
      case 'static':
        return <Book className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getLabel = () => {
    switch (source.type) {
      case 'podcast':
        return 'Podcast';
      case 'blog':
        return 'Blog';
      case 'faq':
        return 'SSS';
      case 'static':
        return 'Bilgi Bankası';
      default:
        return source.type;
    }
  };

  const getColor = () => {
    switch (source.type) {
      case 'podcast':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'blog':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'faq':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'static':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (source.url) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getColor()} hover:shadow-sm transition-shadow text-xs`}
      >
        {getIcon()}
        <span className="flex-1 font-medium truncate">{source.title}</span>
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white bg-opacity-50">
          {getLabel()}
        </span>
        <ExternalLink className="w-3 h-3 flex-shrink-0" />
      </a>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getColor()} text-xs`}
    >
      {getIcon()}
      <span className="flex-1 font-medium truncate">{source.title}</span>
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white bg-opacity-50">
        {getLabel()}
      </span>
    </div>
  );
};
