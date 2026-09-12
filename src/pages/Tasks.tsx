import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import type { Task } from '../context/DataContext';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export default function Tasks() {
  const { tasks, setTasks } = useData();

  const handleStatusChange = (id: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const Column = ({ title, status, icon: Icon, colorClass }: { title: string, status: Task['status'], icon: any, colorClass: string }) => {
    const columnTasks = tasks.filter(t => t.status === status);
    
    return (
      <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col min-h-[500px]">
        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${colorClass}`}>
          <Icon size={20} />
          {title} ({columnTasks.length})
        </h3>
        <div className="flex flex-col gap-3 flex-1">
          {columnTasks.map(task => (
            <motion.div 
              layout
              key={task.id} 
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-gray-800 text-sm">{task.title}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex gap-2 mt-auto">
                {status !== 'todo' && <button onClick={() => handleStatusChange(task.id, 'todo')} className="text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Move to To-Do</button>}
                {status !== 'in-progress' && <button onClick={() => handleStatusChange(task.id, 'in-progress')} className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded">Start</button>}
                {status !== 'done' && <button onClick={() => handleStatusChange(task.id, 'done')} className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-2 py-1 rounded">Complete</button>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Work Orders</h1>
          <p className="text-gray-500 mt-1">Manage farm tasks and maintenance</p>
        </div>
      </div>

      <div className="flex gap-6">
        <Column title="To Do" status="todo" icon={AlertCircle} colorClass="text-gray-600" />
        <Column title="In Progress" status="in-progress" icon={Clock} colorClass="text-blue-600" />
        <Column title="Completed" status="done" icon={CheckCircle} colorClass="text-green-600" />
      </div>
    </motion.div>
  );
}
