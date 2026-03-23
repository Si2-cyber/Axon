import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Network, 
  GitGraph, 
  Users, 
  Undo2, 
  Redo2, 
  Download, 
  Palette,
  Plus,
  Home,
  Trash2
} from 'lucide-react';
import { useMapStore } from '../store';
import { DocumentTypology, THEMES } from '../types';

const Toolbar = () => {
  const navigate = useNavigate();
  const { 
    document, 
    undo, 
    redo, 
    setTheme,
    setNodes,
    saveToHistory,
    resetMap
  } = useMapStore();

  const addNode = () => {
    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      data: { label: 'New Node' },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes([...document.nodes, newNode]);
    saveToHistory();
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl">
      {/* UI based on immutable mode */}
      <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
        <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600" title="Dashboard">
          <Home size={20} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
        <button onClick={undo} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600" title="Undo">
          <Undo2 size={20} />
        </button>
        <button onClick={redo} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600" title="Redo">
          <Redo2 size={20} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
        {document.typology === DocumentTypology.MIND_MAP && (
          <button onClick={resetMap} className="p-2 rounded-lg hover:bg-red-50 text-red-600" title="Clean All">
            <Trash2 size={20} />
          </button>
        )}
        {document.typology === DocumentTypology.FLOWCHART && (
          <button onClick={addNode} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600" title="Add Node">
            <Plus size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <div className="relative group">
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600" title="Themes">
            <Palette size={20} />
          </button>
          <div className="absolute top-full left-0 mt-2 hidden group-hover:block bg-white border border-slate-200 rounded-xl shadow-2xl p-2 min-w-[160px]">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.nodeColor, border: '1px solid #ddd' }} />
                {theme.name}
              </button>
            ))}
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600" title="Export">
          <Download size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
