import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { CampaignTask, TaskCategory, TaskPriority, TaskStatus, SubCounty } from '../types/campaign';
import { SUB_COUNTIES } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input, Select, Textarea } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Clock,
  Calendar,
  User,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  CircleDot,
  Check,
} from 'lucide-react';

const TASK_CATEGORIES: TaskCategory[] = [
  'Logistics & Sound',
  'Field Mobilization',
  'Media & Publicity',
  'Security & Protocol',
  'Legal & Compliance',
  'Community Engagement',
];

interface TasksPageProps {
  newTaskModalOpen: boolean;
  setNewTaskModalOpen: (open: boolean) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  newTaskModalOpen,
  setNewTaskModalOpen,
}) => {
  const { tasks, addTask, toggleTaskStatus, updateTask, deleteTask, stats } = useCampaign();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [subCountyFilter, setSubCountyFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State for New Task
  const [newTitle, setNewTitle] = useState('');
  const [newSubCounty, setNewSubCounty] = useState<SubCounty>('Countywide');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Field Mobilization');
  const [newPriority, setNewPriority] = useState<TaskPriority>('High');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'All' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
    if (subCountyFilter !== 'All' && task.subCounty !== subCountyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        task.title.toLowerCase().includes(q) ||
        task.assigneeName.toLowerCase().includes(q) ||
        task.category.toLowerCase().includes(q) ||
        (task.description && task.description.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAssignee.trim()) {
      alert('Please provide Task Title and Assignee');
      return;
    }

    addTask({
      title: newTitle.trim(),
      subCounty: newSubCounty,
      category: newCategory,
      priority: newPriority,
      status: 'Pending',
      assigneeName: newAssignee.trim(),
      dueDate: newDueDate || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      description: newDescription.trim(),
    });

    // Reset Form
    setNewTitle('');
    setNewAssignee('');
    setNewDueDate('');
    setNewDescription('');
    setNewPriority('High');
    setNewTaskModalOpen(false);
  };

  const highPriorityPending = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-zinc-900">
              Operational Field Tasks
            </h2>
            <Badge variant="yellow" className="font-bold">
              {stats.taskCompletionRate}% Complete
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Logistical assignments, police filings, materials distribution, and volunteer marshaling.
          </p>
        </div>

        <Button
          variant="yellow"
          onClick={() => setNewTaskModalOpen(true)}
          className="font-bold flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Operational Task
        </Button>
      </div>

      {/* Task Metrics & Progress */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Pending Tasks</span>
          <p className="text-xl font-black text-blue-600">{stats.pendingTasks}</p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Completed</span>
          <p className="text-xl font-black text-emerald-600">{stats.completedTasks}</p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">High Priority Urgent</span>
          <p className="text-xl font-black text-amber-600">{highPriorityPending}</p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Overall Progress</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-zinc-100 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{ width: `${stats.taskCompletionRate}%` }}
              />
            </div>
            <span className="text-xs font-black text-zinc-900">{stats.taskCompletionRate}%</span>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <Card className="border border-zinc-200 shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search task, assignee, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Status */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Only</option>
              <option value="In Progress">In Progress Only</option>
              <option value="Completed">Completed Only</option>
            </Select>

            {/* Priority */}
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </Select>

            {/* Sub-county */}
            <Select
              value={subCountyFilter}
              onChange={(e) => setSubCountyFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Territories</option>
              {SUB_COUNTIES.map((sc) => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
              <option value="Countywide">Countywide HQ</option>
            </Select>
          </div>

          {(statusFilter !== 'All' || priorityFilter !== 'All' || subCountyFilter !== 'All' || searchQuery) && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
              <span className="text-zinc-500">
                Showing <strong>{filteredTasks.length}</strong> of {tasks.length} tasks
              </span>
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setPriorityFilter('All');
                  setSubCountyFilter('All');
                  setSearchQuery('');
                }}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center space-y-3">
          <CheckSquare className="h-10 w-10 text-zinc-300 mx-auto" />
          <h3 className="font-bold text-zinc-800">No tasks match your criteria</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search filters or click "+ Add Operational Task" to create a new one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-zinc-50/70 border-zinc-200 text-zinc-500'
                    : 'bg-white border-zinc-200 hover:border-yellow-400 hover:shadow-xs text-zinc-900'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Interactive Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-zinc-400 bg-white hover:border-blue-600'
                    }`}
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  >
                    {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-zinc-400' : 'text-zinc-900'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-zinc-500 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 pt-0.5">
                      <span className="flex items-center gap-1 font-medium text-blue-800">
                        {task.subCounty}
                      </span>
                      <span>•</span>
                      <span className="text-zinc-600">{task.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-zinc-700">
                        <User className="h-3 w-3 text-zinc-400" />
                        {task.assigneeName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-zinc-700">
                        <Calendar className="h-3 w-3 text-zinc-400" />
                        Due: {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant={
                        task.priority === 'High'
                          ? 'destructive'
                          : task.priority === 'Medium'
                          ? 'blue'
                          : 'default'
                      }
                      className="text-[10px]"
                    >
                      {task.priority} Priority
                    </Badge>

                    <Badge
                      variant={
                        isCompleted
                          ? 'success'
                          : task.status === 'In Progress'
                          ? 'warning'
                          : 'outline'
                      }
                      className="text-[10px]"
                    >
                      {task.status}
                    </Badge>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Delete task: "${task.title}"?`)) {
                        deleteTask(task.id);
                      }
                    }}
                    className="text-zinc-400 hover:text-red-600 h-8 w-8 p-0"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEW TASK MODAL */}
      <Dialog open={newTaskModalOpen} onOpenChange={setNewTaskModalOpen}>
        <DialogContent onClose={() => setNewTaskModalOpen(false)}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-bold">
                <CheckSquare className="h-4 w-4" />
              </div>
              <DialogTitle>Assign Field Operational Task</DialogTitle>
            </div>
            <DialogDescription>
              Assign logistics, literature distribution, or protocol tasks to a team coordinator.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs text-zinc-700">
            <div>
              <label className="block font-bold text-zinc-900 mb-1">Task Title *</label>
              <Input
                placeholder="e.g. Confirm 2,000 voter manifestos printed for Kieni rally"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-900 mb-1">Target Sub-County</label>
                <Select
                  value={newSubCounty}
                  onChange={(e) => setNewSubCounty(e.target.value as SubCounty)}
                >
                  <option value="Countywide">Countywide</option>
                  {SUB_COUNTIES.map((sc) => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1">Category</label>
                <Select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                >
                  {TASK_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-900 mb-1">Priority</label>
                <Select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1">Due Date</label>
                <Input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-900 mb-1">Assignee Name *</label>
              <Input
                placeholder="e.g. Peter Mwangi / Ann Muthoni / Kelvin Kamau"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-900 mb-1">Task Instructions</label>
              <Textarea
                placeholder="Key deliverables, contact numbers, delivery addresses..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewTaskModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="yellow" className="font-bold">
                Assign Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
