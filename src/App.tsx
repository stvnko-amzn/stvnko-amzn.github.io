import { useState, useCallback } from 'react';
import { User, Message, ConversationContext, VisualizationData, PinnedVisualization } from './types';
import { LoginScreen } from './components/auth/LoginScreen';
import { ChatInterface } from './components/chat/ChatInterface';
import { PinnedVisualizationPanel } from './components/visualizations/PinnedVisualizationPanel';
import { queryProcessor } from './services/queryProcessor';
import { LogOut, User as UserIcon } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ConversationContext>({});
  const [pinnedVisualizations, setPinnedVisualizations] = useState<PinnedVisualization[]>([]);
  const [activeVisualizationTab, setActiveVisualizationTab] = useState<string | null>(null);

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setMessages([]);
    setContext({});
    setPinnedVisualizations([]);
    setActiveVisualizationTab(null);
  }, []);

  const generateMessageId = () => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const generatePinnedId = () => {
    return `pinned-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

      // Auto-pin new visualizations
      if (response.visualization) {
        const pinnedVisualization: PinnedVisualization = {
          id: generatePinnedId(),
          title: response.visualization.title,
          data: response.visualization,
          messageId: assistantMessage.id,
          timestamp: new Date()
        };

        setPinnedVisualizations(prev => {
          // Limit to 5 pinned visualizations, remove oldest if needed
          const updated = [...prev, pinnedVisualization];
          return updated.length > 5 ? updated.slice(1) : updated;
        });

        // Set as active tab
        setActiveVisualizationTab(pinnedVisualization.id);
      }

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

  const handlePinVisualization = useCallback((messageId: string, visualization: VisualizationData) => {
    const pinnedVisualization: PinnedVisualization = {
      id: generatePinnedId(),
      title: visualization.title,
      data: visualization,
      messageId,
      timestamp: new Date()
    };

    setPinnedVisualizations(prev => {
      // Check if already pinned
      if (prev.some(p => p.messageId === messageId)) return prev;
      
      // Limit to 5 pinned visualizations
      const updated = [...prev, pinnedVisualization];
      return updated.length > 5 ? updated.slice(1) : updated;
    });

    // Set as active tab
    setActiveVisualizationTab(pinnedVisualization.id);
  }, []);

  const handleUnpinVisualization = useCallback((messageId: string) => {
    setPinnedVisualizations(prev => {
      const updated = prev.filter(p => p.messageId !== messageId);
      
      // If the unpinned visualization was active, switch to overview
      const unpinnedVisualization = prev.find(p => p.messageId === messageId);
      if (unpinnedVisualization && activeVisualizationTab === unpinnedVisualization.id) {
        setActiveVisualizationTab(null);
      }
      
      return updated;
    });
  }, [activeVisualizationTab]);

  const handleViewVisualization = useCallback((messageId: string, visualization: VisualizationData) => {
    // Find existing pinned visualization or create new one
    const existingPinned = pinnedVisualizations.find(p => p.messageId === messageId);
    
    if (existingPinned) {
      setActiveVisualizationTab(existingPinned.id);
    } else {
      // Auto-pin and view
      handlePinVisualization(messageId, visualization);
    }
  }, [pinnedVisualizations, handlePinVisualization]);

  const handleTabSelect = useCallback((tabId: string | null) => {
    setActiveVisualizationTab(tabId);
  }, []);

  const handleTabClose = useCallback((tabId: string) => {
    setPinnedVisualizations(prev => {
      const updated = prev.filter(p => p.id !== tabId);
      
      // If the closed tab was active, switch to overview
      if (activeVisualizationTab === tabId) {
        setActiveVisualizationTab(null);
      }
      
      return updated;
    });
  }, [activeVisualizationTab]);

  // Get set of pinned message IDs for the chat interface
  const pinnedMessageIds = new Set(pinnedVisualizations.map(p => p.messageId));

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

      {/* Main Content - Two Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-3/5 flex flex-col border-r border-gray-200">
          <ChatInterface
            user={user}
            messages={messages}
            isTyping={isTyping}
            context={context}
            pinnedMessageIds={pinnedMessageIds}
            onSendMessage={handleSendMessage}
            onPinVisualization={handlePinVisualization}
            onUnpinVisualization={handleUnpinVisualization}
            onViewVisualization={handleViewVisualization}
          />
        </div>

        {/* Visualization Panel */}
        <div className="w-2/5 flex flex-col">
          <PinnedVisualizationPanel
            pinnedVisualizations={pinnedVisualizations}
            activeTabId={activeVisualizationTab}
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
          />
        </div>
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
