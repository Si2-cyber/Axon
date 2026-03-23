import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, GitGraph } from 'lucide-react';
import { useMapStore } from '../store';
import { DocumentTypology } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const initDocument = useMapStore((state) => state.initDocument);

  const handleCreate = (typology: DocumentTypology) => {
    initDocument(typology);
    navigate('/canvas');
  };

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
          Axon Brainstorming
        </h1>
        <p className="text-slate-500">Create a new document to begin bringing your thoughts to life.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
        <button 
          onClick={() => handleCreate(DocumentTypology.MIND_MAP)}
          className="flex flex-col items-center p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all group"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Network size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-700">New Mind Map</h2>
          <p className="text-sm text-slate-500 mt-2 text-center">Strict horizontal tree layout. Perfect for hierarchical brainstorming.</p>
        </button>

        <button 
          onClick={() => handleCreate(DocumentTypology.FLOWCHART)}
          className="flex flex-col items-center p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:teal-border-400 transition-all group"
        >
          <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <GitGraph size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-700">New Flowchart</h2>
          <p className="text-sm text-slate-500 mt-2 text-center">Free-form layout with drag and drop capabilities for custom mapping.</p>
        </button>
      </div>
    </div>
  );
}
