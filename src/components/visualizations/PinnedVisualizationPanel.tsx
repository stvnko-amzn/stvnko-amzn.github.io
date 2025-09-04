import React from 'react';
import { PinnedVisualization, VisualizationData } from '../../types';
import { VisualizationTabs } from './VisualizationTabs';
import { VisualizationEmptyState } from './VisualizationEmptyState';
import { NetworkMap } from './NetworkMap';
import { ShipmentTimeline } from './ShipmentTimeline';
import { ComplianceDashboard } from './ComplianceDashboard';
import { TrailerYardView } from './TrailerYardView';
import { LogisticsDashboard } from './LogisticsDashboard';
import MilestoneTimeline from './MilestoneTimeline';
import FCInboundDashboard from './FCInboundDashboard';
import VendorTrending from './VendorTrending';
import RealTimeLocation from './RealTimeLocation';

interface PinnedVisualizationPanelProps {
  pinnedVisualizations: PinnedVisualization[];
  activeTabId: string | null;
  onTabSelect: (tabId: string | null) => void;
  onTabClose: (tabId: string) => void;
  onActionClick?: (actionId: string, data?: any) => void;
}

export const PinnedVisualizationPanel: React.FC<PinnedVisualizationPanelProps> = ({
  pinnedVisualizations,
  activeTabId,
  onTabSelect,
  onTabClose,
  onActionClick
}) => {
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
      case 'logistics-dashboard':
        return (
          <LogisticsDashboard
            data={vizData.data}
            title={vizData.title}
            description={vizData.description}
          />
        );
      case 'milestone-timeline':
        return (
          <MilestoneTimeline
            milestones={vizData.data.milestones}
            shipmentId={vizData.data.shipmentId}
            onActionClick={onActionClick}
          />
        );
      case 'fc-inbound-dashboard':
        return (
          <FCInboundDashboard
            data={vizData.data}
            onActionClick={onActionClick}
          />
        );
      case 'vendor-trending':
        return (
          <VendorTrending
            data={vizData.data}
            onActionClick={onActionClick}
          />
        );
      case 'real-time-location':
        return (
          <RealTimeLocation
            data={vizData.data}
            onActionClick={onActionClick}
          />
        );
      default:
        return null;
    }
  };

  const getActiveVisualization = () => {
    if (!activeTabId) return null;
    return pinnedVisualizations.find(pinned => pinned.id === activeTabId);
  };

  const activeVisualization = getActiveVisualization();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Visualizations</h2>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0">
        <VisualizationTabs
          pinnedVisualizations={pinnedVisualizations}
          activeTabId={activeTabId}
          onTabSelect={onTabSelect}
          onTabClose={onTabClose}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeVisualization ? (
          <div className="p-6">
            {renderVisualization(activeVisualization.data)}
          </div>
        ) : (
          <VisualizationEmptyState />
        )}
      </div>
    </div>
  );
};
