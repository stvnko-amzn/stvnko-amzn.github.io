export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export type UserRole = 'site-leader' | 'retail-employee' | 'vendor-performance' | 'ipex-team';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'visualization' | 'error';
  visualizationData?: VisualizationData;
}

export interface ConversationContext {
  currentFC?: string;
  timeframe?: string;
  asin?: string;
  vendor?: string;
  po?: string;
  trailer?: string;
}

export interface VisualizationData {
  type: 'network-map' | 'timeline' | 'compliance-dashboard' | 'trailer-yard';
  data: any;
  title: string;
  description?: string;
}

// Shipment Data Models
export interface IntentShipment {
  poId: string;
  asin: string;
  quantity: number;
  plannedDate: Date;
  vendor: string;
  destination: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ExecutionShipment {
  asnId: string;
  trailerId: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'in-transit' | 'arrived' | 'unloading' | 'delayed';
  eta: Date;
  carrier: string;
}

export interface ReconciledShipment {
  id: string;
  intent: IntentShipment;
  execution: ExecutionShipment;
  variance: {
    timeVariance: number; // hours
    quantityVariance: number;
    statusMatch: boolean;
  };
}

export interface Trailer {
  id: string;
  carrier: string;
  contents: TrailerContent[];
  status: 'en-route' | 'arrived' | 'unloading' | 'delayed';
  eta: Date;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: string;
  delayReason?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TrailerContent {
  asin: string;
  quantity: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
  cutScore?: number;
}

export interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  compliancePercentage: number;
  deliveryWindowCompliance: number;
  totalShipments: number;
  onTimeDeliveries: number;
  performanceTrend: 'improving' | 'declining' | 'stable';
  weeklyData: {
    week: string;
    compliance: number;
  }[];
}

export interface QueryResponse {
  message: string;
  data?: any;
  visualization?: VisualizationData;
  suggestedFollowUps?: string[];
  context?: Partial<ConversationContext>;
}
