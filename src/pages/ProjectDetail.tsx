import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectDetail = () => {
  const { id } = useParams();

  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Project ID: {id}</p>
            <p>This page will show detailed project information, tasks, team members, and project management tools.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
