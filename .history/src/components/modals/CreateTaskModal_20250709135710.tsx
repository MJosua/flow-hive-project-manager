
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/services/apiService';
import { logger } from '@/services/loggingService';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: any) => void;
  projectId: number;
  defaultStatus?: string;
}

interface User {
  user_id: number;
  username: string;
  firstname: string;
  lastname: string;
  uid?: string;
  email?: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
  projectId,
  defaultStatus = 'todo'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: defaultStatus,
    priority: 'medium',
    assigned_to: '',
    due_date: '',
    estimated_hours: 8,
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, status: defaultStatus }));
      loadUsers();
    }
  }, [isOpen, projectId, defaultStatus]);

  const loadUsers = async () => {
    try {
      logger.logInfo('CreateTaskModal: Loading users for assignment');
      const response = await apiService.getUsers({ department_id: 10 });
      console.log("response response", response)
      if (response.success && Array.isArray(response.packet)) {
        setUsers(response.packet);
        logger.logInfo('CreateTaskModal: Users loaded successfully', { count: response.packet.length });
      } else {
        setUsers([]);
      }
    } catch (error: any) {
      logger.logError('CreateTaskModal: Failed to load users', error);
      setUsers([]);
    }
  };
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    logger.logDebug('CreateTaskModal: Form field updated', { field, value });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      logger.logDebug('CreateTaskModal: Tag added', { tag: newTag.trim() });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    logger.logDebug('CreateTaskModal: Tag removed', { tag: tagToRemove });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Task name is required');
      return;
    }

    setIsLoading(true);
    logger.logInfo('CreateTaskModal: Creating new task', {
      projectId,
      taskName: formData.name,
      status: formData.status
    });

    try {
      const taskData = {
        ...formData,
        project_id: projectId,
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
        estimated_hours: parseInt(formData.estimated_hours.toString())
      };

      const result = await apiService.createTask(taskData);
      logger.logInfo('CreateTaskModal: Task created successfully', { taskId: result.task_id });
      toast.success('Task created successfully');

      onTaskCreated(result);
      onClose();

      // Reset form
      setFormData({
        name: '',
        description: '',
        status: defaultStatus,
        priority: 'medium',
        assigned_to: '',
        due_date: '',
        estimated_hours: 8,
        tags: []
      });
    } catch (error: any) {
      logger.logError('CreateTaskModal: Task creation failed', error);
      toast.error(error.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' },
    { value: 'done', label: 'Done' },
    { value: 'blocked', label: 'Blocked' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Task Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter task name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assigned_to">Assigned To</Label>
              {users && users.length > 0 ? (
                <Select
                  value={formData.assigned_to}
                  onValueChange={(value) => handleInputChange('assigned_to', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {users
                      .filter((user) => user.user_id) // skip users without valid ID
                      .map((user,index) => (
                        <SelectItem key={index} value={index}>
                          test
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground mt-2">
                  No users available for assignment.
                </div>
              )}

            </div>

            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="estimated_hours">Estimated Hours</Label>
              <Input
                id="estimated_hours"
                type="number"
                min="1"
                value={formData.estimated_hours}
                onChange={(e) => handleInputChange('estimated_hours', parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="col-span-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
