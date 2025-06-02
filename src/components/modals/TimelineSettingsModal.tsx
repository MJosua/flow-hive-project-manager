
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '@/contexts/AppContext';

interface TimelineSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const TimelineSettingsModal = ({ open, onOpenChange, projectId }: TimelineSettingsModalProps) => {
  const { projects } = useApp();
  const project = projects.find(p => p.id === projectId);
  
  const [timelineData, setTimelineData] = useState({
    milestones: [
      { name: 'Project Kickoff', date: null as Date | null, completed: false },
      { name: 'Design Phase Complete', date: null as Date | null, completed: false },
      { name: 'Development Phase Complete', date: null as Date | null, completed: false },
      { name: 'Testing Phase Complete', date: null as Date | null, completed: false },
      { name: 'Project Delivery', date: null as Date | null, completed: false }
    ],
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    hoursPerDay: '8',
    bufferDays: '5'
  });
  
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    if (project) {
      setStartDate(project.startDate);
      setEndDate(project.endDate);
    }
  }, [project]);

  const handleMilestoneChange = (index: number, field: string, value: any) => {
    const updatedMilestones = [...timelineData.milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setTimelineData({ ...timelineData, milestones: updatedMilestones });
  };

  const addMilestone = () => {
    setTimelineData({
      ...timelineData,
      milestones: [...timelineData.milestones, { name: '', date: null, completed: false }]
    });
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = timelineData.milestones.filter((_, i) => i !== index);
    setTimelineData({ ...timelineData, milestones: updatedMilestones });
  };

  const handleWorkingDayToggle = (day: string) => {
    const updatedDays = timelineData.workingDays.includes(day)
      ? timelineData.workingDays.filter(d => d !== day)
      : [...timelineData.workingDays, day];
    setTimelineData({ ...timelineData, workingDays: updatedDays });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Timeline Settings Data:', {
      projectId,
      startDate,
      endDate,
      ...timelineData
    });
    // Here you'll connect to backend
    onOpenChange(false);
  };

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Timeline Settings</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Project End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Working Schedule */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Working Schedule</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hours per Day</Label>
                <Input
                  type="number"
                  value={timelineData.hoursPerDay}
                  onChange={(e) => setTimelineData({ ...timelineData, hoursPerDay: e.target.value })}
                  min="1"
                  max="24"
                />
              </div>
              <div className="space-y-2">
                <Label>Buffer Days</Label>
                <Input
                  type="number"
                  value={timelineData.bufferDays}
                  onChange={(e) => setTimelineData({ ...timelineData, bufferDays: e.target.value })}
                  min="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Working Days</Label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <Button
                    key={day}
                    type="button"
                    variant={timelineData.workingDays.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleWorkingDayToggle(day)}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Project Milestones</Label>
            {timelineData.milestones.map((milestone, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg items-end">
                <div className="space-y-2">
                  <Label>Milestone Name</Label>
                  <Input
                    value={milestone.name}
                    onChange={(e) => handleMilestoneChange(index, 'name', e.target.value)}
                    placeholder="Milestone name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {milestone.date ? format(milestone.date, "MMM dd") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar 
                        mode="single" 
                        selected={milestone.date || undefined} 
                        onSelect={(date) => handleMilestoneChange(index, 'date', date)} 
                        initialFocus 
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={(e) => handleMilestoneChange(index, 'completed', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label>Completed</Label>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={addMilestone}>
              Add Milestone
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
              Save Timeline Settings
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimelineSettingsModal;
