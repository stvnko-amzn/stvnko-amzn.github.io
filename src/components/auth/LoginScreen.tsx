import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Building2, Users, TrendingUp, MapPin } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const roleConfig = {
  'site-leader': {
    icon: Building2,
    title: 'Site Leader',
    description: 'Manage trailer operations and facility capacity',
    permissions: ['view-trailers', 'manage-yard', 'view-capacity']
  },
  'retail-employee': {
    icon: Users,
    title: 'Retail Employee',
    description: 'Track ASINs and monitor purchase orders',
    permissions: ['track-asins', 'view-pos', 'view-inventory']
  },
  'vendor-performance': {
    icon: TrendingUp,
    title: 'Vendor Performance Team',
    description: 'Analyze vendor compliance and performance metrics',
    permissions: ['view-vendor-metrics', 'analyze-compliance', 'generate-reports']
  },
  'ipex-team': {
    icon: MapPin,
    title: 'IPEX Team',
    description: 'Track shipment locations and routes',
    permissions: ['track-shipments', 'view-routes', 'monitor-locations']
  }
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const handleRoleSelect = async (role: UserRole) => {
    setLoadingRole(role);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: 'user-123',
      name: 'John Smith',
      email: 'jsmith@amazon.com',
      role: role,
      permissions: roleConfig[role].permissions
    };
    
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amazon-blue to-amazon-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amazon-blue rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            🌐
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ATLAS</h1>
          <p className="text-gray-600">Supply Chain Intelligence Platform</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              🔒 Simulated Amazon SSO Authentication
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Select Your Role to Continue
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(roleConfig).map(([role, config]) => {
              const Icon = config.icon;
              const isLoading = loadingRole === role;
              
              return (
                <div
                  key={role}
                  onClick={() => !loadingRole && handleRoleSelect(role as UserRole)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isLoading
                      ? 'border-amazon-orange bg-orange-50'
                      : 'border-gray-200 hover:border-amazon-orange hover:bg-orange-50'
                  } ${loadingRole && loadingRole !== role ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      isLoading ? 'bg-amazon-orange text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isLoading ? (
                        <div className="loading-spinner w-6 h-6"></div>
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {config.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {config.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {config.permissions.slice(0, 2).map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {permission.replace('-', ' ')}
                          </span>
                        ))}
                        {config.permissions.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{config.permissions.length - 2} more
                          </span>
                        )}
                      </div>
                      {isLoading && (
                        <div className="mt-2 text-sm text-amazon-orange font-medium">
                          Signing you in...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            This is a prototype interface. No real authentication is performed.
          </p>
        </div>
      </div>
    </div>
  );
};
