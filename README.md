# ATLAS UX V2 - Supply Chain Intelligence Platform

A conversational AI interface prototype for Amazon's internal supply chain teams, enabling natural language queries for tracking shipments and inventory across the entire procure-to-stow lifecycle.

## Overview

ATLAS UX V2 is a React-based web application that simulates an LLM-powered conversational interface for supply chain operations. The prototype demonstrates how users can interact with supply chain data using natural language queries and receive intelligent responses with relevant visualizations.

## Features

### 🔐 Role-Based Authentication
- **Site Leader**: Manage trailer operations and facility capacity
- **Retail Employee**: Track ASINs and monitor purchase orders  
- **Vendor Performance Team**: Analyze vendor compliance and performance metrics
- **IPEX Team**: Track shipment locations and routes

### 💬 Conversational Interface
- Natural language query processing
- Context-aware conversations with follow-up support
- Typing indicators and realistic response timing
- Error handling for unsupported queries
- Role-specific query suggestions

### 📊 Interactive Visualizations
- **Network Map**: Geographic view of shipments and trailers with real-time locations
- **Shipment Timeline**: Visual journey from PO creation to stow completion
- **Compliance Dashboard**: Vendor performance metrics and trend analysis
- **Trailer Yard View**: Facility-specific trailer status and prioritization

### 🎯 Key User Flows
The prototype implements the exact dialogue flows specified in requirements:

1. **Site Leader - Trailer Management**
   - Query: "Show me all trailers heading to FC SEA4 in the next 24 hours"
   - Follow-up: "Show me the delayed trailers"
   - Deep dive: "What high-demand items are on T23456?"

2. **Retail Employee - ASIN Tracking**
   - Track specific ASINs across purchase orders
   - View complete procure-to-stow timeline
   - Monitor inventory levels and delivery status

3. **Vendor Performance - Compliance Analysis**
   - Analyze delivery window compliance over time
   - Compare vendor performance metrics
   - Identify performance trends and patterns

4. **IPEX Team - Location Tracking**
   - Real-time trailer location monitoring
   - Route visualization and ETA tracking
   - GPS-based shipment monitoring

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom Amazon design tokens
- **Charts**: Recharts for performance dashboards
- **Maps**: React Leaflet for geographic visualizations
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and building

## Project Structure

```
atlas-ux-v2/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx          # Role-based authentication
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx        # Main conversation UI
│   │   │   ├── MessageBubble.tsx        # Individual message display
│   │   │   ├── TypingIndicator.tsx      # Loading animation
│   │   │   └── QuerySuggestions.tsx     # Role-specific suggestions
│   │   └── visualizations/
│   │       ├── NetworkMap.tsx           # Geographic trailer view
│   │       ├── ShipmentTimeline.tsx     # Process timeline
│   │       ├── ComplianceDashboard.tsx  # Vendor performance
│   │       └── TrailerYardView.tsx      # Facility yard status
│   ├── data/
│   │   └── mockData.ts                  # Simulated ATLAS data
│   ├── services/
│   │   └── queryProcessor.ts            # Natural language processing
│   ├── types/
│   │   └── index.ts                     # TypeScript definitions
│   ├── App.tsx                          # Main application component
│   ├── main.tsx                         # React entry point
│   └── index.css                        # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

**If Node.js is not installed:**
```bash
# On macOS with Homebrew
brew install node

# On Windows with Chocolatey
choco install nodejs

# On Ubuntu/Debian
sudo apt update && sudo apt install nodejs npm
```

**Setup the application:**
1. **Navigate to the project directory**
   ```bash
   cd atlas-ux-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

**Troubleshooting:**
- If you see TypeScript errors, they will resolve once dependencies are installed
- If port 3000 is busy, Vite will automatically use the next available port
- For any build issues, try `npm run build` to check for compilation errors

### Building for Production

```bash
npm run build
npm run preview
```

## Usage Guide

### 1. Authentication
- Select your role from the login screen
- Each role has different permissions and suggested queries
- The interface adapts based on your selected role

### 2. Natural Language Queries
Try these example queries based on your role:

**Site Leader:**
- "Show me all trailers heading to FC SEA4 in the next 24 hours"
- "Which trailers in the yard need priority unloading?"
- "What's the current capacity utilization?"

**Retail Employee:**
- "Track ASIN B07X2RJ3L9 across all open POs"
- "What's the status of PO12345?"
- "Which ASINs are at risk of stockout this week?"

**Vendor Performance:**
- "Show me delivery window compliance for TechSupply Corp over the last 6 weeks"
- "Compare top 5 vendors by performance"
- "Which vendors have declining performance trends?"

**IPEX Team:**
- "Where are all trailers carrying ASIN B07X2RJ3L9?"
- "Show me the route for trailer T12345"
- "Which shipments are experiencing delays?"

### 3. Interactive Features
- **Context Preservation**: Follow-up questions reference previous queries
- **Visualizations**: Relevant charts and maps appear automatically
- **Suggestions**: Click suggested queries for quick access
- **Real-time Updates**: Simulated live data with realistic timing

## Data Models

The prototype simulates integration with three key ATLAS data models:

### Intent Shipment Data Model
- Purchase order details and FBA shipment information
- Expected quantities and planned delivery dates
- Vendor information and priority levels

### Execution Shipment Data Model  
- ASN, EDI-214, RTTV, and appointment information
- Real-time location tracking and carrier details
- Actual vs. planned timeline comparison

### Reconciled Shipment Model
- Unified view combining intent and execution data
- Variance analysis and discrepancy identification
- Performance metrics and compliance tracking

## Sample Dialogue Implementation

The prototype includes the exact dialogue flow specified in requirements:

```
User: "Show me all trailers headed to FC SEA4 in the next 24 hours"

ATLAS: "I found 23 trailers scheduled to arrive at SEA4 in the next 24 hours. Here's the breakdown:
- 8 trailers checked in but not yet unloaded
- 12 trailers en route with an on-time status
- 3 trailers en route but delayed

Would you like to see details for all trailers or focus on a specific category?"

User: "Show me the delayed trailers"

ATLAS: [Provides detailed breakdown of delayed trailers with reasons and recommendations]

User: "What high-demand items are on T23456?"

ATLAS: [Lists specific ASINs with inventory levels and priority flags]
```

## Design System

The application follows Amazon's internal design guidelines:

- **Colors**: Amazon orange (#FF9900) and blue (#232F3E) with neutral grays
- **Typography**: Inter font family for clarity and readability
- **Components**: Consistent spacing, rounded corners, and subtle shadows
- **Accessibility**: Color-blind friendly visualizations and proper contrast ratios

## Development Notes

### Mock Data
All data is simulated and does not connect to real ATLAS systems. The mock data includes:
- 5 sample trailers with various statuses and locations
- 2 vendor performance profiles with historical data
- Sample ASINs with inventory information
- Realistic timestamps and geographic coordinates

### Error Handling
The application includes comprehensive error handling for:
- Network connectivity issues (simulated)
- Unrecognized query patterns
- Missing context for follow-up questions
- Permission-based access restrictions

### Performance Considerations
- Simulated response timing (1-3 seconds) for realistic feel
- Lazy loading for visualization components
- Efficient state management with React hooks
- Optimized bundle size with Vite

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This is a prototype application. For production deployment, consider:

1. **Real Data Integration**: Connect to actual ATLAS APIs
2. **Authentication**: Implement proper Amazon SSO integration
3. **Performance**: Add caching and optimization for large datasets
4. **Testing**: Add comprehensive unit and integration tests
5. **Monitoring**: Implement logging and error tracking
6. **Security**: Add proper input validation and sanitization

## License

Internal Amazon prototype - not for external distribution.

---

**ATLAS UX V2** - Transforming supply chain operations through conversational AI
# stvnko-amzn.github.io
