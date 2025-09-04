import { 
  Trailer, 
  VendorPerformance, 
  IntentShipment, 
  ExecutionShipment, 
  ReconciledShipment,
  MilestoneEvent,
  ShipmentMilestones,
  FCInboundData,
  TrailerYardPosition,
  DockStatus,
  YardLayout,
  CapacityMetrics,
  VendorTrendData,
  TrendPoint,
  ComparisonMetric,
  RiskIndicator,
  LocationTrackingData,
  TrackedTrailer,
  GPSCoordinate,
  RouteData,
  TrafficCondition,
  InteractiveAction
} from '../types';

// Mock Trailers Data
export const mockTrailers: Trailer[] = [
  {
    id: 'T12345',
    carrier: 'XYZ Logistics',
    status: 'delayed',
    eta: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    currentLocation: {
      lat: 47.6062,
      lng: -122.3321,
      address: 'I-5 near Seattle, WA'
    },
    destination: 'SEA4',
    delayReason: 'Traffic delay on I-5',
    priority: 'medium',
    contents: [
      { asin: 'B07X2RJ3L9', quantity: 120, category: 'Electronics', priority: 'high', cutScore: 85 },
      { asin: 'B08F7N8LJ9', quantity: 85, category: 'Electronics', priority: 'high', cutScore: 92 },
      { asin: 'B09D34GH7N', quantity: 50, category: 'Electronics', priority: 'high', cutScore: 78 }
    ]
  },
  {
    id: 'T23456',
    carrier: 'ABC Transport',
    status: 'delayed',
    eta: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    currentLocation: {
      lat: 47.2529,
      lng: -122.4443,
      address: 'Tacoma, WA'
    },
    destination: 'SEA4',
    delayReason: 'Mechanical issues',
    priority: 'high',
    contents: [
      { asin: 'B07X2RJ3L9', quantity: 120, category: 'Electronics', priority: 'high', cutScore: 85 },
      { asin: 'B08F7N8LJ9', quantity: 85, category: 'Electronics', priority: 'high', cutScore: 92 },
      { asin: 'B09D34GH7N', quantity: 50, category: 'Electronics', priority: 'high', cutScore: 78 }
    ]
  },
  {
    id: 'T34567',
    carrier: 'Fast Freight',
    status: 'delayed',
    eta: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    currentLocation: {
      lat: 47.0379,
      lng: -122.9015,
      address: 'Olympia, WA'
    },
    destination: 'SEA4',
    delayReason: 'Delayed departure from origin',
    priority: 'low',
    contents: [
      { asin: 'B08G7H9K2L', quantity: 200, category: 'Apparel', priority: 'medium' },
      { asin: 'B09H8J3M4N', quantity: 150, category: 'Apparel', priority: 'low' }
    ]
  },
  {
    id: 'T45678',
    carrier: 'Prime Logistics',
    status: 'en-route',
    eta: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    currentLocation: {
      lat: 47.4502,
      lng: -122.3088,
      address: 'Renton, WA'
    },
    destination: 'SEA4',
    priority: 'high',
    contents: [
      { asin: 'B07Y3K5L8M', quantity: 300, category: 'Home & Garden', priority: 'medium' }
    ]
  },
  {
    id: 'T56789',
    carrier: 'Swift Transport',
    status: 'arrived',
    eta: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    currentLocation: {
      lat: 47.5480,
      lng: -122.3010,
      address: 'SEA4 Fulfillment Center'
    },
    destination: 'SEA4',
    priority: 'medium',
    contents: [
      { asin: 'B08K9L2N5P', quantity: 180, category: 'Books', priority: 'low' }
    ]
  }
];

// Mock Vendor Performance Data
export const mockVendorPerformance: VendorPerformance[] = [
  {
    vendorId: 'V001',
    vendorName: 'TechSupply Corp',
    compliancePercentage: 87,
    deliveryWindowCompliance: 89,
    totalShipments: 245,
    onTimeDeliveries: 218,
    performanceTrend: 'improving',
    weeklyData: [
      { week: '2024-01-01', compliance: 82 },
      { week: '2024-01-08', compliance: 85 },
      { week: '2024-01-15', compliance: 87 },
      { week: '2024-01-22', compliance: 89 },
      { week: '2024-01-29', compliance: 91 },
      { week: '2024-02-05', compliance: 87 }
    ]
  },
  {
    vendorId: 'V002',
    vendorName: 'Global Electronics Ltd',
    compliancePercentage: 92,
    deliveryWindowCompliance: 94,
    totalShipments: 189,
    onTimeDeliveries: 178,
    performanceTrend: 'stable',
    weeklyData: [
      { week: '2024-01-01', compliance: 91 },
      { week: '2024-01-08', compliance: 93 },
      { week: '2024-01-15', compliance: 92 },
      { week: '2024-01-22', compliance: 94 },
      { week: '2024-01-29', compliance: 92 },
      { week: '2024-02-05', compliance: 94 }
    ]
  }
];

// Mock Intent Shipments
export const mockIntentShipments: IntentShipment[] = [
  {
    poId: 'PO12345',
    asin: 'B07X2RJ3L9',
    quantity: 500,
    plannedDate: new Date('2024-02-15'),
    vendor: 'TechSupply Corp',
    destination: 'SEA4',
    priority: 'high'
  },
  {
    poId: 'PO12346',
    asin: 'B08F7N8LJ9',
    quantity: 300,
    plannedDate: new Date('2024-02-16'),
    vendor: 'Global Electronics Ltd',
    destination: 'SEA4',
    priority: 'high'
  }
];

// Mock Execution Shipments
export const mockExecutionShipments: ExecutionShipment[] = [
  {
    asnId: 'ASN001',
    trailerId: 'T12345',
    currentLocation: {
      lat: 47.6062,
      lng: -122.3321,
      address: 'I-5 near Seattle, WA'
    },
    status: 'in-transit',
    eta: new Date(Date.now() + 3 * 60 * 60 * 1000),
    carrier: 'XYZ Logistics'
  }
];

// Mock Reconciled Shipments
export const mockReconciledShipments: ReconciledShipment[] = [
  {
    id: 'RS001',
    intent: mockIntentShipments[0],
    execution: mockExecutionShipments[0],
    variance: {
      timeVariance: 3, // 3 hours late
      quantityVariance: 0,
      statusMatch: true
    }
  }
];

// Mock ASIN Inventory Data
export const mockInventoryData = {
  'B07X2RJ3L9': {
    name: 'Wireless Earbuds',
    currentInventory: 35,
    category: 'Electronics',
    priority: 'high'
  },
  'B08F7N8LJ9': {
    name: 'Smart Speaker',
    currentInventory: 12,
    category: 'Electronics',
    priority: 'high'
  },
  'B09D34GH7N': {
    name: 'Tablet Computer',
    currentInventory: 8,
    category: 'Electronics',
    priority: 'high'
  }
};

// Mock Facilities Data
export const mockFacilities = [
  {
    id: 'SEA4',
    name: 'SEA4 Fulfillment Center',
    type: 'fulfillment-center',
    location: { lat: 47.5480, lng: -122.3010 },
    address: 'Seattle, WA',
    capacity: { total: 100, current: 75 }
  },
  {
    id: 'LAX7',
    name: 'LAX7 Fulfillment Center', 
    type: 'fulfillment-center',
    location: { lat: 34.0522, lng: -118.2437 },
    address: 'Los Angeles, CA',
    capacity: { total: 120, current: 95 }
  },
  {
    id: 'VENDOR_A',
    name: 'TechSupply Corp Warehouse',
    type: 'vendor',
    location: { lat: 47.2529, lng: -122.4443 },
    address: 'Tacoma, WA'
  }
];

// Mock Route Data
export const mockRoutes = {
  'T12345': [
    { lat: 47.2529, lng: -122.4443 }, // Origin (Tacoma)
    { lat: 47.4502, lng: -122.3088 }, // Waypoint (Renton)
    { lat: 47.6062, lng: -122.3321 }, // Current location (I-5)
    { lat: 47.5480, lng: -122.3010 }  // Destination (SEA4)
  ],
  'T23456': [
    { lat: 47.0379, lng: -122.9015 }, // Origin (Olympia)
    { lat: 47.2529, lng: -122.4443 }, // Current location (Tacoma)
    { lat: 47.5480, lng: -122.3010 }  // Destination (SEA4)
  ]
};

// Mock Capacity Data
export const mockCapacityData = {
  'SEA4': {
    totalDocks: 24,
    availableDocks: 6,
    processingRate: 85, // percentage
    queueLength: 8,
    averageUnloadTime: 45, // minutes
    utilizationTrend: 'increasing'
  },
  'LAX7': {
    totalDocks: 32,
    availableDocks: 3,
    processingRate: 92,
    queueLength: 12,
    averageUnloadTime: 38,
    utilizationTrend: 'stable'
  }
};

// Mock Inventory Risk Data
export const mockInventoryRisk = [
  {
    asin: 'B07X2RJ3L9',
    name: 'Wireless Earbuds',
    currentStock: 35,
    dailyDemand: 12,
    daysOfSupply: 2.9,
    riskLevel: 'high',
    reorderPoint: 50,
    incomingShipments: 500
  },
  {
    asin: 'B08F7N8LJ9', 
    name: 'Smart Speaker',
    currentStock: 12,
    dailyDemand: 8,
    daysOfSupply: 1.5,
    riskLevel: 'critical',
    reorderPoint: 40,
    incomingShipments: 300
  },
  {
    asin: 'B09D34GH7N',
    name: 'Tablet Computer',
    currentStock: 8,
    dailyDemand: 5,
    daysOfSupply: 1.6,
    riskLevel: 'critical',
    reorderPoint: 30,
    incomingShipments: 200
  }
];

// Mock Logistics Dashboard Data
export const mockLogisticsDashboardData = {
  metrics: {
    totalShipments: { 
      value: 534, 
      trend: { direction: 'up' as const, percentage: 12, period: 'vs last month' } 
    },
    completed: { 
      value: 109, 
      trend: { direction: 'down' as const, percentage: 21, period: 'vs last month' } 
    },
    pending: { 
      value: 293, 
      trend: { direction: 'up' as const, percentage: 26, period: 'vs last month' } 
    },
    delayed: { 
      value: 23, 
      trend: { direction: 'down' as const, percentage: 10, period: 'vs last month' } 
    }
  },
  shipments: [
    {
      id: 'SH001',
      customerName: 'Wade Warren',
      shippingId: '#6275',
      date: '2024-08-08',
      location: '65 S.William NY',
      status: 'complete' as const
    },
    {
      id: 'SH002',
      customerName: 'Brooklyn Simmons',
      shippingId: '#6012',
      date: '2024-08-10',
      location: '27 Park Street, CAL',
      status: 'pending' as const
    },
    {
      id: 'SH003',
      customerName: 'Savannah Nguyen',
      shippingId: '#1074',
      date: '2024-08-12',
      location: '42 Green Road, NY',
      status: 'complete' as const
    },
    {
      id: 'SH004',
      customerName: 'Darlene Robertson',
      shippingId: '#7356',
      date: '2024-08-13',
      location: '21 Riverside, OH',
      status: 'pending' as const
    },
    {
      id: 'SH005',
      customerName: 'Darrell Steward',
      shippingId: '#0164',
      date: '2024-08-20',
      location: '70 Green Road, CH',
      status: 'complete' as const
    }
  ],
  activityData: [
    { date: '2024-06-01', value: 12, label: 'June 1: 12 shipments' },
    { date: '2024-06-02', value: 8, label: 'June 2: 8 shipments' },
    { date: '2024-06-03', value: 15, label: 'June 3: 15 shipments' },
    { date: '2024-06-04', value: 22, label: 'June 4: 22 shipments' },
    { date: '2024-06-05', value: 18, label: 'June 5: 18 shipments' },
    { date: '2024-06-08', value: 25, label: 'June 8: 25 shipments' },
    { date: '2024-06-09', value: 30, label: 'June 9: 30 shipments' },
    { date: '2024-06-10', value: 28, label: 'June 10: 28 shipments' },
    { date: '2024-06-11', value: 20, label: 'June 11: 20 shipments' },
    { date: '2024-06-12', value: 16, label: 'June 12: 16 shipments' },
    { date: '2024-06-15', value: 35, label: 'June 15: 35 shipments' },
    { date: '2024-06-16', value: 40, label: 'June 16: 40 shipments' },
    { date: '2024-06-17', value: 32, label: 'June 17: 32 shipments' },
    { date: '2024-06-18', value: 28, label: 'June 18: 28 shipments' },
    { date: '2024-06-19', value: 24, label: 'June 19: 24 shipments' },
    { date: '2024-06-22', value: 45, label: 'June 22: 45 shipments' },
    { date: '2024-06-23', value: 38, label: 'June 23: 38 shipments' },
    { date: '2024-06-24', value: 42, label: 'June 24: 42 shipments' },
    { date: '2024-06-25', value: 36, label: 'June 25: 36 shipments' },
    { date: '2024-06-26', value: 30, label: 'June 26: 30 shipments' },
    { date: '2024-07-01', value: 50, label: 'July 1: 50 shipments' },
    { date: '2024-07-02', value: 48, label: 'July 2: 48 shipments' },
    { date: '2024-07-03', value: 52, label: 'July 3: 52 shipments' },
    { date: '2024-07-08', value: 55, label: 'July 8: 55 shipments' },
    { date: '2024-07-09', value: 60, label: 'July 9: 60 shipments' },
    { date: '2024-07-10', value: 58, label: 'July 10: 58 shipments' },
    { date: '2024-07-15', value: 65, label: 'July 15: 65 shipments' },
    { date: '2024-07-16', value: 62, label: 'July 16: 62 shipments' },
    { date: '2024-07-22', value: 70, label: 'July 22: 70 shipments' },
    { date: '2024-07-23', value: 68, label: 'July 23: 68 shipments' },
    { date: '2024-08-01', value: 75, label: 'August 1: 75 shipments' },
    { date: '2024-08-05', value: 80, label: 'August 5: 80 shipments' },
    { date: '2024-08-06', value: 78, label: 'August 6: 78 shipments' },
    { date: '2024-08-07', value: 82, label: 'August 7: 82 shipments' }
  ],
  trailerStatus: {
    total: 5,
    byStatus: {
      'en-route': 2,
      'arrived': 1,
      'unloading': 0,
      'delayed': 2
    }
  }
};

// Sample queries for different user roles
export const sampleQueries = {
  'site-leader': [
    'Show me all trailers heading to FC SEA4 in the next 72 hours',
    'Which trailers in the yard need priority unloading?',
    'What\'s the current capacity utilization at FC LAX7?',
    'Show me the logistics dashboard'
  ],
  'retail-employee': [
    'Track ASIN B07X2RJ3L9 across all open POs',
    'What\'s the status of PO12345?',
    'Which ASINs are at risk of stockout this week?'
  ],
  'vendor-performance': [
    'Show me delivery window compliance for TechSupply Corp over the last 6 weeks',
    'Compare top 5 vendors by performance',
    'Which vendors have declining performance trends?'
  ],
  'ipex-team': [
    'Where are all trailers carrying ASIN B07X2RJ3L9?',
    'Show me the route for trailer T12345',
    'Which shipments are experiencing delays?'
  ]
};

// Mock Milestone Data for METIS user story
export const mockShipmentMilestones: ShipmentMilestones[] = [
  {
    shipmentId: 'PO12345',
    asin: 'B07X2RJ3L9',
    poId: 'PO12345',
    overallStatus: 'delayed',
    criticalPath: ['po-created', 'vendor-confirmed', 'shipped', 'in-transit', 'fc-arrival', 'stowed'],
    milestones: [
      {
        id: 'po-created',
        name: 'PO Created',
        plannedDate: new Date('2024-02-10T08:00:00Z'),
        actualDate: new Date('2024-02-10T08:15:00Z'),
        status: 'completed',
        variance: 0.25,
        description: 'Purchase order created and sent to vendor',
        owner: 'Procurement Team'
      },
      {
        id: 'vendor-confirmed',
        name: 'Vendor Confirmation',
        plannedDate: new Date('2024-02-11T12:00:00Z'),
        actualDate: new Date('2024-02-11T14:30:00Z'),
        status: 'completed',
        variance: 2.5,
        description: 'Vendor confirmed order and provided ship date',
        owner: 'TechSupply Corp'
      },
      {
        id: 'shipped',
        name: 'Shipped from Vendor',
        plannedDate: new Date('2024-02-14T10:00:00Z'),
        actualDate: new Date('2024-02-14T16:00:00Z'),
        status: 'completed',
        variance: 6,
        description: 'Shipment departed vendor facility',
        owner: 'TechSupply Corp'
      },
      {
        id: 'in-transit',
        name: 'In Transit',
        plannedDate: new Date('2024-02-14T18:00:00Z'),
        actualDate: new Date('2024-02-15T02:00:00Z'),
        status: 'completed',
        variance: 8,
        description: 'Shipment picked up by carrier',
        owner: 'XYZ Logistics'
      },
      {
        id: 'fc-arrival',
        name: 'FC Arrival',
        plannedDate: new Date('2024-02-15T14:00:00Z'),
        actualDate: undefined,
        status: 'delayed',
        variance: 3,
        description: 'Expected arrival at SEA4 fulfillment center',
        owner: 'FC Operations'
      },
      {
        id: 'stowed',
        name: 'Stowed',
        plannedDate: new Date('2024-02-15T20:00:00Z'),
        actualDate: undefined,
        status: 'at-risk',
        description: 'Items stowed and available for picking',
        owner: 'FC Operations'
      }
    ]
  }
];

// Mock FC Inbound Data for site leader user story
export const mockFCInboundData: FCInboundData = {
  fcId: 'SEA4',
  capacityMetrics: {
    totalDocks: 24,
    availableDocks: 6,
    utilizationPercentage: 75,
    averageUnloadTime: 45,
    queueLength: 8,
    processingRate: 85
  },
  dockUtilization: [
    { 
      dockId: 'D01', 
      status: 'occupied', 
      currentTrailer: 'T56789', 
      estimatedFreeTime: new Date(Date.now() + 2 * 60 * 60 * 1000), 
      efficiency: 92,
      position: { x: 50, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' },
      utilizationHistory: {
        hourlyUtilization: [
          { hour: 6, day: 'monday', utilizationPercentage: 85, trailerCount: 1, averageWaitTime: 15 },
          { hour: 7, day: 'monday', utilizationPercentage: 90, trailerCount: 1, averageWaitTime: 12 },
          { hour: 8, day: 'monday', utilizationPercentage: 95, trailerCount: 1, averageWaitTime: 8 }
        ],
        dailyThroughput: [
          { date: new Date(Date.now() - 24 * 60 * 60 * 1000), trailersProcessed: 12, averageUnloadTime: 45, totalDowntime: 2, efficiency: 92 }
        ],
        averageUnloadTime: 42,
        peakHours: ['08:00', '14:00', '20:00'],
        efficiencyTrend: [
          { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), compliance: 90, onTimeDeliveries: 11, totalShipments: 12, averageDelay: 0.5 }
        ]
      },
      maintenanceSchedule: {
        scheduledMaintenance: [
          { id: 'M001', type: 'routine', scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), estimatedDuration: 2, description: 'Weekly dock inspection', priority: 'low', status: 'scheduled' }
        ],
        lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maintenanceHistory: []
      }
    },
    { 
      dockId: 'D02', 
      status: 'available', 
      efficiency: 88,
      position: { x: 150, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' }
    },
    { 
      dockId: 'D03', 
      status: 'occupied', 
      currentTrailer: 'T67890', 
      estimatedFreeTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000), 
      efficiency: 95,
      position: { x: 250, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' }
    },
    { 
      dockId: 'D04', 
      status: 'maintenance', 
      efficiency: 0,
      position: { x: 350, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' }
    },
    { 
      dockId: 'D05', 
      status: 'available', 
      efficiency: 90,
      position: { x: 450, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' }
    },
    { 
      dockId: 'D06', 
      status: 'available', 
      efficiency: 87,
      position: { x: 550, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' }
    },
    { 
      dockId: 'D07', 
      status: 'occupied', 
      currentTrailer: 'T78901', 
      estimatedFreeTime: new Date(Date.now() + 3 * 60 * 60 * 1000), 
      efficiency: 89,
      position: { x: 50, y: 200, width: 80, height: 40, orientation: 'horizontal', section: 'south' }
    },
    { 
      dockId: 'D08', 
      status: 'available', 
      efficiency: 91,
      position: { x: 150, y: 200, width: 80, height: 40, orientation: 'horizontal', section: 'south' }
    }
  ],
  queueManagement: {
    waitingTrailers: [
      {
        trailerId: 'T12345',
        arrivalTime: new Date(Date.now() - 30 * 60 * 1000),
        estimatedWaitTime: 45,
        priority: 'high',
        preferredDock: 'D02',
        contents: [
          { asin: 'B07X2RJ3L9', quantity: 120, category: 'Electronics', priority: 'high', cutScore: 85 }
        ]
      },
      {
        trailerId: 'T23456',
        arrivalTime: new Date(Date.now() - 15 * 60 * 1000),
        estimatedWaitTime: 60,
        priority: 'medium',
        contents: [
          { asin: 'B08F7N8LJ9', quantity: 85, category: 'Electronics', priority: 'high', cutScore: 92 }
        ]
      }
    ],
    averageWaitTime: 52,
    maxQueueLength: 12,
    currentQueueLength: 2,
    estimatedProcessingTime: 180
  },
  dockLayout: [
    { x: 50, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' },
    { x: 150, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' },
    { x: 250, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' },
    { x: 350, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' },
    { x: 450, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' },
    { x: 550, y: 100, width: 80, height: 40, orientation: 'horizontal', section: 'north' },
    { x: 50, y: 200, width: 80, height: 40, orientation: 'horizontal', section: 'south' },
    { x: 150, y: 200, width: 80, height: 40, orientation: 'horizontal', section: 'south' }
  ],
  yardMap: {
    totalSpots: 50,
    occupiedSpots: 32,
    zones: [
      {
        id: 'inbound-a',
        name: 'Inbound Zone A',
        type: 'inbound',
        spots: [
          { id: 'IA01', coordinates: { x: 100, y: 100 }, occupied: true, trailerId: 'T12345' },
          { id: 'IA02', coordinates: { x: 150, y: 100 }, occupied: true, trailerId: 'T23456' },
          { id: 'IA03', coordinates: { x: 200, y: 100 }, occupied: false },
          { id: 'IA04', coordinates: { x: 250, y: 100 }, occupied: true, trailerId: 'T34567' }
        ]
      },
      {
        id: 'staging',
        name: 'Staging Area',
        type: 'staging',
        spots: [
          { id: 'ST01', coordinates: { x: 100, y: 200 }, occupied: false },
          { id: 'ST02', coordinates: { x: 150, y: 200 }, occupied: false }
        ]
      }
    ]
  },
  trailers: [
    {
      trailer: mockTrailers[0],
      yardPosition: { zone: 'inbound-a', spot: 1, coordinates: { x: 100, y: 100 } },
      dwellTime: 2.5,
      priorityScore: 85
    },
    {
      trailer: mockTrailers[1],
      yardPosition: { zone: 'inbound-a', spot: 2, coordinates: { x: 150, y: 100 } },
      dwellTime: 4.2,
      priorityScore: 92
    },
    {
      trailer: mockTrailers[4],
      yardPosition: { zone: 'staging', spot: 1, coordinates: { x: 100, y: 200 } },
      dwellTime: 0.5,
      priorityScore: 78
    }
  ]
};

// Mock Vendor Trend Data for chargebacks user story
export const mockVendorTrendData: VendorTrendData[] = [
  {
    vendor: mockVendorPerformance[0],
    trendData: [
      { date: new Date('2024-01-01'), compliance: 82, onTimeDeliveries: 41, totalShipments: 50, averageDelay: 2.3 },
      { date: new Date('2024-01-08'), compliance: 85, onTimeDeliveries: 43, totalShipments: 51, averageDelay: 1.8 },
      { date: new Date('2024-01-15'), compliance: 87, onTimeDeliveries: 44, totalShipments: 51, averageDelay: 1.5 },
      { date: new Date('2024-01-22'), compliance: 89, onTimeDeliveries: 45, totalShipments: 51, averageDelay: 1.2 },
      { date: new Date('2024-01-29'), compliance: 91, onTimeDeliveries: 46, totalShipments: 51, averageDelay: 0.9 },
      { date: new Date('2024-02-05'), compliance: 87, onTimeDeliveries: 44, totalShipments: 51, averageDelay: 1.4 }
    ],
    comparisonMetrics: [
      { metric: 'On-Time Delivery', value: 89, benchmark: 90, variance: -1, trend: 'improving' },
      { metric: 'Delivery Window Compliance', value: 87, benchmark: 85, variance: 2, trend: 'stable' },
      { metric: 'Average Delay (hours)', value: 1.4, benchmark: 2.0, variance: -0.6, trend: 'improving' }
    ],
    riskIndicators: [
      {
        type: 'delivery-window',
        severity: 'medium',
        description: 'Recent dip in compliance from 91% to 87%',
        recommendation: 'Monitor next 2 weeks for trend confirmation'
      }
    ]
  }
];

// Mock Location Tracking Data for IPEX user story
export const mockLocationTrackingData: LocationTrackingData = {
  realTimeUpdates: true,
  lastUpdated: new Date(),
  routes: [
    {
      trailerId: 'T12345',
      origin: { lat: 47.2529, lng: -122.4443, address: 'Tacoma, WA', name: 'TechSupply Corp Warehouse' },
      destination: { lat: 47.5480, lng: -122.3010, address: 'Seattle, WA', name: 'SEA4 Fulfillment Center' },
      waypoints: [
        { lat: 47.4502, lng: -122.3088, address: 'Renton, WA', name: 'Rest Stop' }
      ],
      estimatedDuration: 180, // minutes
      actualDuration: 210,
      trafficDelay: 30
    }
  ],
  trailers: [
    {
      ...mockTrailers[0],
      gpsCoordinates: [
        { lat: 47.6062, lng: -122.3321, timestamp: new Date(Date.now() - 5 * 60 * 1000), accuracy: 5 },
        { lat: 47.6055, lng: -122.3315, timestamp: new Date(Date.now() - 4 * 60 * 1000), accuracy: 4 },
        { lat: 47.6048, lng: -122.3309, timestamp: new Date(Date.now() - 3 * 60 * 1000), accuracy: 6 }
      ],
      speed: 55, // mph
      heading: 180, // degrees
      estimatedRoute: [
        { lat: 47.6062, lng: -122.3321, estimatedTime: new Date(), waypoint: false },
        { lat: 47.5800, lng: -122.3200, estimatedTime: new Date(Date.now() + 30 * 60 * 1000), waypoint: false },
        { lat: 47.5480, lng: -122.3010, estimatedTime: new Date(Date.now() + 60 * 60 * 1000), waypoint: true }
      ],
      trafficConditions: [
        { segment: 'I-5 Seattle Downtown', condition: 'moderate', delay: 15, description: 'Construction in right lane' },
        { segment: 'I-5 South Seattle', condition: 'light', delay: 5, description: 'Normal traffic flow' }
      ]
    }
  ]
};

// Mock Interactive Actions
export const mockInteractiveActions: InteractiveAction[] = [
  {
    id: 'notify-receiving',
    label: 'Notify Receiving Team',
    type: 'primary',
    handler: 'notifyReceivingTeam',
    icon: '📢',
    requiresConfirmation: false
  },
  {
    id: 'assign-dock',
    label: 'Assign Dock',
    type: 'secondary',
    handler: 'assignDock',
    icon: '🚛',
    requiresConfirmation: true
  },
  {
    id: 'redirect-trailer',
    label: 'Redirect Trailer',
    type: 'warning',
    handler: 'redirectTrailer',
    icon: '🔄',
    requiresConfirmation: true
  },
  {
    id: 'schedule-review',
    label: 'Schedule Performance Review',
    type: 'secondary',
    handler: 'scheduleReview',
    icon: '📅',
    requiresConfirmation: false
  },
  {
    id: 'create-alert',
    label: 'Create Alert',
    type: 'warning',
    handler: 'createAlert',
    icon: '⚠️',
    requiresConfirmation: false
  },
  {
    id: 'expedite-shipment',
    label: 'Expedite Shipment',
    type: 'primary',
    handler: 'expediteShipment',
    icon: '⚡',
    requiresConfirmation: true
  }
];

// Enhanced sample queries with new capabilities
export const enhancedSampleQueries = {
  'site-leader': [
    'Show me all trailers arriving at FC SEA4 tomorrow',
    'Which trailers contain high-priority items?',
    'What\'s the current yard capacity at SEA4?',
    'Show me the FC inbound dashboard'
  ],
  'retail-employee': [
    'Track ASIN B07XYZ123 across all shipments',
    'Which of these will arrive before September 15?',
    'Are any of these shipments delayed?',
    'Show me milestones for PO 12345'
  ],
  'vendor-performance': [
    'Show me delivery compliance for vendor ABC for the past month',
    'Which shipments missed their delivery windows?',
    'How does this compare to their performance last quarter?',
    'Show me vendor trending analysis'
  ],
  'ipex-team': [
    'Find all trailers carrying ASIN B07XYZ123',
    'Which of these are currently en route?',
    'Show me the location of trailer T12345',
    'Display real-time tracking for all trailers'
  ]
};
