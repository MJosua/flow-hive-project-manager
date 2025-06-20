
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectCreate = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will contain a form to create new projects with approval workflow.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProjectCreate;
