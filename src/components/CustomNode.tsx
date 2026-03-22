import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '../types';
import { useMapStore } from '../store';
import { FileText, CheckSquare, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

const CustomNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const theme = useMapStore((state) => state.document.theme);
  
  return (
    <div 
      className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 shadow-sm
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      style={{ 
        backgroundColor: theme.nodeColor,
        borderColor: selected ? '#3b82f6' : theme.edgeColor,
        color: theme.textColor,
        minWidth: '180px'
      }}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-blue-400" />
      
      <div className="flex flex-col gap-2">
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

        <div className="flex gap-2 mt-1">
          {data.links && data.links.length > 0 && <LinkIcon size={12} className="opacity-50" />}
          {data.media && <ImageIcon size={12} className="opacity-50" />}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-blue-400" />
    </div>
  );
};

export default memo(CustomNode);
