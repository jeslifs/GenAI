import React, { useState } from 'react';
import VirtualGallery from './components/VirtualGallery';
import MonumentDetail from './components/MonumentDetail';
import { Monument } from './types';
import { Map, MousePointer2 } from 'lucide-react';

function App() {
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-blue-100">
      {/* 3D Map Layer */}
      <VirtualGallery 
        onSelectMonument={setSelectedMonument} 
      />

      {/* UI Overlay Layer (Only visible when no monument selected) */}
      {!selectedMonument && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Header */}
          <div className="absolute top-0 left-0 p-6 pointer-events-auto bg-gradient-to-b from-black/50 to-transparent w-full">
            <div className="flex items-center gap-3">
                <div className="bg-gold-500 p-2 rounded-lg text-black">
                    <Map size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-serif text-white tracking-wider drop-shadow-md">
                    HERITAGE MAP OF GOA
                    </h1>
                    <p className="text-white/80 text-sm">
                        Interactive Virtual Guide
                    </p>
                </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
             <div className="bg-white/90 backdrop-blur-md text-slate-800 px-6 py-3 rounded-full shadow-xl flex items-center gap-4 border border-white/50">
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                 <MousePointer2 size={16} className="text-blue-600" />
                 <span>Drag to Pan</span>
               </div>
               <div className="w-px h-4 bg-slate-300"></div>
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                 <span>Scroll to Zoom</span>
               </div>
               <div className="w-px h-4 bg-slate-300"></div>
               <div className="text-xs text-slate-500">
                   Select a location pin to visit
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Modal Layer */}
      {selectedMonument && (
        <MonumentDetail 
          monument={selectedMonument} 
          onClose={() => setSelectedMonument(null)} 
        />
      )}
    </div>
  );
}

export default App;