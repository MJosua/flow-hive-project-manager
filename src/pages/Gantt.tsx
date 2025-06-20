
import React from 'react';
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import GanttChart from '@/components/gantt/GanttChart';

const Gantt = () => {
  return (
    <AppLayoutNew>
      <div className="space-y-6">
        <GanttChart />
      </div>
    </AppLayoutNew>
  );
};

export default Gantt;
