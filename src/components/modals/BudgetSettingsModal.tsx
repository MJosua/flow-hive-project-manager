
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';

interface BudgetSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const BudgetSettingsModal = ({ open, onOpenChange, projectId }: BudgetSettingsModalProps) => {
  const { projects } = useApp();
  const project = projects.find(p => p.id === projectId);
  
  const [budgetData, setBudgetData] = useState({
    totalBudget: '',
    spentAmount: '',
    categories: [
      { name: 'Development', allocated: '', spent: '' },
      { name: 'Design', allocated: '', spent: '' },
      { name: 'Testing', allocated: '', spent: '' },
      { name: 'Infrastructure', allocated: '', spent: '' }
    ],
    notes: ''
  });

  useEffect(() => {
    if (project) {
      setBudgetData(prev => ({
        ...prev,
        totalBudget: project.budget.toString(),
        spentAmount: (project.budget * 0.3).toString() // Mock spent amount
      }));
    }
  }, [project]);

  const handleCategoryChange = (index: number, field: string, value: string) => {
    const updatedCategories = [...budgetData.categories];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    setBudgetData({ ...budgetData, categories: updatedCategories });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Budget Settings Data:', {
      projectId,
      ...budgetData
    });
    // Here you'll connect to backend
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Budget Settings</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalBudget">Total Budget ($)</Label>
              <Input
                id="totalBudget"
                type="number"
                value={budgetData.totalBudget}
                onChange={(e) => setBudgetData({ ...budgetData, totalBudget: e.target.value })}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="spentAmount">Spent Amount ($)</Label>
              <Input
                id="spentAmount"
                type="number"
                value={budgetData.spentAmount}
                onChange={(e) => setBudgetData({ ...budgetData, spentAmount: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Budget Categories</Label>
            {budgetData.categories.map((category, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Category Name</Label>
                  <Input
                    value={category.name}
                    onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                    placeholder="Category name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Allocated ($)</Label>
                  <Input
                    type="number"
                    value={category.allocated}
                    onChange={(e) => handleCategoryChange(index, 'allocated', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Spent ($)</Label>
                  <Input
                    type="number"
                    value={category.spent}
                    onChange={(e) => handleCategoryChange(index, 'spent', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setBudgetData({
                ...budgetData,
                categories: [...budgetData.categories, { name: '', allocated: '', spent: '' }]
              })}
            >
              Add Category
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Budget Notes</Label>
            <Textarea
              id="notes"
              value={budgetData.notes}
              onChange={(e) => setBudgetData({ ...budgetData, notes: e.target.value })}
              placeholder="Additional budget notes and considerations"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
              Save Budget Settings
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetSettingsModal;
