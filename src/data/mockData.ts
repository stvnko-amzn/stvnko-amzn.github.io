import { Trailer, VendorPerformance, IntentShipment, ExecutionShipment, ReconciledShipment } from '../types';

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
