
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Users, AlertCircle } from 'lucide-react';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface GanttTask {
  task_id: number;
  name: string;
  start: string;
  end: string;
  duration: number;
  progress: number;
  assigned_to_name?: string;
  priority: string;
  status: string;
  dependencies: number[];
}

interface GanttData {
  project: any;
  tasks: GanttTask[];
  dependencies: any[];
}

const GanttChart = () => {
  const [ganttData, setGanttData] = useState<GanttData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number>(1); // Default project ID
  const { toast } = useToast();

  useEffect(() => {
    fetchGanttData();
  }, [selectedProject]);

  const fetchGanttData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGanttData(selectedProject.toString());
      if (response.success) {
        setGanttData(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching Gantt data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch Gantt data",
        variant: "destructive",
      });
      
      // Use fallback data for development
      setGanttData({
        project: { name: "Sample Project", manager_name: "Project Manager" },
        tasks: [
          {
            task_id: 1,
            name: "Project Planning",
            start: "2024-01-15",
            end: "2024-01-25",
            duration: 80,
            progress: 100,
            assigned_to_name: "John Doe",
            priority: "high",
            status: "completed",
            dependencies: []
          },
          {
            task_id: 2,
            name: "Design Phase",
            start: "2024-01-26",
            end: "2024-02-15",
            duration: 160,
            progress: 75,
            assigned_to_name: "Jane Smith",
            priority: "high",
            status: "in-progress",
            dependencies: [1]
          },
          {
            task_id: 3,
            name: "Development",
            start: "2024-02-16",
            end: "2024-03-30",
            duration: 320,
            progress: 30,
            assigned_to_name: "Bob Wilson",
            priority: "medium",
            status: "in-progress",
            dependencies: [2]
          }
        ],
        dependencies: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gantt Chart</CardTitle>
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
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Gantt Chart - {ganttData?.project?.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Project Manager: {ganttData?.project?.manager_name}
              </p>
            </div>
            <Button onClick={fetchGanttData} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Timeline Header */}
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground border-b pb-2">
              <div className="col-span-3">Task</div>
              <div className="col-span-2">Assignee</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-2">Progress</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Priority</div>
            </div>

            {/* Tasks */}
            {ganttData?.tasks.map((task, index) => (
              <div key={task.task_id} className="space-y-2">
                <div className="grid grid-cols-12 gap-2 items-center py-2 hover:bg-muted/50 rounded-lg px-2">
                  <div className="col-span-3">
                    <div className="font-medium">{task.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {task.start} → {task.end}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="text-sm">{task.assigned_to_name || 'Unassigned'}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-sm">{calculateDuration(task.start, task.end)} days</span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{task.progress}%</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="secondary" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  </div>
                </div>

                {/* Visual Timeline Bar */}
                <div className="ml-2 relative">
                  <div className="h-6 bg-gray-100 rounded relative">
                    <div 
                      className={`h-full rounded ${getPriorityColor(task.priority)} opacity-70`}
                      style={{ 
                        width: `${Math.min(task.progress, 100)}%`,
                        minWidth: '2px'
                      }}
                    ></div>
                    {task.dependencies.length > 0 && (
                      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {ganttData?.tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No tasks found for this project
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Critical Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Low Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-orange-500" />
              <span>Has Dependencies</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GanttChart;
