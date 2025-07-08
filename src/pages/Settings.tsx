
import React from 'react';
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <AppLayoutNew>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Settings configuration will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayoutNew>
  );
};

export default Settings;
