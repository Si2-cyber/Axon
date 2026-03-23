import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '../types';
import { useMapStore } from '../store';
import { FileText, CheckSquare, Link as LinkIcon, Image as ImageIcon, Plus } from 'lucide-react';

const CustomNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const theme = useMapStore((state) => state.document.theme);
  const addChildNode = useMapStore((state) => state.addChildNode);
  const deleteNode = useMapStore((state) => state.deleteNode);

  return (
    <div
      className={`relative px-4 py-3 rounded-2xl border transition-all duration-200 shadow-md bg-white
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500' : 'border-slate-200'}`}
      style={{ 
        backgroundColor: theme?.nodeColor || '#ffffff',
        minWidth: '200px'
      }}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-blue-400" />

      <div className="flex flex-col gap-2 text-slate-800">
        <div className="font-semibold text-sm">{data.label}</div>
        
        {data.notes && (
          <div className="text-xs opacity-70 flex items-center gap-1">
            <FileText size={12} />
            <span className="truncate max-w-[140px]">{data.notes}</span>
          </div>
        )}

        {data.tasks && data.tasks.length > 0 && (
          <div className="flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded w-fit">
            <CheckSquare size={10} />
            {data.tasks.filter(t => t.completed).length}/{data.tasks.length}
          </div>
        )}
      </div>
      
      {/* Node Action Menu (Rendered inline to prevent bounds bleeding/ghosting) */}
      <div className={`flex gap-2 mt-3 transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
         <button 
           className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 shadow-sm flex items-center gap-1"
           onClick={(e) => {
             e.stopPropagation();
             addChildNode(id);
           }}
           title="Add Child"
         >
           <Plus size={12} /> Add
         </button>
         {!data.isRoot && (
           <button 
             className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs hover:bg-red-100 shadow-sm flex items-center gap-1 border border-red-200"
             onClick={(e) => {
               e.stopPropagation();
               deleteNode(id);
             }}
             title="Delete Node"
           >
             Delete
           </button>
         )}
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-blue-400" />
    </div>
  );
};

export default memo(CustomNode);
