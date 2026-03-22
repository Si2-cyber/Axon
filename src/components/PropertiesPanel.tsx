import React, { useState } from 'react';
import { useMapStore } from '../store';
import { X, Type, AlignLeft, CheckSquare, Plus, Trash2 } from 'lucide-react';

const PropertiesPanel = ({ selectedNodeId, onClose }: { selectedNodeId: string; onClose: () => void }) => {
  const { document, updateNodeData } = useMapStore();
  const node = document.nodes.find(n => n.id === selectedNodeId);
  
  const [newTask, setNewTask] = useState('');

  if (!node) return null;

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(selectedNodeId, { label: e.target.value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(selectedNodeId, { notes: e.target.value });
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const tasks = node.data.tasks || [];
    updateNodeData(selectedNodeId, { 
      tasks: [...tasks, { id: Math.random().toString(), text: newTask, completed: false }] 
    });
    setNewTask('');
  };

  const toggleTask = (taskId: string) => {
    const tasks = node.data.tasks?.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    updateNodeData(selectedNodeId, { tasks });
  };

  const removeTask = (taskId: string) => {
    const tasks = node.data.tasks?.filter(t => t.id !== taskId);
    updateNodeData(selectedNodeId, { tasks });
  };

  return (
    <div className="absolute right-4 top-4 bottom-4 w-80 bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden">
      <div className="p-4 border-bottom border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800">Node Properties</h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Label */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Type size={12} /> Label
          </label>
          <input 
            type="text" 
            value={node.data.label}
            onChange={handleLabelChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <AlignLeft size={12} /> Notes
          </label>
          <textarea 
            value={node.data.notes || ''}
            onChange={handleNotesChange}
            placeholder="Add detailed notes..."
            className="w-full h-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm"
          />
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <CheckSquare size={12} /> Action Items
          </label>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="New task..."
              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
            />
            <button onClick={addTask} className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-2">
            {node.data.tasks?.map(task => (
              <div key={task.id} className="flex items-center gap-2 group">
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                />
                <span className={`flex-1 text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                  {task.text}
                </span>
                <button 
                  onClick={() => removeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
