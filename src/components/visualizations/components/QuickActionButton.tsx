import React, { useState } from 'react';
import { InteractiveAction } from '../../../types';

interface QuickActionButtonProps {
  action: InteractiveAction;
  onAction: (actionId: string, data?: any) => void;
  disabled?: boolean;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  action,
  onAction,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    if (action.requiresConfirmation && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setIsLoading(true);
    try {
      await onAction(action.id, action.data);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    if (disabled || isLoading) {
      return `${baseStyles} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }

    switch (action.type) {
      case 'primary':
        return `${baseStyles} bg-amazon-blue text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm`;
      case 'secondary':
        return `${baseStyles} bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300`;
      case 'warning':
        return `${baseStyles} bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500 border border-yellow-300`;
      case 'success':
        return `${baseStyles} bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500 border border-green-300`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500`;
    }
  };

  if (showConfirmation) {
    return (
      <div className="inline-flex items-center space-x-2">
        <span className="text-sm text-gray-600">Confirm action?</span>
        <button
          onClick={handleClick}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Yes
        </button>
        <button
          onClick={handleCancel}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={getButtonStyles()}
      title={action.label}
    >
      {action.icon && (
        <span className="mr-2 text-base" role="img" aria-label={action.label}>
          {action.icon}
        </span>
      )}
      <span>{isLoading ? 'Processing...' : action.label}</span>
      {isLoading && (
        <svg
          className="ml-2 -mr-1 w-4 h-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
    </button>
  );
};
