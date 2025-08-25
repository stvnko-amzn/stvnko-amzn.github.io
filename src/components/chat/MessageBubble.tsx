import React from 'react';
import { Message, VisualizationData } from '../../types';
import { format } from 'date-fns';
import { User, Bot } from 'lucide-react';
import { VisualizationCard } from '../visualizations/VisualizationCard';

interface MessageBubbleProps {
  message: Message;
  isPinned?: boolean;
  onPinVisualization?: (messageId: string, visualization: VisualizationData) => void;
  onUnpinVisualization?: (messageId: string) => void;
  onViewVisualization?: (messageId: string, visualization: VisualizationData) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isPinned = false,
  onPinVisualization,
  onUnpinVisualization,
  onViewVisualization
}) => {
  const isUser = message.sender === 'user';
  const isError = message.type === 'error';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`flex items-start space-x-3 max-w-4xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-amazon-blue' : 'bg-amazon-orange'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`chat-message ${isUser ? 'user' : 'assistant'} ${isError ? 'border-red-300 bg-red-50' : ''}`}>
          <div className="flex items-start justify-between mb-2">
            <span className={`text-sm font-medium ${isUser ? 'text-white' : 'text-gray-900'}`}>
              {isUser ? 'You' : 'ATLAS'}
            </span>
            <span className={`text-xs ${isUser ? 'text-blue-200' : 'text-gray-500'} ml-3`}>
              {format(message.timestamp, 'HH:mm')}
            </span>
          </div>
          
          <div className={`${isUser ? 'text-white' : isError ? 'text-red-800' : 'text-gray-800'}`}>
            {message.content.split('\n').map((line, index) => (
              <p key={index} className={index > 0 ? 'mt-2' : ''}>
                {line}
              </p>
            ))}
          </div>

          {/* Error indicator */}
          {isError && (
            <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700">
              ⚠️ This query couldn't be processed. Please try rephrasing or contact support.
            </div>
          )}

          {/* Visualization Card */}
          {message.visualizationData && !isUser && onPinVisualization && onUnpinVisualization && onViewVisualization && (
            <VisualizationCard
              visualization={message.visualizationData}
              messageId={message.id}
              isPinned={isPinned}
              onPin={onPinVisualization}
              onUnpin={onUnpinVisualization}
              onView={onViewVisualization}
            />
          )}
        </div>
      </div>
    </div>
  );
};
