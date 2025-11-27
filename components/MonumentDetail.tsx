import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Monument } from '../types';
import ChatInterface from './ChatInterface';

interface MonumentDetailProps {
  monument: Monument;
  onClose: () => void;
}

const MonumentDetail: React.FC<MonumentDetailProps> = ({ monument, onClose }) => {
  
  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[90vh] bg-museum-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition"
        >
          <X size={24} />
        </button>

        {/* Left Side: Visuals & Info */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden group">
          <img 
            src={monument.imageUrl} 
            alt={monument.name} 
            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-serif text-gold-400 mb-2">{monument.name}</h2>
            <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-prose">
              {monument.shortDescription}
            </p>
          </div>
        </div>

        {/* Right Side: Chat */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-museum-800 flex flex-col relative">
          <ChatInterface monument={monument} />
        </div>

      </div>
    </div>
  );
};

export default MonumentDetail;
