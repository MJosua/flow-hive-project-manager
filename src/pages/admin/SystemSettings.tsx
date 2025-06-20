import React from 'react';
import AppLayoutNew from "@/components/layout/AppLayoutNew";

const SystemSettings = () => {
  return (
    <AppLayoutNew>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">General Settings</h2>
          <p className="text-muted-foreground">Manage general system configurations</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Security Settings</h2>
          <p className="text-muted-foreground">Configure security settings and access controls</p>
        </div>
        {/* Add more settings sections as needed */}
      </div>
    </AppLayoutNew>
  );
};

export default SystemSettings;
