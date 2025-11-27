import React, { useEffect, useRef } from 'react';
import { MONUMENTS } from '../constants';
import { Monument } from '../types';

interface VirtualGalleryProps {
  onSelectMonument: (m: Monument) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

const VirtualGallery: React.FC<VirtualGalleryProps> = ({ onSelectMonument }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Prevent re-initialization
    if (mapInstanceRef.current) return;

    const L = window.L;

    // 1. Initialize Map (Centered on Goa)
    const map = L.map(mapRef.current, {
        center: [15.4, 73.95], 
        zoom: 11,
        zoomControl: false, // We'll add it in a specific position if needed, or default
        attributionControl: false
    });
    
    // Add Zoom control to top-right
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // 2. Add Esri Satellite Tile Layer (Free, no key required usually)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
    }).addTo(map);

    // Optional: Add labels layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // 3. Add Custom Markers
    const pinIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="
            background-color: #FFD700;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div style="width: 8px; height: 8px; background-color: #000; border-radius: 50%;"></div>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    MONUMENTS.forEach((monument) => {
        const marker = L.marker([monument.position.lat, monument.position.lng], {
            icon: pinIcon,
            title: monument.name
        }).addTo(map);

        // Add Tooltip
        marker.bindTooltip(monument.name, {
            permanent: false,
            direction: 'top',
            offset: [0, -15],
            className: 'bg-white text-black px-2 py-1 rounded shadow text-xs font-bold'
        });

        // Click Handler
        marker.on('click', () => {
            // Smooth fly to location
            map.flyTo([monument.position.lat, monument.position.lng], 18, {
                duration: 2.0, // seconds
                easeLinearity: 0.25
            });

            // Open Detail after animation
            setTimeout(() => {
                onSelectMonument(monument);
            }, 2100);
        });
    });

    mapInstanceRef.current = map;

    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, [onSelectMonument]);

  return (
    <div className="w-full h-full relative bg-museum-900">
        <div ref={mapRef} className="w-full h-full z-0" />
        {/* Attribution overlay */}
        <div className="absolute bottom-1 right-1 text-[10px] text-white/50 bg-black/50 px-2 rounded z-10 pointer-events-none">
            Esri Satellite | OpenStreetMap
        </div>
    </div>
  );
};

export default VirtualGallery;