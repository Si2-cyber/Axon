import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
  addEdge,
  Node,
  Edge,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useMapStore } from './store';
import CustomNode from './components/CustomNode';
import Toolbar from './components/Toolbar';
import PropertiesPanel from './components/PropertiesPanel';
import { DocumentTypology } from './types';

const nodeTypes = {
  standard: CustomNode,
  input: CustomNode,
  output: CustomNode,
  default: CustomNode,
};

export default function App() {
  const { 
    document, 
    onNodesChange, 
    onEdgesChange, 
    onConnect 
  } = useMapStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden" style={{ backgroundColor: document.theme.backgroundColor }}>
      <Toolbar />
      
      <ReactFlow
        nodes={document.nodes}
        edges={document.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="transition-all duration-500"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color={document.theme.id === 'dark' ? '#334155' : '#cbd5e1'} 
        />
        <Controls className="!bg-white !border-slate-200 !shadow-lg !rounded-xl overflow-hidden" />
        <MiniMap 
          className="!bg-white/80 !backdrop-blur-md !border-slate-200 !shadow-xl !rounded-2xl"
          nodeColor={(n) => document.theme.nodeColor}
          maskColor="rgba(0, 0, 0, 0.05)"
        />
        
        <Panel position="bottom-left" className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-lg mb-4 ml-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Mode</span>
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              {document.typology.replace('_', ' ')}
            </span>
          </div>
        </Panel>
      </ReactFlow>

      {selectedNodeId && (
        <PropertiesPanel 
          selectedNodeId={selectedNodeId} 
          onClose={() => setSelectedNodeId(null)} 
        />
      )}

      {/* Focus Mode Overlay (Simplified) */}
      <div className="absolute bottom-8 right-8 pointer-events-none">
        <div className="text-[120px] font-black text-slate-500/5 select-none uppercase tracking-tighter">
          {document.typology.split('_')[0]}
        </div>
      </div>
    </div>
  );
}
