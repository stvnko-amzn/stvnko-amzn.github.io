import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { VendorPerformance } from '../../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ComplianceDashboardProps {
  vendorData: VendorPerformance[];
  title: string;
  description?: string;
}

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ 
  vendorData, 
  title, 
  description 
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="visualization-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Performance Overview */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Vendor Performance Overview</h4>
          {vendorData.map((vendor) => (
            <div key={vendor.vendorId} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900">{vendor.vendorName}</h5>
                <div className={`flex items-center space-x-1 ${getTrendColor(vendor.performanceTrend)}`}>
                  {getTrendIcon(vendor.performanceTrend)}
                  <span className="text-sm capitalize">{vendor.performanceTrend}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Compliance Rate</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {vendor.compliancePercentage}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">On-Time Deliveries</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {vendor.onTimeDeliveries}/{vendor.totalShipments}
                  </div>
                </div>
              </div>
              
              {/* Compliance Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Delivery Window Compliance</span>
                  <span>{vendor.deliveryWindowCompliance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      vendor.deliveryWindowCompliance >= 90
                        ? 'bg-green-500'
                        : vendor.deliveryWindowCompliance >= 75
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${vendor.deliveryWindowCompliance}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Trend Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">6-Week Compliance Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="week"
                  tickFormatter={(value) => new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={[70, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value}%`, 'Compliance']}
                />
                {vendorData.map((vendor, index) => (
                  <Line
                    key={vendor.vendorId}
                    data={vendor.weeklyData}
                    type="monotone"
                    dataKey="compliance"
                    stroke={index === 0 ? '#3b82f6' : '#ef4444'}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name={vendor.vendorName}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium">Average Compliance</div>
          <div className="text-2xl font-bold text-blue-900">
            {Math.round(vendorData.reduce((acc, v) => acc + v.compliancePercentage, 0) / vendorData.length)}%
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-green-600 text-sm font-medium">Total Shipments</div>
          <div className="text-2xl font-bold text-green-900">
            {vendorData.reduce((acc, v) => acc + v.totalShipments, 0)}
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-orange-600 text-sm font-medium">On-Time Rate</div>
          <div className="text-2xl font-bold text-orange-900">
            {Math.round(
              (vendorData.reduce((acc, v) => acc + v.onTimeDeliveries, 0) /
               vendorData.reduce((acc, v) => acc + v.totalShipments, 0)) * 100
            )}%
          </div>
        </div>
      </div>
    </div>
  );
};
