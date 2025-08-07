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

// Sample queries for different user roles
export const sampleQueries = {
  'site-leader': [
    'Show me all trailers heading to FC SEA4 in the next 72 hours',
    'Which trailers in the yard need priority unloading?',
    'What\'s the current capacity utilization at FC LAX7?'
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
