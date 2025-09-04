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
  type: 'network-map' | 'timeline' | 'compliance-dashboard' | 'trailer-yard' | 'logistics-dashboard' | 'milestone-timeline' | 'fc-inbound-dashboard' | 'vendor-trending' | 'real-time-location';
  data: any;
  title: string;
  description?: string;
  interactiveActions?: InteractiveAction[];
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

export interface PinnedVisualization {
  id: string;
  title: string;
  data: VisualizationData;
  messageId: string;
  timestamp: Date;
}

export interface QueryResponse {
  message: string;
  data?: any;
  visualization?: VisualizationData;
  suggestedFollowUps?: string[];
  context?: Partial<ConversationContext>;
  confidence?: number; // 0-1 confidence score
  clarificationNeeded?: boolean;
}

// New interfaces for enhanced functionality
export interface MilestoneEvent {
  id: string;
  name: string;
  plannedDate: Date;
  actualDate?: Date;
  status: 'completed' | 'in-progress' | 'delayed' | 'at-risk';
  variance?: number; // hours difference
  description?: string;
  owner?: string;
  location?: string;
  details?: Record<string, any>;
}

export interface FCInboundData {
  fcId: string;
  trailers: TrailerYardPosition[];
  dockUtilization: DockStatus[];
  yardMap: YardLayout;
  capacityMetrics: CapacityMetrics;
  queueManagement: QueueManagement;
  dockLayout: DockLayoutPosition[];
}

export interface TrailerYardPosition {
  trailer: Trailer;
  yardPosition: {
    zone: string;
    spot: number;
    coordinates: { x: number; y: number };
  };
  dwellTime: number; // hours
  priorityScore: number;
}

export interface DockStatus {
  dockId: string;
  status: 'available' | 'occupied' | 'maintenance';
  currentTrailer?: string;
  estimatedFreeTime?: Date;
  efficiency: number; // percentage
  position?: DockLayoutPosition;
  utilizationHistory?: DockUtilizationMetrics;
  maintenanceSchedule?: MaintenanceSchedule;
}

export interface DockLayoutPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: 'horizontal' | 'vertical';
  section: string; // e.g., 'north', 'south', 'east', 'west'
}

export interface DockUtilizationMetrics {
  hourlyUtilization: UtilizationPattern[];
  dailyThroughput: ThroughputMetric[];
  averageUnloadTime: number;
  peakHours: string[];
  efficiencyTrend: TrendPoint[];
}

export interface UtilizationPattern {
  hour: number; // 0-23
  day: string; // 'monday', 'tuesday', etc.
  utilizationPercentage: number;
  trailerCount: number;
  averageWaitTime: number;
}

export interface ThroughputMetric {
  date: Date;
  trailersProcessed: number;
  averageUnloadTime: number;
  totalDowntime: number;
  efficiency: number;
}

export interface MaintenanceSchedule {
  scheduledMaintenance: MaintenanceEvent[];
  lastMaintenance: Date;
  nextMaintenance: Date;
  maintenanceHistory: MaintenanceEvent[];
}

export interface MaintenanceEvent {
  id: string;
  type: 'routine' | 'repair' | 'upgrade';
  scheduledDate: Date;
  estimatedDuration: number; // hours
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface QueueManagement {
  waitingTrailers: QueuedTrailer[];
  averageWaitTime: number;
  maxQueueLength: number;
  currentQueueLength: number;
  estimatedProcessingTime: number;
}

export interface QueuedTrailer {
  trailerId: string;
  arrivalTime: Date;
  estimatedWaitTime: number;
  priority: 'high' | 'medium' | 'low';
  preferredDock?: string;
  contents: TrailerContent[];
}

export interface YardLayout {
  zones: YardZone[];
  totalSpots: number;
  occupiedSpots: number;
}

export interface YardZone {
  id: string;
  name: string;
  type: 'inbound' | 'outbound' | 'staging';
  spots: YardSpot[];
}

export interface YardSpot {
  id: string;
  coordinates: { x: number; y: number };
  occupied: boolean;
  trailerId?: string;
}

export interface CapacityMetrics {
  totalDocks: number;
  availableDocks: number;
  utilizationPercentage: number;
  averageUnloadTime: number;
  queueLength: number;
  processingRate: number;
}

export interface InteractiveAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'warning' | 'success';
  handler?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  icon?: string;
  data?: any;
  metadata?: any;
}

export interface VendorTrendData {
  vendor: VendorPerformance;
  trendData: TrendPoint[];
  comparisonMetrics: ComparisonMetric[];
  riskIndicators: RiskIndicator[];
}

export interface TrendPoint {
  date: Date;
  compliance: number;
  onTimeDeliveries: number;
  totalShipments: number;
  averageDelay: number;
}

export interface ComparisonMetric {
  metric: string;
  value: number;
  benchmark: number;
  variance: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface RiskIndicator {
  type: 'delivery-window' | 'volume-decline' | 'quality-issues';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
}

export interface ShipmentMilestones {
  shipmentId: string;
  asin?: string;
  poId?: string;
  milestones: MilestoneEvent[];
  overallStatus: 'on-track' | 'at-risk' | 'delayed';
  criticalPath: string[];
}

export interface LocationTrackingData {
  trailers: TrackedTrailer[];
  routes: RouteData[];
  realTimeUpdates: boolean;
  lastUpdated: Date;
}

export interface TrackedTrailer extends Trailer {
  gpsCoordinates: GPSCoordinate[];
  speed: number;
  heading: number;
  estimatedRoute: RoutePoint[];
  trafficConditions: TrafficCondition[];
}

export interface GPSCoordinate {
  lat: number;
  lng: number;
  timestamp: Date;
  accuracy: number;
}

export interface RoutePoint {
  lat: number;
  lng: number;
  estimatedTime: Date;
  waypoint: boolean;
}

export interface RouteData {
  trailerId: string;
  origin: Location;
  destination: Location;
  waypoints: Location[];
  estimatedDuration: number;
  actualDuration?: number;
  trafficDelay: number;
}

export interface TrafficCondition {
  segment: string;
  condition: 'clear' | 'light' | 'moderate' | 'heavy' | 'blocked';
  delay: number; // minutes
  description: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  name?: string;
}

// Enhanced conversation context
export interface EnhancedConversationContext extends ConversationContext {
  entities?: ExtractedEntity[];
  queryIntent?: QueryIntent;
  conversationHistory?: ContextualMemory[];
  userPreferences?: UserPreferences;
}

export interface ExtractedEntity {
  type: 'asin' | 'po' | 'trailer' | 'fc' | 'vendor' | 'date' | 'quantity';
  value: string;
  confidence: number;
  position: { start: number; end: number };
}

export interface QueryIntent {
  primary: 'track' | 'status' | 'performance' | 'location' | 'capacity' | 'compliance';
  secondary?: string;
  confidence: number;
}

export interface ContextualMemory {
  turn: number;
  entities: ExtractedEntity[];
  intent: QueryIntent;
  response: string;
  timestamp: Date;
}

export interface UserPreferences {
  defaultFC?: string;
  preferredTimeframe?: string;
  notificationSettings?: NotificationSettings;
  dashboardLayout?: DashboardLayout;
}

export interface NotificationSettings {
  delayAlerts: boolean;
  capacityWarnings: boolean;
  performanceReports: boolean;
  emailNotifications: boolean;
}

export interface DashboardLayout {
  pinnedVisualizations: string[];
  defaultView: string;
  refreshInterval: number;
}
