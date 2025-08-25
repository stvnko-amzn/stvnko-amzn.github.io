import React, { useState, useRef, useEffect } from 'react';
import { Message, User, ConversationContext, VisualizationData } from '../../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { QuerySuggestions } from './QuerySuggestions';
import { Send, Mic } from 'lucide-react';

interface ChatInterfaceProps {
  user: User;
  messages: Message[];
  isTyping: boolean;
  context: ConversationContext;
  pinnedMessageIds: Set<string>;
  onSendMessage: (message: string) => void;
  onPinVisualization: (messageId: string, visualization: VisualizationData) => void;
  onUnpinVisualization: (messageId: string) => void;
  onViewVisualization: (messageId: string, visualization: VisualizationData) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  user,
  messages,
  isTyping,
  context,
  pinnedMessageIds,
  onSendMessage,
  onPinVisualization,
  onUnpinVisualization,
  onViewVisualization
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleSuggestionSelect = (query: string) => {
    setInputValue(query);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Context Bar */}
      {(context.currentFC || context.timeframe || context.asin) && (
        <div className="bg-blue-50 border-b border-blue-200 p-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-blue-700 font-medium">Current Context:</span>
            {context.currentFC && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                FC: {context.currentFC}
              </span>
            )}
            {context.timeframe && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Time: {context.timeframe}
              </span>
            )}
            {context.asin && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                ASIN: {context.asin}
              </span>
            )}
            {context.vendor && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Vendor: {context.vendor}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 chat-container">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-amazon-blue rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🌐
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to ATLAS
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Your AI-powered supply chain intelligence assistant. Ask me anything about 
              trailers, shipments, inventory, or vendor performance.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                isPinned={pinnedMessageIds.has(message.id)}
                onPinVisualization={onPinVisualization}
                onUnpinVisualization={onUnpinVisualization}
                onViewVisualization={onViewVisualization}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask ATLAS about your supply chain..."
              className="input-field resize-none"
              disabled={isTyping}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              className="btn-secondary p-3"
              title="Voice input (coming soon)"
              disabled
            >
              <Mic className="w-5 h-5" />
            </button>
            
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className={`btn-primary p-3 ${
                !inputValue.trim() || isTyping
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-lg'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          ATLAS can make mistakes. Verify important information with your team.
        </div>
      </div>

      {/* Persistent Quick Actions */}
      <QuerySuggestions 
        userRole={user.role} 
        onSelectQuery={handleSuggestionSelect}
      />
    </div>
  );
};
