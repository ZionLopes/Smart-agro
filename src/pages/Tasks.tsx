import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import type { Task } from '../context/DataContext';
import { CheckCircle, Clock, AlertCircle, Plus, Trash2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export default function Tasks() {
  const { tasks, setTasks } = useData();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');

  const handleStatusChange = (id: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle.trim(),
      status: 'todo',
      priority: newTaskPriority
    };
    
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="p-8 h-full overflow-y-auto">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Work Orders</h1>
          <p className="text-gray-500 mt-1">Manage farm tasks and maintenance</p>
        </div>
        
        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex gap-2">
          <input 
            type="text" 
            placeholder="New task description..." 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="px-3 py-2 bg-transparent focus:outline-none text-sm w-64"
          />
          <select 
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
            className="bg-gray-50 border border-gray-100 text-sm rounded-lg px-2 focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button 
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Plus size={20} />
          </button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* TO DO COLUMN */}
        <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col min-h-[500px]">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-600">
            <AlertCircle size={20} />
            To Do ({tasks.filter(t => t.status === 'todo').length})
          </h3>
          <div className="flex flex-col gap-3 flex-1">
            <AnimatePresence>
              {tasks.filter(t => t.status === 'todo').map(task => (
                <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 relative group">
                  <div className="flex justify-between items-start pr-6">
                    <span className="font-bold text-gray-800 text-sm">{task.title}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{task.priority}</span>
                  </div>
                  <button onClick={() => handleDelete(task.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Task"><Trash2 size={16} /></button>
                  <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
                    <button onClick={() => handleStatusChange(task.id, 'in-progress')} className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded">Start</button>
                    <button onClick={() => handleStatusChange(task.id, 'done')} className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-2 py-1 rounded">Complete</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* IN PROGRESS COLUMN */}
        <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col min-h-[500px]">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-600">
            <Clock size={20} />
            In Progress ({tasks.filter(t => t.status === 'in-progress').length})
          </h3>
          <div className="flex flex-col gap-3 flex-1">
            <AnimatePresence>
              {tasks.filter(t => t.status === 'in-progress').map(task => (
                <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 relative group">
                  <div className="flex justify-between items-start pr-6">
                    <span className="font-bold text-gray-800 text-sm">{task.title}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{task.priority}</span>
                  </div>
                  <button onClick={() => handleDelete(task.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Task"><Trash2 size={16} /></button>
                  <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
                    <button onClick={() => handleStatusChange(task.id, 'todo')} className="text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Move to To-Do</button>
                    <button onClick={() => handleStatusChange(task.id, 'done')} className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-2 py-1 rounded">Complete</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* DONE COLUMN */}
        <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col min-h-[500px]">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            Completed ({tasks.filter(t => t.status === 'done').length})
          </h3>
          <div className="flex flex-col gap-3 flex-1">
            <AnimatePresence>
              {tasks.filter(t => t.status === 'done').map(task => (
                <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 relative group">
                  <div className="flex justify-between items-start pr-6">
                    <span className="font-bold text-gray-800 text-sm">{task.title}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{task.priority}</span>
                  </div>
                  <button onClick={() => handleDelete(task.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Task"><Trash2 size={16} /></button>
                  <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
                    <button onClick={() => handleStatusChange(task.id, 'todo')} className="text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Move to To-Do</button>
                    <button onClick={() => handleStatusChange(task.id, 'in-progress')} className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded">Restart</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
