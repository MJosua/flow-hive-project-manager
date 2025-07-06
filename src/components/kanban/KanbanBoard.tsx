
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, User, MoreHorizontal } from 'lucide-react';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface KanbanTask {
  task_id: number;
  name: string;
  description?: string;
  assigned_to_name?: string;
  priority: string;
  status: string;
  due_date?: string;
  estimated_hours?: number;
  progress?: number;
}

interface KanbanColumn {
  group_id: string | number;
  name: string;
  status: string;
  color?: string;
  tasks: KanbanTask[];
}

interface KanbanData {
  project: any;
  columns: KanbanColumn[];
}

const KanbanBoard = () => {
  const [kanbanData, setKanbanData] = useState<KanbanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number>(1); // Default project ID
  const { toast } = useToast();

  useEffect(() => {
    fetchKanbanData();
  }, [selectedProject]);

  const fetchKanbanData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getKanbanData(selectedProject.toString());
      if (response.success) {
        setKanbanData(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching Kanban data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch Kanban data",
        variant: "destructive",
      });
      
      // Use fallback data for development
      setKanbanData({
        project: { name: "Sample Project" },
        columns: [
          {
            group_id: 'todo',
            name: 'To Do',
            status: 'todo',
            color: '#94a3b8',
            tasks: [
              {
                task_id: 1,
                name: "Setup Project Structure",
                description: "Initialize the project with necessary folders and files",
                assigned_to_name: "John Doe",
                priority: "high",
                status: "todo",
                due_date: "2024-02-15",
                estimated_hours: 8
              },
              {
                task_id: 2,
                name: "Database Design",
                description: "Design the database schema for the application",
                assigned_to_name: "Jane Smith",
                priority: "medium",
                status: "todo",
                due_date: "2024-02-20",
                estimated_hours: 16
              }
            ]
          },
          {
            group_id: 'in-progress',
            name: 'In Progress',
            status: 'in-progress',
            color: '#3b82f6',
            tasks: [
              {
                task_id: 3,
                name: "API Development",
                description: "Develop REST APIs for the application",
                assigned_to_name: "Bob Wilson",
                priority: "high",
                status: "in-progress",
                due_date: "2024-02-25",
                estimated_hours: 32,
                progress: 60
              }
            ]
          },
          {
            group_id: 'review',
            name: 'Review',
            status: 'review',
            color: '#f59e0b',
            tasks: [
              {
                task_id: 4,
                name: "Code Review",
                description: "Review the implemented features",
                assigned_to_name: "Alice Brown",
                priority: "medium",
                status: "review",
                due_date: "2024-02-18",
                estimated_hours: 4,
                progress: 90
              }
            ]
          },
          {
            group_id: 'done',
            name: 'Done',
            status: 'done',
            color: '#10b981',
            tasks: [
              {
                task_id: 5,
                name: "Requirements Analysis",
                description: "Analyze and document project requirements",
                assigned_to_name: "Charlie Davis",
                priority: "high",
                status: "done",
                due_date: "2024-02-10",
                estimated_hours: 12,
                progress: 100
              }
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskMove = async (taskId: number, newStatus: string, newGroupId?: string | number) => {
    try {
      await apiService.moveTaskKanban(taskId.toString(), {
        new_status: newStatus,
        new_group_id: newGroupId
      });
      
      toast({
        title: "Success",
        description: "Task moved successfully",
      });
      
      // Refresh data
      fetchKanbanData();
    } catch (error: any) {
      console.error('Error moving task:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to move task",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Kanban Board - {kanbanData?.project?.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Drag and drop tasks between columns to update their status
              </p>
            </div>
            <Button onClick={fetchKanbanData} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kanbanData?.columns.map((column) => (
              <div key={column.group_id} className="space-y-4">
                {/* Column Header */}
                <div 
                  className="flex items-center justify-between p-3 rounded-lg border-2 border-dashed"
                  style={{ borderColor: column.color || '#94a3b8' }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color || '#94a3b8' }}
                    ></div>
                    <h3 className="font-medium">{column.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {column.tasks.length}
                    </Badge>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <Card key={task.task_id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Task Header */}
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm leading-tight">{task.name}</h4>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Description */}
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Progress Bar */}
                          {task.progress !== undefined && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{task.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Task Meta */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {task.due_date && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {task.estimated_hours && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{task.estimated_hours}h</span>
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                          </div>

                          {/* Assignee */}
                          {task.assigned_to_name && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getInitials(task.assigned_to_name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {task.assigned_to_name}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {column.tasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <p className="text-sm">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {kanbanData?.columns.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No columns found for this project
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanBoard;
