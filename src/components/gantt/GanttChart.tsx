
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Diamond, MoreHorizontal, ZoomIn, ZoomOut } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectTasks } from '@/store/slices/taskSlice';
import type { Task, GanttTask } from '@/types/projectTypes';

interface GanttChartProps {
  projectId?: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ projectId }) => {
  const tasks = useAppSelector(selectTasks);
  const [zoomLevel, setZoomLevel] = useState<'days' | 'weeks' | 'months'>('weeks');
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);
  const [viewStartDate, setViewStartDate] = useState(new Date());

  // Convert regular tasks to Gantt tasks with additional properties
  const ganttTasks: GanttTask[] = tasks
    .filter(task => projectId ? task.project_id === projectId : true)
    .map(task => ({
      ...task,
      start_date: task.created_date,
      gantt_duration: task.estimated_hours ? Math.ceil(task.estimated_hours / 8) : 5, // Convert hours to days
      progress: getTaskProgress(task.status),
      is_milestone: task.priority === 'critical' && task.estimated_hours && task.estimated_hours <= 8,
      dependencies: task.dependencies || []
    }));

  function getTaskProgress(status: Task['status']): number {
    switch (status) {
      case 'done': return 100;
      case 'review': return 85;
      case 'in-progress': return 50;
      case 'blocked': return 25;
      case 'todo': return 0;
      default: return 0;
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      'low': '#94a3b8',
      'medium': '#3b82f6',
      'high': '#f59e0b',
      'critical': '#ef4444'
    };
    return colors[priority];
  };

  const generateTimeScale = () => {
    const scale = [];
    const start = new Date(viewStartDate);
    const end = new Date(start);
    end.setDate(end.getDate() + (zoomLevel === 'days' ? 30 : zoomLevel === 'weeks' ? 84 : 365));

    if (zoomLevel === 'days') {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        scale.push({
          date: new Date(d),
          label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          width: 40
        });
      }
    } else if (zoomLevel === 'weeks') {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
        const weekEnd = new Date(d);
        weekEnd.setDate(weekEnd.getDate() + 6);
        scale.push({
          date: new Date(d),
          label: `Week ${Math.ceil(d.getDate() / 7)}`,
          width: 80
        });
      }
    } else {
      for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
        scale.push({
          date: new Date(d),
          label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          width: 120
        });
      }
    }
    return scale;
  };

  const timeScale = generateTimeScale();
  const totalWidth = timeScale.reduce((sum, item) => sum + item.width, 0);

  const getTaskPosition = (task: GanttTask) => {
    const taskStart = new Date(task.start_date);
    const scaleStart = timeScale[0]?.date || new Date();
    const daysDiff = Math.floor((taskStart.getTime() - scaleStart.getTime()) / (1000 * 60 * 60 * 24));
    
    const pixelsPerDay = zoomLevel === 'days' ? 40 : zoomLevel === 'weeks' ? 80/7 : 120/30;
    const left = Math.max(0, daysDiff * pixelsPerDay);
    const width = Math.max(20, task.gantt_duration * pixelsPerDay);

    return { left, width };
  };

  const TaskBar: React.FC<{ task: GanttTask; index: number }> = ({ task, index }) => {
    const { left, width } = getTaskPosition(task);
    const color = getPriorityColor(task.priority);

    return (
      <div className="relative h-12 border-b border-gray-100 flex items-center">
        <div 
          className="absolute bg-white rounded shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
          style={{ 
            left: `${left}px`, 
            width: `${width}px`,
            backgroundColor: `${color}20`,
            borderColor: color
          }}
          onClick={() => setSelectedTask(task)}
        >
          <div className="h-8 flex items-center px-2 relative overflow-hidden">
            {task.is_milestone ? (
              <Diamond className="w-4 h-4 mr-1" style={{ color }} />
            ) : (
              <div 
                className="absolute left-0 top-0 h-full rounded transition-all"
                style={{ 
                  width: `${task.progress}%`,
                  backgroundColor: color,
                  opacity: 0.6
                }}
              />
            )}
            <span className="text-xs font-medium truncate relative z-10">
              {task.name}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const TaskRow: React.FC<{ task: GanttTask; index: number }> = ({ task, index }) => (
    <div className="flex">
      <div className="w-80 p-3 border-r border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {task.is_milestone && <Diamond className="w-4 h-4 text-yellow-500" />}
              <span className="font-medium text-sm">{task.name}</span>
            </div>
            <div className="flex items-center space-x-3 mt-1">
              <Badge variant="outline" className="text-xs" style={{ backgroundColor: `${getPriorityColor(task.priority)}20` }}>
                {task.priority}
              </Badge>
              {task.assigned_to_name && (
                <div className="flex items-center space-x-1">
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-xs">
                      {task.assigned_to_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{task.assigned_to_name}</span>
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 relative">
        <TaskBar task={task} index={index} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gantt Chart</h2>
          <p className="text-muted-foreground">Project timeline and task dependencies</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={zoomLevel === 'days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setZoomLevel('days')}
          >
            Days
          </Button>
          <Button
            variant={zoomLevel === 'weeks' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setZoomLevel('weeks')}
          >
            Weeks
          </Button>
          <Button
            variant={zoomLevel === 'months' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setZoomLevel('months')}
          >
            Months
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {/* Header */}
            <div className="flex border-b-2 border-gray-200">
              <div className="w-80 p-4 bg-gray-100 border-r border-gray-200">
                <h3 className="font-semibold">Tasks</h3>
              </div>
              <div className="flex-1 bg-gray-100">
                <div className="flex" style={{ width: `${totalWidth}px` }}>
                  {timeScale.map((scale, index) => (
                    <div
                      key={index}
                      className="border-r border-gray-300 p-2 text-center"
                      style={{ width: `${scale.width}px` }}
                    >
                      <span className="text-xs font-medium">{scale.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Rows */}
            <div className="min-h-96">
              {ganttTasks.length > 0 ? (
                ganttTasks.map((task, index) => (
                  <TaskRow key={task.task_id} task={task} index={index} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No tasks to display</p>
                  <p className="text-sm">Add tasks to see them on the timeline</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Details Panel */}
      {selectedTask && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Task Name</label>
                <p className="mt-1">{selectedTask.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="mt-1">
                  <Badge variant="outline">{selectedTask.status}</Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                <p className="mt-1">
                  <Badge variant="outline" style={{ backgroundColor: `${getPriorityColor(selectedTask.priority)}20` }}>
                    {selectedTask.priority}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Progress</label>
                <p className="mt-1">{selectedTask.progress}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Duration</label>
                <p className="mt-1 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedTask.gantt_duration} days
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                <p className="mt-1">{selectedTask.assigned_to_name || 'Unassigned'}</p>
              </div>
              {selectedTask.description && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 text-sm">{selectedTask.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GanttChart;
