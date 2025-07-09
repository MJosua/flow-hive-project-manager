
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, User, Calendar } from 'lucide-react';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/services/loggingService';
import CreateTaskModal from '@/components/modals/CreateTaskModal';

interface KanbanTask {
  task_id: number;
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to_name?: string;
  due_date?: string;
  tags?: string[];
}

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  tasks: KanbanTask[];
  color: string;
}

interface KanbanBoardProps {
  projectId?: number;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId = 1 }) => {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedColumnStatus, setSelectedColumnStatus] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchKanbanData();
  }, [projectId]);

  const fetchKanbanData = async () => {
    try {
      setLoading(true);
      logger.logInfo('KanbanBoard: Fetching kanban data', { projectId });

      const response = await apiService.getKanbanData(projectId.toString());
      console.log("response", response)
      if (response.success && Array.isArray(response.data.columns)) {
        setColumns(response.data.columns);
        logger.logInfo('KanbanBoard: Data loaded successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      logger.logError('KanbanBoard: Failed to fetch data', error);
      toast({
        title: "Error",
        description: "Failed to load kanban data, using fallback",
        variant: "destructive",
      });

      // Use fallback data for development
      const fallbackColumns: KanbanColumn[] = [
        {
          id: 'todo',
          title: 'To Do',
          status: 'todo',
          color: 'bg-gray-100',
          tasks: [
            {
              task_id: 1,
              name: 'Setup Development Environment',
              description: 'Configure development tools and dependencies',
              priority: 'high',
              assigned_to_name: 'John Doe',
              due_date: '2024-02-15',
              tags: ['setup', 'environment']
            },
            {
              task_id: 2,
              name: 'Design Database Schema',
              priority: 'medium',
              assigned_to_name: 'Jane Smith',
              due_date: '2024-02-20',
              tags: ['database', 'design']
            }
          ]
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          status: 'in-progress',
          color: 'bg-blue-100',
          tasks: [
            {
              task_id: 3,
              name: 'Implement User Authentication',
              description: 'Create login and registration functionality',
              priority: 'high',
              assigned_to_name: 'Bob Wilson',
              due_date: '2024-02-25',
              tags: ['auth', 'security']
            }
          ]
        },
        {
          id: 'review',
          title: 'In Review',
          status: 'review',
          color: 'bg-yellow-100',
          tasks: [
            {
              task_id: 4,
              name: 'Code Review - API Endpoints',
              priority: 'medium',
              assigned_to_name: 'Alice Johnson',
              due_date: '2024-02-18',
              tags: ['review', 'api']
            }
          ]
        },
        {
          id: 'done',
          title: 'Done',
          status: 'done',
          color: 'bg-green-100',
          tasks: [
            {
              task_id: 5,
              name: 'Project Setup',
              description: 'Initial project structure and configuration',
              priority: 'low',
              assigned_to_name: 'Team Lead',
              due_date: '2024-02-10',
              tags: ['setup', 'complete']
            }
          ]
        }
      ];
      setColumns(fallbackColumns);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDragStart = (e: React.DragEvent, task: KanbanTask, columnId: string) => {
    setDraggedTask(task);
    setDraggedFromColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedTask || !draggedFromColumn || draggedFromColumn === targetColumnId) {
      setDraggedTask(null);
      setDraggedFromColumn(null);
      return;
    }

    try {
      logger.logInfo('KanbanBoard: Moving task via drag & drop', {
        taskId: draggedTask.task_id,
        from: draggedFromColumn,
        to: targetColumnId
      });

      await apiService.moveTaskKanban(draggedTask.task_id.toString(), {
        status: targetColumnId,
        group_id: targetColumnId
      });

      // Update local state
      setColumns(prevColumns => {
        const newColumns = [...prevColumns];

        // Remove task from source column
        const sourceColumn = newColumns.find(col => col.id === draggedFromColumn);
        if (sourceColumn) {
          sourceColumn.tasks = sourceColumn.tasks.filter(task => task.task_id !== draggedTask.task_id);
        }

        // Add task to target column
        const targetColumn = newColumns.find(col => col.id === targetColumnId);
        if (targetColumn) {
          targetColumn.tasks.push(draggedTask);
        }

        return newColumns;
      });

      toast({
        title: "Success",
        description: "Task moved successfully",
      });
      logger.logInfo('KanbanBoard: Task moved successfully via drag & drop');
    } catch (error: any) {
      logger.logError('KanbanBoard: Failed to move task via drag & drop', error);
      toast({
        title: "Error",
        description: error.message || "Failed to move task",
        variant: "destructive",
      });
    }

    setDraggedTask(null);
    setDraggedFromColumn(null);
  };

  const handleAddTaskToColumn = (columnStatus: string) => {
    setSelectedColumnStatus(columnStatus);
    setIsTaskModalOpen(true);
  };

  const handleTaskCreated = (newTask: any) => {
    // Add the new task to the appropriate column
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const targetColumn = newColumns.find(col => col.status === selectedColumnStatus);
      if (targetColumn) {
        targetColumn.tasks.push({
          task_id: newTask.task_id,
          name: newTask.name,
          description: newTask.description,
          priority: newTask.priority,
          assigned_to_name: newTask.assigned_to_name,
          due_date: newTask.due_date,
          tags: newTask.tags || []
        });
      }
      return newColumns;
    });

    logger.logInfo('KanbanBoard: New task added to column', {
      taskId: newTask.task_id,
      columnStatus: selectedColumnStatus
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kanban Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <Button onClick={fetchKanbanData} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={`p-4 rounded-lg ${column.color}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary">{column.tasks?.length || 0}</Badge>
              </div>
            </div>

            <div className="space-y-3 min-h-[400px]">
              {(column.tasks || []).map((task) => (
                <Card
                  key={task.task_id}
                  className="cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, column.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight">{task.name}</h4>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>

                      {task.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {task.assigned_to_name && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <User className="h-3 w-3" />
                          {task.assigned_to_name}
                        </div>
                      )}

                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              +{task.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card
                className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => handleAddTaskToColumn(column.status)}
              >
                <CardContent className="p-4">
                  <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-gray-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedColumnStatus('');
        }}
        onTaskCreated={handleTaskCreated}
        projectId={projectId}
        defaultStatus={selectedColumnStatus}
      />
    </div>
  );
};

export default KanbanBoard;
