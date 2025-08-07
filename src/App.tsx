import React, { useState, useCallback } from 'react';
import { User, Message, ConversationContext, VisualizationData } from './types';
import { LoginScreen } from './components/auth/LoginScreen';
import { ChatInterface } from './components/chat/ChatInterface';
import { NetworkMap } from './components/visualizations/NetworkMap';
import { ShipmentTimeline } from './components/visualizations/ShipmentTimeline';
import { ComplianceDashboard } from './components/visualizations/ComplianceDashboard';
import { TrailerYardView } from './components/visualizations/TrailerYardView';
import { queryProcessor } from './services/queryProcessor';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ConversationContext>({});
  const [currentVisualization, setCurrentVisualization] = useState<VisualizationData | null>(null);

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setMessages([]);
    setContext({});
    setCurrentVisualization(null);
  }, []);

  const generateMessageId = () => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSendMessage = useCallback(async (messageContent: string) => {
    if (!user) return;

    // Add user message
    const userMessage: Message = {
      id: generateMessageId(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Simulate realistic response time
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      // Process the query
      const response = await queryProcessor.processQuery(messageContent, user.role);
      
      // Update context if provided
      if (response.context) {
        const newContext = { ...context, ...response.context };
        setContext(newContext);
        queryProcessor.setContext(newContext);
      }

      // Update visualization if provided
      if (response.visualization) {
        setCurrentVisualization(response.visualization);
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: generateMessageId(),
        content: response.message,
        sender: 'assistant',
        timestamp: new Date(),
        type: response.visualization ? 'visualization' : 'text',
        visualizationData: response.visualization
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error processing query:', error);
      
      const errorMessage: Message = {
        id: generateMessageId(),
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [user, context]);

  const renderVisualization = (vizData: VisualizationData) => {
    switch (vizData.type) {
      case 'network-map':
        return (
          <NetworkMap
            trailers={vizData.data}
            title={vizData.title}
            description={vizData.description}
          />
        );
      case 'timeline':
        return (
          <ShipmentTimeline
            events={vizData.data}
            title={vizData.title}
            description={vizData.description}
          />
        );
      case 'compliance-dashboard':
        return (
          <ComplianceDashboard
            vendorData={vizData.data}
            title={vizData.title}
            description={vizData.description}
          />
        );
      case 'trailer-yard':
        return (
          <TrailerYardView
            trailers={vizData.data}
            title={vizData.title}
            description={vizData.description}
          />
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-amazon-blue rounded-full flex items-center justify-center text-lg">
              🌐
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ATLAS</h1>
              <p className="text-sm text-gray-600">Supply Chain Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <UserIcon className="w-4 h-4" />
              <span>{user.name}</span>
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {user.role.replace('-', ' ')}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatInterface
            user={user}
            messages={messages}
            isTyping={isTyping}
            context={context}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Visualization Panel */}
        {currentVisualization && (
          <div className="w-1/2 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Visualization</h2>
                <button
                  onClick={() => setCurrentVisualization(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              {renderVisualization(currentVisualization)}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            ATLAS UX V2 Prototype - Supply Chain Intelligence Platform
          </div>
          <div className="flex items-center space-x-4">
            <span>Connected to mock data sources</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
