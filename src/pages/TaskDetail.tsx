import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TaskDetail = () => {
  const { id } = useParams();

  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Task ID: {id}</p>
            <p>This page will show detailed task information, comments, time tracking, and task management tools.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TaskDetail;
