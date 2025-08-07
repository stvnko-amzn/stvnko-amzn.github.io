import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="chat-message assistant animate-fade-in">
      <div className="typing-indicator">
        <span className="text-sm text-gray-500 mr-2">ATLAS is thinking</span>
        <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
        <div className="typing-dot" style={{ animationDelay: '150ms' }}></div>
        <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};
