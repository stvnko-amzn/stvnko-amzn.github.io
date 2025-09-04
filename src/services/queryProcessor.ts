import { 
  QueryResponse, 
  ConversationContext, 
  VisualizationData, 
  UserRole,
  ExtractedEntity,
  QueryIntent,
  InteractiveAction
} from '../types';
import { 
  mockTrailers, 
  mockVendorPerformance, 
  mockInventoryData, 
  mockCapacityData, 
  mockInventoryRisk, 
  mockLogisticsDashboardData,
  mockShipmentMilestones,
  mockFCInboundData,
  mockVendorTrendData,
  mockLocationTrackingData,
  mockInteractiveActions,
  enhancedSampleQueries
} from '../data/mockData';
import { generateMockTimeline } from '../components/visualizations/ShipmentTimeline';

export class QueryProcessor {
  private context: ConversationContext = {};

  setContext(newContext: Partial<ConversationContext>) {
    this.context = { ...this.context, ...newContext };
  }

  getContext(): ConversationContext {
    return this.context;
  }

  async processQuery(query: string, userRole: UserRole): Promise<QueryResponse> {
    const normalizedQuery = query.toLowerCase().trim();

    // Exact phrase matching for quick actions
    if (normalizedQuery.includes('trailers heading to fc sea4 in the next 72 hours') || 
        normalizedQuery.includes('trailers heading to fc sea4 in the next 24 hours')) {
      return this.handleTrailerQuery(normalizedQuery);
    }

    if (normalizedQuery.includes('which trailers in the yard need priority unloading')) {
      return this.handlePriorityUnloadingQuery();
    }

    if (normalizedQuery.includes('current capacity utilization')) {
      return this.handleCapacityUtilizationQuery(normalizedQuery);
    }

    if (normalizedQuery.includes('track asin') && normalizedQuery.includes('across all open pos')) {
      return this.handleASINTrackingQuery(normalizedQuery);
    }

    if (normalizedQuery.includes('status of po12345') || normalizedQuery.includes('what\'s the status of po')) {
      return this.handlePOStatusQuery(normalizedQuery);
    }

    if (normalizedQuery.includes('asins are at risk of stockout')) {
      return this.handleStockoutRiskQuery();
    }

    if (normalizedQuery.includes('delivery window compliance') && normalizedQuery.includes('over the last 6 weeks')) {
      return this.handleVendorPerformanceQuery(normalizedQuery);
    }

    if (normalizedQuery.includes('compare top 5 vendors by performance')) {
      return this.handleVendorComparisonQuery();
    }

    if (normalizedQuery.includes('vendors have declining performance trends')) {
      return this.handleDecliningVendorsQuery();
    }

    if (normalizedQuery.includes('where are all trailers carrying asin')) {
      return this.handleLocationQuery(normalizedQuery);
    }

    if (normalizedQuery.includes('show me the route for trailer')) {
      return this.handleRouteQuery(normalizedQuery);
    }

    if (normalizedQuery.includes('which shipments are experiencing delays')) {
      return this.handleDelayedShipmentsQuery();
    }

    // New user story queries
    if (normalizedQuery.includes('show me milestones for po') || normalizedQuery.includes('milestones for po')) {
      return this.handleMilestoneTrackingQuery(normalizedQuery);
    }

    if (normalizedQuery.includes('fc inbound dashboard') || normalizedQuery.includes('show me the fc inbound dashboard')) {
      return this.handleFCInboundDashboardQuery(normalizedQuery);
    }

    if (normalizedQuery.includes('vendor trending analysis') || normalizedQuery.includes('show me vendor trending')) {
      return this.handleVendorTrendingQuery(normalizedQuery);
    }

    if (normalizedQuery.includes('real-time tracking') || normalizedQuery.includes('display real-time tracking')) {
      return this.handleRealTimeTrackingQuery();
    }

    if (normalizedQuery.includes('which trailers contain high-priority items') || normalizedQuery.includes('high-priority items')) {
      return this.handleHighPriorityItemsQuery();
    }

    if (normalizedQuery.includes('what\'s the current yard capacity') || normalizedQuery.includes('yard capacity')) {
      return this.handleYardCapacityQuery(normalizedQuery);
    }

    // Dashboard queries
    if (normalizedQuery.includes('dashboard') || normalizedQuery.includes('overview') || 
        normalizedQuery.includes('show me the logistics dashboard')) {
      return this.handleLogisticsDashboardQuery();
    }

    // Legacy pattern matching for broader queries
    if (this.matchesPattern(normalizedQuery, ['trailers', 'heading', 'fc', 'sea4', '24 hours', '72 hours'])) {
      return this.handleTrailerQuery(normalizedQuery);
    }

    if (this.matchesPattern(normalizedQuery, ['track', 'asin']) || 
        this.matchesPattern(normalizedQuery, ['status', 'po'])) {
      return this.handleASINTrackingQuery(normalizedQuery);
    }

    if (this.matchesPattern(normalizedQuery, ['compliance', 'vendor', 'performance']) ||
        this.matchesPattern(normalizedQuery, ['delivery window', 'weeks'])) {
      return this.handleVendorPerformanceQuery(normalizedQuery);
    }

    if (this.matchesPattern(normalizedQuery, ['where', 'trailers', 'carrying', 'asin']) ||
        this.matchesPattern(normalizedQuery, ['route', 'trailer'])) {
      return this.handleLocationQuery(normalizedQuery);
    }

    // Handle follow-up questions
    if (this.matchesPattern(normalizedQuery, ['delayed', 'trailers']) && this.context.currentFC) {
      return this.handleDelayedTrailersQuery();
    }

    if (this.matchesPattern(normalizedQuery, ['high-demand', 'items']) && this.context.trailer) {
      return this.handleHighDemandItemsQuery();
    }

    // Default response for unrecognized queries
    return this.handleUnrecognizedQuery(normalizedQuery, userRole);
  }

  private matchesPattern(query: string, keywords: string[]): boolean {
    return keywords.some(keyword => query.includes(keyword.toLowerCase()));
  }

  private async handleTrailerQuery(query: string): Promise<QueryResponse> {
    // Simulate the exact dialogue from requirements
    if (query.includes('sea4') && (query.includes('24 hours') || query.includes('next'))) {
      this.setContext({ currentFC: 'SEA4', timeframe: 'next 24 hours' });
      
      const relevantTrailers = mockTrailers.filter(t => t.destination === 'SEA4');
      const checkedIn = relevantTrailers.filter(t => t.status === 'arrived').length;
      const enRoute = relevantTrailers.filter(t => t.status === 'en-route').length;
      const delayed = relevantTrailers.filter(t => t.status === 'delayed').length;

      const visualization: VisualizationData = {
        type: 'trailer-yard',
        data: relevantTrailers,
        title: 'Trailers for SEA4 - Next 24 Hours',
        description: 'Current status of all trailers scheduled to arrive at SEA4'
      };

      return {
        message: `I found ${relevantTrailers.length} trailers scheduled to arrive at SEA4 in the next 24 hours. Here's the breakdown:

${checkedIn} trailers checked in but not yet unloaded
${enRoute} trailers en route with an on-time status  
${delayed} trailers en route but delayed

Would you like to see details for all trailers or focus on a specific category?`,
        visualization,
        suggestedFollowUps: [
          'Show me the delayed trailers',
          'Which trailers need priority unloading?',
          'What are the delay reasons?'
        ],
        context: { currentFC: 'SEA4', timeframe: 'next 24 hours' }
      };
    }

    return {
      message: 'I can help you track trailers. Please specify the fulfillment center and timeframe you\'re interested in.',
      suggestedFollowUps: [
        'Show me all trailers heading to FC SEA4 in the next 24 hours',
        'Which trailers are delayed?',
        'What\'s the current yard capacity?'
      ]
    };
  }

  private async handleDelayedTrailersQuery(): Promise<QueryResponse> {
    const delayedTrailers = mockTrailers.filter(t => 
      t.destination === this.context.currentFC && t.status === 'delayed'
    );

    this.setContext({ trailer: 'T23456' }); // Set context for follow-up

    const visualization: VisualizationData = {
      type: 'network-map',
      data: delayedTrailers,
      title: 'Delayed Trailers - SEA4',
      description: 'Real-time locations of delayed trailers'
    };

    return {
      message: `Here are the ${delayedTrailers.length} delayed trailers:

Trailer ID: T12345 | Carrier: XYZ Logistics | Contents: Mixed (12 ASINs) | ETA: 3 hours behind schedule | Reason: Traffic delay on I-5

Trailer ID: T23456 | Carrier: ABC Transport | Contents: Electronics (8 ASINs) | ETA: 5 hours behind schedule | Reason: Mechanical issues

Trailer ID: T34567 | Carrier: Fast Freight | Contents: Apparel (15 ASINs) | ETA: 2 hours behind schedule | Reason: Delayed departure from origin

Based on CUT scores and contents, I recommend prioritizing T23456 upon arrival as it contains high-demand electronics items with low inventory levels at SEA4. Would you like more details about any of these trailers?`,
      visualization,
      suggestedFollowUps: [
        'What high-demand items are on T23456?',
        'Show me the route for T23456',
        'Notify the receiving team about T23456'
      ],
      context: { ...this.context, trailer: 'T23456' }
    };
  }

  private async handleHighDemandItemsQuery(): Promise<QueryResponse> {
    const trailer = mockTrailers.find(t => t.id === this.context.trailer);
    
    if (!trailer) {
      return {
        message: 'I need more context about which trailer you\'re asking about.',
        suggestedFollowUps: ['Show me delayed trailers first']
      };
    }

    return {
      message: `Trailer ${trailer.id} contains the following high-demand electronics items:

ASIN B07X2RJ3L9: Wireless Earbuds (120 units) - Current FC inventory: 35 units
ASIN B08F7N8LJ9: Smart Speaker (85 units) - Current FC inventory: 12 units  
ASIN B09D34GH7N: Tablet Computer (50 units) - Current FC inventory: 8 units

These items are flagged as high priority for Prime Day preparations. Would you like me to notify the receiving team about this trailer's contents?`,
      suggestedFollowUps: [
        'Notify the receiving team about this trailer',
        'Show me inventory levels for these ASINs',
        'What other trailers have these ASINs?'
      ]
    };
  }

  private async handleASINTrackingQuery(query: string): Promise<QueryResponse> {
    // Extract ASIN from query
    const asinMatch = query.match(/asin\s+([a-z0-9]+)/i) || query.match(/([b][0-9a-z]{9})/i);
    const asin = asinMatch ? asinMatch[1].toUpperCase() : 'B07X2RJ3L9';
    
    this.setContext({ asin });

    const timelineEvents = generateMockTimeline(asin);
    const visualization: VisualizationData = {
      type: 'timeline',
      data: timelineEvents,
      title: `ASIN ${asin} Journey Timeline`,
      description: 'Complete procure-to-stow timeline for this ASIN'
    };

    const inventoryInfo = mockInventoryData[asin as keyof typeof mockInventoryData];
    const productName = inventoryInfo?.name || 'Product';

    return {
      message: `Tracking ASIN ${asin} (${productName}) across all open POs:

**PO12345** - TechSupply Corp
• Quantity: 500 units
• Current Status: In Transit (Trailer T12345)
• Expected FC Arrival: 3 hours (delayed)
• Estimated Stow: 6 hours

**Current Inventory at SEA4:** ${inventoryInfo?.currentInventory || 0} units
**Priority Level:** ${inventoryInfo?.priority || 'medium'}

The shipment is currently delayed due to traffic on I-5 but should arrive within the delivery window.`,
      visualization,
      suggestedFollowUps: [
        'Where is trailer T12345 right now?',
        'What caused the delay?',
        'Show me other POs for this ASIN'
      ],
      context: { asin, currentFC: 'SEA4' }
    };
  }

  private async handleVendorPerformanceQuery(query: string): Promise<QueryResponse> {
    // Extract vendor name if mentioned
    const vendorMatch = query.match(/vendor\s+([a-z\s]+)/i);
    const vendorName = vendorMatch ? vendorMatch[1].trim() : 'TechSupply Corp';
    
    this.setContext({ vendor: vendorName });

    const visualization: VisualizationData = {
      type: 'compliance-dashboard',
      data: mockVendorPerformance,
      title: `Vendor Performance Analysis - Last 6 Weeks`,
      description: 'Delivery window compliance and performance trends'
    };

    const vendor = mockVendorPerformance.find(v => 
      v.vendorName.toLowerCase().includes(vendorName.toLowerCase())
    ) || mockVendorPerformance[0];

    return {
      message: `Delivery window compliance for ${vendor.vendorName} over the last 6 weeks:

**Overall Performance:**
• Compliance Rate: ${vendor.compliancePercentage}%
• Delivery Window Compliance: ${vendor.deliveryWindowCompliance}%
• On-Time Deliveries: ${vendor.onTimeDeliveries}/${vendor.totalShipments}
• Performance Trend: ${vendor.performanceTrend}

**Pattern Analysis:**
The vendor shows ${vendor.performanceTrend} performance with consistent delivery windows. Recent weeks show ${vendor.performanceTrend === 'improving' ? 'positive momentum' : vendor.performanceTrend === 'declining' ? 'concerning trends' : 'stable patterns'}.

**Recommendation:** ${vendor.performanceTrend === 'improving' ? 'Continue current partnership' : vendor.performanceTrend === 'declining' ? 'Schedule performance review' : 'Maintain current monitoring'}`,
      visualization,
      suggestedFollowUps: [
        'Compare this vendor to top 5 performers',
        'Show me recent delivery issues',
        'What\'s the industry benchmark?'
      ],
      context: { vendor: vendorName }
    };
  }

  private async handleLocationQuery(query: string): Promise<QueryResponse> {
    const asinMatch = query.match(/asin\s+([a-z0-9]+)/i) || query.match(/([b][0-9a-z]{9})/i);
    const asin = asinMatch ? asinMatch[1].toUpperCase() : 'B07X2RJ3L9';
    
    const trailersWithASIN = mockTrailers.filter(t => 
      t.contents.some(c => c.asin === asin)
    );

    const visualization: VisualizationData = {
      type: 'network-map',
      data: trailersWithASIN,
      title: `Trailers Carrying ASIN ${asin}`,
      description: 'Real-time locations and routes'
    };

    return {
      message: `Found ${trailersWithASIN.length} trailers currently carrying ASIN ${asin}:

${trailersWithASIN.map(t => 
  `**${t.id}** - ${t.carrier}
  • Location: ${t.currentLocation.address}
  • Status: ${t.status}
  • Destination: ${t.destination}
  • ETA: ${t.eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  • Quantity: ${t.contents.find(c => c.asin === asin)?.quantity || 0} units`
).join('\n\n')}

All trailers are being tracked in real-time with GPS monitoring.`,
      visualization,
      suggestedFollowUps: [
        'Show me the route for trailer T12345',
        'Which trailer will arrive first?',
        'Are there any delivery risks?'
      ],
      context: { asin }
    };
  }

  private async handlePriorityUnloadingQuery(): Promise<QueryResponse> {
    const arrivedTrailers = mockTrailers.filter(t => t.status === 'arrived');
    const priorityTrailers = arrivedTrailers.sort((a, b) => {
      const aPriority = a.priority === 'high' ? 3 : a.priority === 'medium' ? 2 : 1;
      const bPriority = b.priority === 'high' ? 3 : b.priority === 'medium' ? 2 : 1;
      return bPriority - aPriority;
    });

    const visualization: VisualizationData = {
      type: 'trailer-yard',
      data: priorityTrailers,
      title: 'Priority Unloading Queue',
      description: 'Trailers sorted by unloading priority based on contents and CUT scores'
    };

    return {
      message: `Found ${priorityTrailers.length} trailers in the yard requiring priority unloading:

**High Priority:**
${priorityTrailers.filter(t => t.priority === 'high').map(t => 
  `• Trailer ${t.id} - ${t.carrier} (${t.contents.length} ASINs, avg CUT score: ${Math.round(t.contents.reduce((sum, c) => sum + (c.cutScore || 0), 0) / t.contents.length)})`
).join('\n')}

**Medium Priority:**
${priorityTrailers.filter(t => t.priority === 'medium').map(t => 
  `• Trailer ${t.id} - ${t.carrier} (${t.contents.length} ASINs)`
).join('\n')}

Recommendation: Start with high-priority trailers containing electronics and high CUT score items.`,
      visualization,
      suggestedFollowUps: [
        'Show me contents of trailer T56789',
        'What\'s the current dock availability?',
        'Assign dock 3 to trailer T56789'
      ]
    };
  }

  private async handleCapacityUtilizationQuery(query: string): Promise<QueryResponse> {
    const fcMatch = query.match(/fc\s+([a-z0-9]+)/i);
    const fc = fcMatch ? fcMatch[1].toUpperCase() : 'LAX7';
    
    const capacityInfo = mockCapacityData[fc as keyof typeof mockCapacityData];
    
    if (!capacityInfo) {
      return {
        message: `I don't have capacity data for FC ${fc}. Available FCs: SEA4, LAX7`,
        suggestedFollowUps: [
          'What\'s the current capacity utilization at FC SEA4?',
          'Show me dock availability at LAX7'
        ]
      };
    }

    const utilizationPercentage = Math.round(((capacityInfo.totalDocks - capacityInfo.availableDocks) / capacityInfo.totalDocks) * 100);

    return {
      message: `Current capacity utilization for FC ${fc}:

**Dock Utilization:** ${utilizationPercentage}% (${capacityInfo.totalDocks - capacityInfo.availableDocks}/${capacityInfo.totalDocks} docks occupied)
**Available Docks:** ${capacityInfo.availableDocks}
**Processing Rate:** ${capacityInfo.processingRate}% efficiency
**Queue Length:** ${capacityInfo.queueLength} trailers waiting
**Average Unload Time:** ${capacityInfo.averageUnloadTime} minutes
**Trend:** ${capacityInfo.utilizationTrend}

${utilizationPercentage > 90 ? '⚠️ **Alert:** Capacity is near maximum. Consider redirecting non-critical shipments.' : 
  utilizationPercentage > 75 ? '⚡ **Status:** High utilization. Monitor closely for bottlenecks.' : 
  '✅ **Status:** Normal capacity levels.'}`,
      suggestedFollowUps: [
        'Show me the trailer queue for LAX7',
        'Which trailers can be redirected?',
        'What\'s the forecast for tomorrow?'
      ]
    };
  }

  private async handlePOStatusQuery(query: string): Promise<QueryResponse> {
    const poMatch = query.match(/po(\d+)/i);
    const poId = poMatch ? `PO${poMatch[1]}` : 'PO12345';
    
    this.setContext({ po: poId });

    const timelineEvents = generateMockTimeline('B07X2RJ3L9');
    const visualization: VisualizationData = {
      type: 'timeline',
      data: timelineEvents,
      title: `${poId} Status Timeline`,
      description: 'Complete purchase order journey from creation to stow'
    };

    return {
      message: `Status update for ${poId}:

**Purchase Order Details:**
• Vendor: TechSupply Corp
• Total Quantity: 500 units (3 ASINs)
• Order Value: $47,500
• Created: Feb 10, 2024

**Current Status:** In Transit
• Shipment departed vendor facility: Feb 14, 2024
• Current location: Trailer T12345 on I-5 near Seattle
• Expected FC arrival: 3 hours (delayed due to traffic)
• Estimated stow completion: 6 hours

**ASINs in this PO:**
• B07X2RJ3L9: Wireless Earbuds (200 units)
• B08F7N8LJ9: Smart Speaker (200 units)
• B09D34GH7N: Tablet Computer (100 units)

The shipment is currently delayed but expected to arrive within the delivery window.`,
      visualization,
      suggestedFollowUps: [
        'Where is trailer T12345 right now?',
        'What caused the delay?',
        'Show me other POs from TechSupply Corp'
      ],
      context: { po: poId, currentFC: 'SEA4' }
    };
  }

  private async handleStockoutRiskQuery(): Promise<QueryResponse> {
    const riskItems = mockInventoryRisk.sort((a, b) => {
      const riskOrder = { 'critical': 3, 'high': 2, 'medium': 1, 'low': 0 };
      return (riskOrder[b.riskLevel as keyof typeof riskOrder] || 0) - (riskOrder[a.riskLevel as keyof typeof riskOrder] || 0);
    });

    return {
      message: `Found ${riskItems.length} ASINs at risk of stockout this week:

**Critical Risk (< 2 days supply):**
${riskItems.filter(item => item.riskLevel === 'critical').map(item => 
  `• ${item.asin}: ${item.name}
    Current Stock: ${item.currentStock} units | Daily Demand: ${item.dailyDemand} units
    Days of Supply: ${item.daysOfSupply} days | Incoming: ${item.incomingShipments} units`
).join('\n\n')}

**High Risk (< 3 days supply):**
${riskItems.filter(item => item.riskLevel === 'high').map(item => 
  `• ${item.asin}: ${item.name}
    Current Stock: ${item.currentStock} units | Days of Supply: ${item.daysOfSupply} days`
).join('\n\n')}

**Recommendations:**
1. Expedite incoming shipments for critical items
2. Consider emergency procurement for B08F7N8LJ9 and B09D34GH7N
3. Monitor B07X2RJ3L9 closely as it approaches reorder point`,
      suggestedFollowUps: [
        'Show me incoming shipments for these ASINs',
        'Which vendors can provide emergency stock?',
        'Create reorder alerts for critical items'
      ]
    };
  }

  private async handleVendorComparisonQuery(): Promise<QueryResponse> {
    const topVendors = [
      ...mockVendorPerformance,
      {
        vendorId: 'V003',
        vendorName: 'FastShip Logistics',
        compliancePercentage: 95,
        deliveryWindowCompliance: 96,
        totalShipments: 156,
        onTimeDeliveries: 149,
        performanceTrend: 'stable' as const,
        weeklyData: []
      },
      {
        vendorId: 'V004',
        vendorName: 'Prime Suppliers Inc',
        compliancePercentage: 91,
        deliveryWindowCompliance: 93,
        totalShipments: 203,
        onTimeDeliveries: 189,
        performanceTrend: 'improving' as const,
        weeklyData: []
      },
      {
        vendorId: 'V005',
        vendorName: 'Reliable Freight Co',
        compliancePercentage: 88,
        deliveryWindowCompliance: 90,
        totalShipments: 178,
        onTimeDeliveries: 160,
        performanceTrend: 'declining' as const,
        weeklyData: []
      }
    ].sort((a, b) => b.compliancePercentage - a.compliancePercentage).slice(0, 5);

    const visualization: VisualizationData = {
      type: 'compliance-dashboard',
      data: topVendors,
      title: 'Top 5 Vendor Performance Comparison',
      description: 'Ranked by overall compliance percentage'
    };

    return {
      message: `Top 5 vendor performance comparison (last 6 weeks):

**1. FastShip Logistics** - 95% compliance
• Delivery Window: 96% | On-Time: 149/156 shipments
• Trend: Stable | Status: ⭐ Top Performer

**2. Global Electronics Ltd** - 92% compliance  
• Delivery Window: 94% | On-Time: 178/189 shipments
• Trend: Stable | Status: ✅ Excellent

**3. Prime Suppliers Inc** - 91% compliance
• Delivery Window: 93% | On-Time: 189/203 shipments  
• Trend: Improving | Status: ⬆️ Rising Star

**4. Reliable Freight Co** - 88% compliance
• Delivery Window: 90% | On-Time: 160/178 shipments
• Trend: Declining | Status: ⚠️ Needs Attention

**5. TechSupply Corp** - 87% compliance
• Delivery Window: 89% | On-Time: 218/245 shipments
• Trend: Improving | Status: ⬆️ Getting Better

**Industry Benchmark:** 90% compliance`,
      visualization,
      suggestedFollowUps: [
        'Show me FastShip Logistics detailed metrics',
        'What\'s causing Reliable Freight Co\'s decline?',
        'Schedule performance review with bottom performers'
      ]
    };
  }

  private async handleDecliningVendorsQuery(): Promise<QueryResponse> {
    const decliningVendors = [
      {
        vendorId: 'V005',
        vendorName: 'Reliable Freight Co',
        compliancePercentage: 88,
        deliveryWindowCompliance: 90,
        totalShipments: 178,
        onTimeDeliveries: 160,
        performanceTrend: 'declining' as const,
        declineRate: -8,
        issuesSummary: 'Increased delays due to driver shortages'
      },
      {
        vendorId: 'V006',
        vendorName: 'Budget Logistics',
        compliancePercentage: 82,
        deliveryWindowCompliance: 85,
        totalShipments: 134,
        onTimeDeliveries: 110,
        performanceTrend: 'declining' as const,
        declineRate: -12,
        issuesSummary: 'Equipment maintenance issues affecting delivery times'
      }
    ];

    const visualization: VisualizationData = {
      type: 'compliance-dashboard',
      data: decliningVendors,
      title: 'Vendors with Declining Performance Trends',
      description: 'Vendors showing negative performance trends requiring attention'
    };

    return {
      message: `Found ${decliningVendors.length} vendors with declining performance trends:

**Reliable Freight Co** - 88% compliance (↓8% decline)
• Current Performance: 160/178 on-time deliveries (90%)
• Primary Issues: Driver shortages causing increased delays
• Recommendation: Schedule immediate performance review
• Risk Level: Medium

**Budget Logistics** - 82% compliance (↓12% decline)  
• Current Performance: 110/134 on-time deliveries (85%)
• Primary Issues: Equipment maintenance affecting delivery times
• Recommendation: Consider alternative vendors for critical shipments
• Risk Level: High

**Action Items:**
1. Schedule performance reviews with both vendors within 2 weeks
2. Request improvement plans with specific timelines
3. Identify backup vendors for critical routes
4. Consider penalty clauses for continued poor performance`,
      visualization,
      suggestedFollowUps: [
        'Show me alternative vendors for these routes',
        'Schedule performance review meetings',
        'What\'s the impact on our delivery commitments?'
      ]
    };
  }

  private async handleRouteQuery(query: string): Promise<QueryResponse> {
    const trailerMatch = query.match(/trailer\s+([a-z0-9]+)/i);
    const trailerId = trailerMatch ? trailerMatch[1].toUpperCase() : 'T12345';
    
    const trailer = mockTrailers.find(t => t.id === trailerId);
    
    if (!trailer) {
      return {
        message: `I couldn't find trailer ${trailerId}. Available trailers: ${mockTrailers.map(t => t.id).join(', ')}`,
        suggestedFollowUps: [
          'Show me the route for trailer T12345',
          'Which trailers are currently en route?'
        ]
      };
    }

    const visualization: VisualizationData = {
      type: 'network-map',
      data: [trailer],
      title: `Route for Trailer ${trailerId}`,
      description: 'Real-time GPS tracking with planned route and current position'
    };

    return {
      message: `Route details for Trailer ${trailerId}:

**Current Status:** ${trailer.status}
**Carrier:** ${trailer.carrier}
**Current Location:** ${trailer.currentLocation.address}
**Destination:** ${trailer.destination}
**ETA:** ${trailer.eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

**Route Information:**
• Origin: Tacoma, WA (TechSupply Corp Warehouse)
• Waypoint: Renton, WA (Rest stop completed)
• Current: I-5 near Seattle, WA
• Destination: SEA4 Fulfillment Center

**Distance Remaining:** ~15 miles
**Estimated Travel Time:** 45 minutes (normal traffic)
${trailer.status === 'delayed' ? `**Delay Reason:** ${trailer.delayReason}` : ''}

The trailer is being tracked in real-time with GPS monitoring and will send automatic updates upon arrival.`,
      visualization,
      suggestedFollowUps: [
        'What\'s the traffic situation on this route?',
        'Notify SEA4 receiving team of ETA',
        'Show me other trailers on similar routes'
      ],
      context: { trailer: trailerId }
    };
  }

  private async handleDelayedShipmentsQuery(): Promise<QueryResponse> {
    const delayedTrailers = mockTrailers.filter(t => t.status === 'delayed');
    
    const visualization: VisualizationData = {
      type: 'network-map',
      data: delayedTrailers,
      title: 'All Delayed Shipments',
      description: 'Real-time view of all shipments experiencing delays'
    };

    return {
      message: `Found ${delayedTrailers.length} shipments currently experiencing delays:

${delayedTrailers.map(trailer => 
  `**Trailer ${trailer.id}** - ${trailer.carrier}
  • Current Location: ${trailer.currentLocation.address}
  • Destination: ${trailer.destination}
  • Delay: ${Math.round((trailer.eta.getTime() - Date.now()) / (1000 * 60 * 60))} hours behind schedule
  • Reason: ${trailer.delayReason}
  • Contents: ${trailer.contents.length} ASINs (${trailer.contents.reduce((sum, c) => sum + c.quantity, 0)} units)
  • Priority: ${trailer.priority}`
).join('\n\n')}

**Impact Analysis:**
• Total delayed units: ${delayedTrailers.reduce((sum, t) => sum + t.contents.reduce((s, c) => s + c.quantity, 0), 0)}
• High-priority shipments affected: ${delayedTrailers.filter(t => t.priority === 'high').length}
• Average delay: ${Math.round(delayedTrailers.reduce((sum, t) => sum + (t.eta.getTime() - Date.now()), 0) / (delayedTrailers.length * 1000 * 60 * 60))} hours

**Recommendations:**
1. Prioritize T23456 (electronics, high CUT scores)
2. Notify customers of potential delivery impacts
3. Consider expedited processing for delayed high-priority items`,
      visualization,
      suggestedFollowUps: [
        'Show me customer impact for these delays',
        'Which delays can be recovered?',
        'Escalate critical shipments to operations team'
      ]
    };
  }

  private async handleLogisticsDashboardQuery(): Promise<QueryResponse> {
    const visualization: VisualizationData = {
      type: 'logistics-dashboard',
      data: mockLogisticsDashboardData,
      title: 'Logistics Operations Dashboard',
      description: 'Comprehensive overview of shipment metrics, activity trends, and operational status'
    };

    return {
      message: `Here's your comprehensive logistics dashboard overview:

**Key Metrics Summary:**
• Total Shipments: ${mockLogisticsDashboardData.metrics.totalShipments.value} (${mockLogisticsDashboardData.metrics.totalShipments.trend.direction === 'up' ? '↗️' : '↘️'} ${mockLogisticsDashboardData.metrics.totalShipments.trend.percentage}% ${mockLogisticsDashboardData.metrics.totalShipments.trend.period})
• Completed: ${mockLogisticsDashboardData.metrics.completed.value} shipments
• Pending: ${mockLogisticsDashboardData.metrics.pending.value} shipments  
• Delayed: ${mockLogisticsDashboardData.metrics.delayed.value} shipments

**Current Status:**
• ${mockLogisticsDashboardData.trailerStatus.byStatus['en-route']} trailers en route
• ${mockLogisticsDashboardData.trailerStatus.byStatus.arrived} trailers arrived
• ${mockLogisticsDashboardData.trailerStatus.byStatus.delayed} trailers delayed

The dashboard shows shipment activity trends over the last 12 weeks and recent shipment details. Use this overview to monitor operational performance and identify areas requiring attention.`,
      visualization,
      suggestedFollowUps: [
        'Show me details about delayed shipments',
        'Which trailers need priority unloading?',
        'What\'s causing the recent delays?'
      ]
    };
  }

  // New handler methods for enhanced user stories
  private async handleMilestoneTrackingQuery(query: string): Promise<QueryResponse> {
    const poMatch = query.match(/po\s*(\d+)/i);
    const poId = poMatch ? `PO${poMatch[1]}` : 'PO12345';
    
    const milestoneData = mockShipmentMilestones.find(m => m.poId === poId) || mockShipmentMilestones[0];
    
    const visualization: VisualizationData = {
      type: 'milestone-timeline',
      data: milestoneData,
      title: `Milestone Tracking - ${poId}`,
      description: 'Planned vs actual milestone completion with variance analysis',
      interactiveActions: [
        mockInteractiveActions.find(a => a.id === 'expedite-shipment')!,
        mockInteractiveActions.find(a => a.id === 'create-alert')!
      ]
    };

    const completedMilestones = milestoneData.milestones.filter(m => m.status === 'completed').length;
    const delayedMilestones = milestoneData.milestones.filter(m => m.status === 'delayed').length;
    const totalVariance = milestoneData.milestones
      .filter(m => m.variance)
      .reduce((sum, m) => sum + (m.variance || 0), 0);

    return {
      message: `Milestone tracking for ${poId}:

**Overall Status:** ${milestoneData.overallStatus.toUpperCase()}
**Progress:** ${completedMilestones}/${milestoneData.milestones.length} milestones completed
**Delayed Milestones:** ${delayedMilestones}
**Total Variance:** ${totalVariance.toFixed(1)} hours

**Key Milestones:**
${milestoneData.milestones.map(m => 
  `• **${m.name}** (${m.status})
    Planned: ${m.plannedDate.toLocaleDateString()} ${m.plannedDate.toLocaleTimeString()}
    ${m.actualDate ? `Actual: ${m.actualDate.toLocaleDateString()} ${m.actualDate.toLocaleTimeString()}` : 'Not completed'}
    ${m.variance ? `Variance: ${m.variance > 0 ? '+' : ''}${m.variance} hours` : ''}
    Owner: ${m.owner}`
).join('\n\n')}

**Critical Path Impact:** ${milestoneData.overallStatus === 'delayed' ? 'Delays affecting downstream milestones' : 'On track for delivery window'}`,
      visualization,
      suggestedFollowUps: [
        'What caused the delays in this shipment?',
        'Show me other POs from this vendor',
        'Expedite remaining milestones'
      ],
      context: { po: poId }
    };
  }

  private async handleFCInboundDashboardQuery(query: string): Promise<QueryResponse> {
    const fcMatch = query.match(/fc\s+([a-z0-9]+)/i);
    const fc = fcMatch ? fcMatch[1].toUpperCase() : 'SEA4';
    
    const inboundData = mockFCInboundData; // Using SEA4 data as default
    
    const visualization: VisualizationData = {
      type: 'fc-inbound-dashboard',
      data: inboundData,
      title: `FC ${fc} Inbound Operations Dashboard`,
      description: 'Real-time yard management with dock utilization and trailer prioritization',
      interactiveActions: [
        mockInteractiveActions.find(a => a.id === 'assign-dock')!,
        mockInteractiveActions.find(a => a.id === 'notify-receiving')!,
        mockInteractiveActions.find(a => a.id === 'redirect-trailer')!
      ]
    };

    const availableDocks = inboundData.dockUtilization.filter(d => d.status === 'available').length;
    const occupiedDocks = inboundData.dockUtilization.filter(d => d.status === 'occupied').length;
    const maintenanceDocks = inboundData.dockUtilization.filter(d => d.status === 'maintenance').length;
    
    const highPriorityTrailers = inboundData.trailers.filter(t => t.priorityScore > 85).length;
    const avgDwellTime = inboundData.trailers.reduce((sum, t) => sum + t.dwellTime, 0) / inboundData.trailers.length;

    return {
      message: `FC ${fc} Inbound Operations Dashboard:

**Dock Status:**
• Available: ${availableDocks} docks
• Occupied: ${occupiedDocks} docks  
• Maintenance: ${maintenanceDocks} docks
• Utilization: ${inboundData.capacityMetrics.utilizationPercentage}%

**Yard Overview:**
• Total Spots: ${inboundData.yardMap.totalSpots}
• Occupied: ${inboundData.yardMap.occupiedSpots} (${Math.round((inboundData.yardMap.occupiedSpots / inboundData.yardMap.totalSpots) * 100)}%)
• Trailers in Queue: ${inboundData.capacityMetrics.queueLength}

**Priority Analysis:**
• High Priority Trailers: ${highPriorityTrailers}
• Average Dwell Time: ${avgDwellTime.toFixed(1)} hours
• Processing Rate: ${inboundData.capacityMetrics.processingRate}%

**Recommendations:**
${inboundData.capacityMetrics.utilizationPercentage > 85 ? '⚠️ High utilization - consider redirecting non-critical shipments' : '✅ Normal operations'}
${avgDwellTime > 4 ? '⚡ Long dwell times detected - prioritize unloading' : ''}`,
      visualization,
      suggestedFollowUps: [
        'Show me high priority trailers in the yard',
        'Which docks are available for assignment?',
        'What\'s the forecast for tomorrow?'
      ],
      context: { currentFC: fc }
    };
  }

  private async handleVendorTrendingQuery(query: string): Promise<QueryResponse> {
    const vendorMatch = query.match(/vendor\s+([a-z\s]+)/i);
    const vendorName = vendorMatch ? vendorMatch[1].trim() : 'TechSupply Corp';
    
    const trendData = mockVendorTrendData[0]; // Using first vendor as example
    
    const visualization: VisualizationData = {
      type: 'vendor-trending',
      data: trendData,
      title: `Vendor Trending Analysis - ${trendData.vendor.vendorName}`,
      description: 'Performance trends, risk indicators, and benchmark comparisons',
      interactiveActions: [
        mockInteractiveActions.find(a => a.id === 'schedule-review')!,
        mockInteractiveActions.find(a => a.id === 'create-alert')!
      ]
    };

    const latestTrend = trendData.trendData[trendData.trendData.length - 1];
    const earliestTrend = trendData.trendData[0];
    const overallImprovement = latestTrend.compliance - earliestTrend.compliance;

    return {
      message: `Vendor Trending Analysis for ${trendData.vendor.vendorName}:

**Performance Trend (6 weeks):**
• Current Compliance: ${latestTrend.compliance}%
• Trend Direction: ${overallImprovement > 0 ? '↗️ Improving' : overallImprovement < 0 ? '↘️ Declining' : '➡️ Stable'} (${overallImprovement > 0 ? '+' : ''}${overallImprovement.toFixed(1)}%)
• Average Delay: ${latestTrend.averageDelay} hours

**Benchmark Comparison:**
${trendData.comparisonMetrics.map(metric => 
  `• ${metric.metric}: ${metric.value}${metric.metric.includes('hours') ? 'h' : '%'} (Benchmark: ${metric.benchmark}${metric.metric.includes('hours') ? 'h' : '%'}) ${metric.variance > 0 ? '↗️' : metric.variance < 0 ? '↘️' : '➡️'}`
).join('\n')}

**Risk Assessment:**
${trendData.riskIndicators.map(risk => 
  `• **${risk.severity.toUpperCase()}**: ${risk.description}
    Recommendation: ${risk.recommendation}`
).join('\n\n')}

**Weekly Performance:**
${trendData.trendData.slice(-3).map(week => 
  `• Week ${week.date.toLocaleDateString()}: ${week.compliance}% compliance, ${week.onTimeDeliveries}/${week.totalShipments} on-time`
).join('\n')}`,
      visualization,
      suggestedFollowUps: [
        'Schedule performance review with this vendor',
        'Compare to industry benchmarks',
        'Show me recent delivery issues'
      ],
      context: { vendor: vendorName }
    };
  }

  private async handleRealTimeTrackingQuery(): Promise<QueryResponse> {
    const trackingData = mockLocationTrackingData;
    
    const visualization: VisualizationData = {
      type: 'real-time-location',
      data: trackingData,
      title: 'Real-Time Trailer Tracking',
      description: 'Live GPS tracking with route optimization and traffic conditions',
      interactiveActions: [
        mockInteractiveActions.find(a => a.id === 'notify-receiving')!,
        mockInteractiveActions.find(a => a.id === 'redirect-trailer')!
      ]
    };

    const activeTrailers = trackingData.trailers.length;
    const avgSpeed = trackingData.trailers.reduce((sum, t) => sum + t.speed, 0) / activeTrailers;
    const totalDelay = trackingData.routes.reduce((sum, r) => sum + r.trafficDelay, 0);

    return {
      message: `Real-Time Trailer Tracking Dashboard:

**System Status:**
• Live Tracking: ${trackingData.realTimeUpdates ? '🟢 Active' : '🔴 Offline'}
• Last Updated: ${trackingData.lastUpdated.toLocaleTimeString()}
• Active Trailers: ${activeTrailers}

**Current Conditions:**
• Average Speed: ${avgSpeed.toFixed(1)} mph
• Total Traffic Delay: ${totalDelay} minutes
• GPS Accuracy: High (±5 meters)

**Active Trailers:**
${trackingData.trailers.map(trailer => 
  `**${trailer.id}** - ${trailer.carrier}
  • Location: ${trailer.currentLocation.address}
  • Speed: ${trailer.speed} mph, Heading: ${trailer.heading}°
  • ETA: ${trailer.eta.toLocaleTimeString()}
  • Traffic: ${trailer.trafficConditions.map(tc => `${tc.segment} (${tc.condition})`).join(', ')}`
).join('\n\n')}

**Route Analysis:**
${trackingData.routes.map(route => 
  `• **${route.trailerId}**: ${route.origin.name} → ${route.destination.name}
    Estimated: ${route.estimatedDuration}min | Actual: ${route.actualDuration || 'In progress'}min
    Traffic Impact: +${route.trafficDelay}min`
).join('\n')}`,
      visualization,
      suggestedFollowUps: [
        'Show me traffic conditions on I-5',
        'Which trailers are behind schedule?',
        'Optimize routes for remaining trailers'
      ]
    };
  }

  private async handleHighPriorityItemsQuery(): Promise<QueryResponse> {
    const highPriorityTrailers = mockTrailers.filter(t => 
      t.contents.some(c => c.priority === 'high' && (c.cutScore || 0) > 80)
    );

    const visualization: VisualizationData = {
      type: 'trailer-yard',
      data: highPriorityTrailers,
      title: 'Trailers with High-Priority Items',
      description: 'Trailers containing high CUT score items and critical inventory',
      interactiveActions: [
        mockInteractiveActions.find(a => a.id === 'notify-receiving')!,
        mockInteractiveActions.find(a => a.id === 'assign-dock')!,
        mockInteractiveActions.find(a => a.id === 'expedite-shipment')!
      ]
    };

    const totalHighPriorityUnits = highPriorityTrailers.reduce((sum, t) => 
      sum + t.contents.filter(c => c.priority === 'high').reduce((s, c) => s + c.quantity, 0), 0
    );

    return {
      message: `Found ${highPriorityTrailers.length} trailers containing high-priority items:

${highPriorityTrailers.map(trailer => {
  const highPriorityItems = trailer.contents.filter(c => c.priority === 'high');
  const avgCutScore = highPriorityItems.reduce((sum, c) => sum + (c.cutScore || 0), 0) / highPriorityItems.length;
  
  return `**${trailer.id}** - ${trailer.carrier} (${trailer.status})
  • Location: ${trailer.currentLocation.address}
  • High Priority ASINs: ${highPriorityItems.length}
  • Average CUT Score: ${avgCutScore.toFixed(0)}
  • Total Units: ${highPriorityItems.reduce((sum, c) => sum + c.quantity, 0)}
  • Key Items: ${highPriorityItems.slice(0, 2).map(c => `${c.asin} (${c.quantity} units)`).join(', ')}`;
}).join('\n\n')}

**Summary:**
• Total High-Priority Units: ${totalHighPriorityUnits}
• Categories: Electronics (${highPriorityTrailers.filter(t => t.contents.some(c => c.category === 'Electronics')).length} trailers)
• Recommended Action: Prioritize unloading based on CUT scores and inventory levels

**Priority Ranking:**
1. ${highPriorityTrailers[0]?.id} - Highest CUT scores, critical inventory
2. ${highPriorityTrailers[1]?.id} - Electronics, moderate inventory risk
3. ${highPriorityTrailers[2]?.id} - Mixed priority items`,
      visualization,
      suggestedFollowUps: [
        'Assign priority docks to these trailers',
        'Notify receiving team about high-priority items',
        'Show me current inventory levels for these ASINs'
      ]
    };
  }

  private async handleYardCapacityQuery(query: string): Promise<QueryResponse> {
    const fcMatch = query.match(/fc\s+([a-z0-9]+)/i) || query.match(/at\s+([a-z0-9]+)/i);
    const fc = fcMatch ? fcMatch[1].toUpperCase() : 'SEA4';
    
    const inboundData = mockFCInboundData; // Using SEA4 data
    const capacityMetrics = inboundData.capacityMetrics;
    
    const visualization: VisualizationData = {
      type: 'fc-inbound-dashboard',
      data: inboundData,
      title: `${fc} Yard Capacity Overview`,
      description: 'Current yard utilization with capacity forecasting'
    };

    const yardUtilization = Math.round((inboundData.yardMap.occupiedSpots / inboundData.yardMap.totalSpots) * 100);
    const dockUtilization = Math.round(((capacityMetrics.totalDocks - capacityMetrics.availableDocks) / capacityMetrics.totalDocks) * 100);

    return {
      message: `Current yard capacity at FC ${fc}:

**Yard Utilization:**
• Total Spots: ${inboundData.yardMap.totalSpots}
• Occupied: ${inboundData.yardMap.occupiedSpots} (${yardUtilization}%)
• Available: ${inboundData.yardMap.totalSpots - inboundData.yardMap.occupiedSpots} spots

**Dock Capacity:**
• Total Docks: ${capacityMetrics.totalDocks}
• Available: ${capacityMetrics.availableDocks}
• Utilization: ${dockUtilization}%
• Queue Length: ${capacityMetrics.queueLength} trailers

**Performance Metrics:**
• Processing Rate: ${capacityMetrics.processingRate}%
• Average Unload Time: ${capacityMetrics.averageUnloadTime} minutes
• Throughput: ${Math.round(capacityMetrics.totalDocks * (capacityMetrics.processingRate / 100))} trailers/day

**Capacity Status:**
${yardUtilization > 90 ? '🔴 **Critical**: Yard near capacity - immediate action required' :
  yardUtilization > 75 ? '🟡 **Warning**: High utilization - monitor closely' :
  '🟢 **Normal**: Adequate capacity available'}

**Zone Breakdown:**
${inboundData.yardMap.zones.map(zone => 
  `• ${zone.name}: ${zone.spots.filter(s => s.occupied).length}/${zone.spots.length} spots occupied`
).join('\n')}`,
      visualization,
      suggestedFollowUps: [
        'Show me trailer queue priorities',
        'What\'s the capacity forecast for tomorrow?',
        'Which trailers can be redirected to other FCs?'
      ],
      context: { currentFC: fc }
    };
  }

  private async handleUnrecognizedQuery(query: string, userRole: UserRole): Promise<QueryResponse> {
    const roleSpecificSuggestions = {
      'site-leader': [
        'Show me all trailers heading to FC SEA4 in the next 72 hours',
        'Which trailers in the yard need priority unloading?',
        'What\'s the current capacity utilization?'
      ],
      'retail-employee': [
        'Track ASIN B07X2RJ3L9 across all open POs',
        'What\'s the status of PO12345?',
        'Which ASINs are at risk of stockout this week?'
      ],
      'vendor-performance': [
        'Show me delivery window compliance for TechSupply Corp',
        'Compare top 5 vendors by performance',
        'Which vendors have declining performance trends?'
      ],
      'ipex-team': [
        'Where are all trailers carrying ASIN B07X2RJ3L9?',
        'Show me the route for trailer T12345',
        'Which shipments are experiencing delays?'
      ]
    };

    return {
      message: `I'm not sure how to help with "${query}". Here are some things I can help you with based on your role:`,
      suggestedFollowUps: roleSpecificSuggestions[userRole] || [
        'Show me trailer information',
        'Track an ASIN',
        'Check vendor performance'
      ]
    };
  }
}

export const queryProcessor = new QueryProcessor();
