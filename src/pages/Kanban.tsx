
import React from 'react';
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import KanbanBoard from '@/components/kanban/KanbanBoard';

const Kanban = () => {
  return (
    <AppLayoutNew>
      <div className="space-y-6">
        <KanbanBoard />
      </div>
    </AppLayoutNew>
  );
};

export default Kanban;
