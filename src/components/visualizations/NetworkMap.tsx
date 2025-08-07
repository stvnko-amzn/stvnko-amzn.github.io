import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Trailer } from '../../types';
import { mockFacilities, mockRoutes } from '../../data/mockData';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface NetworkMapProps {
  trailers: Trailer[];
  title: string;
  description?: string;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({ trailers, title, description }) => {
  // Center map on Seattle area
  const center: [number, number] = [47.6062, -122.3321];

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'delayed': return '#ef4444';
      case 'en-route': return '#22c55e';
      case 'arrived': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const createCustomIcon = (status: string) => {
    const color = getMarkerColor(status);
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const createFacilityIcon = (type: string) => {
    const color = type === 'fulfillment-center' ? '#1f2937' : '#f59e0b';
    const symbol = type === 'fulfillment-center' ? '🏢' : '🏭';
    return L.divIcon({
      className: 'facility-marker',
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 6px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">${symbol}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  const getRouteColor = (trailerId: string) => {
    const trailer = trailers.find(t => t.id === trailerId);
    return trailer?.status === 'delayed' ? '#ef4444' : '#22c55e';
  };

  return (
    <div className="visualization-container">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>

      <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Render route paths */}
          {Object.entries(mockRoutes).map(([trailerId, routePoints]) => {
            const trailer = trailers.find(t => t.id === trailerId);
            if (!trailer) return null;
            
            return (
              <Polyline
                key={`route-${trailerId}`}
                positions={routePoints.map(point => [point.lat, point.lng])}
                color={getRouteColor(trailerId)}
                weight={3}
                opacity={0.7}
                dashArray={trailer.status === 'delayed' ? '10, 5' : undefined}
              />
            );
          })}

          {/* Render facility markers */}
          {mockFacilities.map((facility) => (
            <Marker
              key={facility.id}
              position={[facility.location.lat, facility.location.lng]}
              icon={createFacilityIcon(facility.type)}
            >
              <Popup>
                <div className="p-2">
                  <div className="font-semibold text-gray-900 mb-2">
                    {facility.name}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {facility.type.replace('-', ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {facility.address}
                    </div>
                    {facility.capacity && (
                      <div>
                        <span className="font-medium">Capacity:</span> {facility.capacity.current}/{facility.capacity.total} ({Math.round((facility.capacity.current / facility.capacity.total) * 100)}%)
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Render trailer markers */}
          {trailers.map((trailer) => (
            <Marker
              key={trailer.id}
              position={[trailer.currentLocation.lat, trailer.currentLocation.lng]}
              icon={createCustomIcon(trailer.status)}
            >
              <Popup>
                <div className="p-2">
                  <div className="font-semibold text-gray-900 mb-2">
                    Trailer {trailer.id}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Carrier:</span> {trailer.carrier}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`status-badge ${trailer.status === 'delayed' ? 'delayed' : trailer.status === 'arrived' ? 'arrived' : 'on-time'}`}>
                        {trailer.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Destination:</span> {trailer.destination}
                    </div>
                    <div>
                      <span className="font-medium">ETA:</span>{' '}
                      {trailer.eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div>
                      <span className="font-medium">Contents:</span> {trailer.contents.length} ASINs
                    </div>
                    {trailer.delayReason && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-red-800">
                        <span className="font-medium">Delay Reason:</span> {trailer.delayReason}
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>En Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Arrived</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-800 rounded flex items-center justify-center text-xs">🏢</div>
            <span>Fulfillment Centers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 rounded flex items-center justify-center text-xs">🏭</div>
            <span>Vendor Facilities</span>
          </div>
        </div>
      </div>
    </div>
  );
};
