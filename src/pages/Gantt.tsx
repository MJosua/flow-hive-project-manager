
import React, { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useSearch } from '@/contexts/SearchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns';
import { Layout } from '@/components/layout/Layout';

const Gantt = () => {
  const { projects, tasks, users, selectedProject, setSelectedProject } = useApp();
  const { searchQuery, highlightText } = useSearch();

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const projectFilteredTasks = selectedProject 
    ? tasks.filter(task => task.projectId === selectedProject.id)
    : tasks;

  // Apply search filtering
  const filteredTasks = searchQuery.trim()
    ? projectFilteredTasks.filter(task => {
        const assignee = users.find(u => u.user_id === task.assigneeId);
        const searchLower = searchQuery.toLowerCase();
        
        return task.title.toLowerCase().includes(searchLower) ||
               task.description.toLowerCase().includes(searchLower) ||
               task.status.toLowerCase().includes(searchLower) ||
               task.priority.toLowerCase().includes(searchLower) ||
               task.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
               (assignee && assignee.name.toLowerCase().includes(searchLower));
      })
    : projectFilteredTasks;

  const getTaskPosition = (task: any) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    const startDay = Math.max(0, Math.floor((taskStart.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)));
    const duration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));
    
    return { startDay, duration: Math.max(1, duration) };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'review': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gantt Chart</h1>
            <p className="text-gray-600">
              Timeline view of project tasks and milestones
              {searchQuery && (
                <span className="ml-2 text-sm text-yellow-600">
                  • Filtering by: "{searchQuery}" ({filteredTasks.length} tasks)
                </span>
              )}
            </p>
          </div>
          
          <Select 
            value={selectedProject?.id || 'all'} 
            onValueChange={(value) => {
              const project = value === 'all' ? null : projects.find(p => p.id === value);
              setSelectedProject(project || null);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Timeline - {format(currentMonth, 'MMMM yyyy')}</span>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span>Todo</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              {/* Header with dates */}
              <div className="flex mb-4">
                <div className="w-64 flex-shrink-0 pr-4">
                  <div className="h-8 flex items-center font-medium text-gray-900">Task</div>
                </div>
                <div className="flex-1 flex">
                  {days.map((day, index) => (
                    <div key={index} className="flex-1 min-w-8 text-center">
                      <div className="text-xs text-gray-500">{format(day, 'd')}</div>
                      <div className="text-xs text-gray-400">{format(day, 'EEE')}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {filteredTasks.map((task) => {
                  const assignee = users.find(u => u.user_id === task.assigneeId);
                  const { startDay, duration } = getTaskPosition(task);
                  
                  return (
                    <div key={task.id} className="flex items-center">
                      {/* Task Info */}
                      <div className="w-64 flex-shrink-0 pr-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {highlightText(task.title, searchQuery)}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getStatusColor(task.status)} text-white border-0`}
                              >
                                {highlightText(task.status.replace('-', ' '), searchQuery)}
                              </Badge>
                              {assignee && (
                                <span className="text-xs text-gray-500">
                                  {highlightText(assignee.name, searchQuery)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex-1 relative h-8 flex items-center">
                        <div className="w-full grid grid-cols-31 gap-px">
                          {days.map((day, dayIndex) => (
                            <div key={dayIndex} className="h-6 bg-gray-50 border border-gray-100 relative">
                              {dayIndex >= startDay && dayIndex < startDay + duration && (
                                <div 
                                  className={`absolute inset-0 ${getStatusColor(task.status)} opacity-80 rounded-sm`}
                                  title={`${task.title} (${format(task.startDate, 'MMM d')} - ${format(task.endDate, 'MMM d')})`}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredTasks.length === 0 && searchQuery && (
                  <div className="text-center text-gray-500 py-8">
                    No tasks found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Gantt;
