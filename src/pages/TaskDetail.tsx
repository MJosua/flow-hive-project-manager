
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, User, Calendar, Tag } from "lucide-react";
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { selectMyTasks, updateTask } from '@/store/slices/taskSlice';
import { useToast } from '@/hooks/use-toast';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const myTasks = useAppSelector(selectMyTasks);
  
  const [isEditing, setIsEditing] = useState(false);
  const [timeEntry, setTimeEntry] = useState('');
  const [comment, setComment] = useState('');

  // Find the task or use fallback data
  const task = myTasks.find(t => t.task_id === parseInt(id || '0')) || {
    task_id: parseInt(id || '1'),
    project_id: 1,
    project_name: "Website Redesign",
    name: "Design Homepage Layout",
    description: "Create wireframes and mockups for the new homepage design",
    status: "in-progress",
    priority: "high",
    assigned_to: 10098,
    assigned_to_name: "Yosua Gultom",
    created_by: 10098,
    created_by_name: "Yosua Gultom",
    due_date: "2024-02-15",
    estimated_hours: 20,
    actual_hours: 12,
    created_date: "2024-01-15",
    updated_date: "2024-01-18",
    tags: ["design", "frontend"]
  };

  const [editData, setEditData] = useState({
    name: task.name,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    estimated_hours: task.estimated_hours?.toString() || '0'
  });

  const priorityColors: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800',
  };

  const statusColors: Record<string, string> = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'review': 'bg-yellow-100 text-yellow-800',
    'done': 'bg-green-100 text-green-800',
  };

  const handleSave = async () => {
    try {
      await dispatch(updateTask({
        id: task.task_id,
        data: {
          ...editData,
          estimated_hours: parseInt(editData.estimated_hours) || 0
        }
      }));
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleTimeEntry = () => {
    if (timeEntry) {
      toast({
        title: "Time Logged",
        description: `${timeEntry} hours logged for this task`,
      });
      setTimeEntry('');
    }
  };

  const handleComment = () => {
    if (comment) {
      toast({
        title: "Comment Added",
        description: "Your comment has been added",
      });
      setComment('');
    }
  };

  return (
    <AppLayoutNew>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/my-tasks')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tasks
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{task.name}</h1>
              <p className="text-gray-600">{task.project_name}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Task</Button>
            )}
          </div>
        </div>

        {/* Task Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Tag className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className={statusColors[task.status]}>{task.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Tag className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Priority</p>
                  <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Time</p>
                  <p className="text-lg font-bold">{task.actual_hours || 0}h / {task.estimated_hours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Due Date</p>
                  <p className="text-lg font-bold">{new Date(task.due_date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Task Details</TabsTrigger>
            <TabsTrigger value="time">Time Tracking</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Task Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Task Name</Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Status</Label>
                        <Select value={editData.status} onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Priority</Label>
                        <Select value={editData.priority} onValueChange={(value) => setEditData(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="estimated_hours">Estimated Hours</Label>
                      <Input
                        id="estimated_hours"
                        type="number"
                        value={editData.estimated_hours}
                        onChange={(e) => setEditData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Description</h3>
                      <p className="text-gray-600 mt-1">{task.description || 'No description provided'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Assigned To</h3>
                        <p className="text-gray-600">{task.assigned_to_name}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Created By</h3>
                        <p className="text-gray-600">{task.created_by_name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Created Date</h3>
                        <p className="text-gray-600">{new Date(task.created_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Last Updated</h3>
                        <p className="text-gray-600">{new Date(task.updated_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {task.tags && task.tags.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900">Tags</h3>
                        <div className="flex space-x-2 mt-1">
                          {task.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time">
            <Card>
              <CardHeader>
                <CardTitle>Time Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="timeEntry">Log Time (hours)</Label>
                    <Input
                      id="timeEntry"
                      type="number"
                      step="0.25"
                      value={timeEntry}
                      onChange={(e) => setTimeEntry(e.target.value)}
                      placeholder="0.5"
                    />
                  </div>
                  <Button onClick={handleTimeEntry}>Log Time</Button>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Time Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span>Estimated Hours:</span>
                      <span className="font-medium">{task.estimated_hours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actual Hours:</span>
                      <span className="font-medium">{task.actual_hours || 0}h</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span>Remaining:</span>
                      <span className="font-medium">{(task.estimated_hours || 0) - (task.actual_hours || 0)}h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Comments & Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="comment">Add Comment</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add your comment..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleComment}>Add Comment</Button>
                </div>
                
                <div className="pt-4">
                  <p className="text-center text-gray-500 py-8">No comments yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>File Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">File management will be implemented next</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayoutNew>
  );
};

export default TaskDetail;
