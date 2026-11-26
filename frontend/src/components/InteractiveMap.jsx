import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { ExternalLink, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

// Custom marker generator with status colors
const createCustomMarker = (status, iconChar) => {
  let bgColor = '#9333ea'; // purple
  if (status === 'Resolved') bgColor = '#10b981'; // emerald
  else if (status === 'In Progress') bgColor = '#f59e0b'; // amber
  else if (status === 'Under Review') bgColor = '#2563eb'; // blue

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        font-size: 16px;
      ">
        <span style="transform: rotate(45deg); display: block;">${iconChar || '📍'}</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
};

export default function InteractiveMap() {
  const { issues, setSelectedIssue } = useApp();

  // Center coordinate (Bengaluru/City center or average of issues)
  const defaultCenter = [12.9716, 77.5946];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm mb-6">
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <span>🗺️ Community Incident & Repair Map</span>
          </h3>
          <p className="text-xs text-slate-500">
            Click on any pin on the map to see the reported issue and municipal action status.
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
            <span>Reported</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
            <span>Under Review</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span>In Progress</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span>Resolved</span>
          </span>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="h-[460px] w-full">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {issues.map((issue) => {
            const lat = issue.location?.lat || defaultCenter[0];
            const lng = issue.location?.lng || defaultCenter[1];
            const icon = createCustomMarker(issue.status, issue.categoryIcon);

            return (
              <Marker key={issue.id} position={[lat, lng]} icon={icon}>
                <Popup className="custom-popup">
                  <div className="p-1 max-w-[220px]">
                    <img
                      src={issue.photo}
                      alt={issue.title}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <div className="text-[10px] font-mono font-bold text-slate-500 mb-0.5">
                      {issue.id}
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight">
                      {issue.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {issue.location?.address}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                        {issue.status}
                      </span>
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
