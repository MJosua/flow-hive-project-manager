
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import KanbanBoard from '@/components/kanban/KanbanBoard';

const Kanban = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <KanbanBoard />
      </div>
    </AppLayout>
  );
};

export default Kanban;
