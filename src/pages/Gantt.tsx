
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import GanttChart from '@/components/gantt/GanttChart';

const Gantt = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <GanttChart />
      </div>
    </AppLayout>
  );
};

export default Gantt;
