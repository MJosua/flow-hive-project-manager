
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, Clock, Calendar } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppSelector';
import { selectTasks, selectKanbanColumns, moveTaskInKanban, updateTaskStatus } from '@/store/slices/taskSlice';
import type { Task, KanbanColumn } from '@/types/projectTypes';

interface KanbanBoardProps {
  projectId?: number;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const columns = useAppSelector(selectKanbanColumns);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Filter tasks by project if projectId is provided
  const filteredTasks = projectId 
    ? tasks.filter(task => task.project_id === projectId)
    : tasks;

  const getTasksByStatus = (status: Task['status']) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.task_id.toString());
    
    // Add visual feedback to the dragged element
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnStatus: Task['status']) => {
    e.preventDefault();
    setDragOverColumn(columnStatus);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're leaving the column entirely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedTask && draggedTask.status !== newStatus) {
      // Update local state immediately for better UX
      dispatch(moveTaskInKanban({ 
        taskId: draggedTask.task_id, 
        newStatus 
      }));
      
      // Also dispatch the API call to update the task status
      dispatch(updateTaskStatus({ 
        taskId: draggedTask.task_id, 
        status: newStatus 
      }));
    }
    setDraggedTask(null);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <Card 
      className={`mb-3 cursor-grab hover:shadow-md transition-all duration-200 ${
        draggedTask?.task_id === task.task_id ? 'opacity-50 scale-95' : ''
      } hover:scale-105 active:cursor-grabbing`}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm line-clamp-2">{task.name}</h4>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </Badge>
          
          <div className="flex items-center space-x-2">
            {task.due_date && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}
            
            {task.estimated_hours && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {task.estimated_hours}h
              </div>
            )}
          </div>
        </div>

        {task.assigned_to_name && (
          <div className="flex items-center mt-3">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {task.assigned_to_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground ml-2">
              {task.assigned_to_name}
            </span>
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                +{task.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const KanbanColumn: React.FC<{ column: KanbanColumn }> = ({ column }) => {
    const columnTasks = getTasksByStatus(column.status);
    const isOverLimit = column.limit && columnTasks.length > column.limit;
    const isDragOver = dragOverColumn === column.status;

    return (
      <div 
        className={`flex-1 min-w-80 transition-all duration-200 ${
          isDragOver ? 'scale-105' : ''
        }`}
        onDragOver={handleDragOver}
        onDragEnter={(e) => handleDragEnter(e, column.status)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, column.status)}
      >
        <Card className={`h-full transition-all duration-200 ${
          isDragOver ? 'ring-2 ring-blue-400 shadow-lg bg-blue-50' : ''
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: column.color }}
                />
                {column.name}
                <Badge 
                  variant="secondary" 
                  className={`ml-2 ${isOverLimit ? 'bg-red-100 text-red-800' : ''}`}
                >
                  {columnTasks.length}
                  {column.limit && `/${column.limit}`}
                </Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className={`space-y-3 min-h-96 transition-all duration-200 ${
              isDragOver ? 'bg-blue-25' : ''
            }`}>
              {columnTasks.map((task) => (
                <TaskCard key={task.task_id} task={task} />
              ))}
              
              {columnTasks.length === 0 && (
                <div className={`text-center py-8 text-muted-foreground transition-all duration-200 ${
                  isDragOver ? 'text-blue-600' : ''
                }`}>
                  <div className="text-4xl mb-2">
                    {isDragOver ? '⬇️' : '📋'}
                  </div>
                  <p className="text-sm">
                    {isDragOver ? 'Drop task here' : 'No tasks yet'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kanban Board</h2>
          <p className="text-muted-foreground">Drag and drop tasks to update their status</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6">
        {columns.map((column) => (
          <KanbanColumn key={column.column_id} column={column} />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
