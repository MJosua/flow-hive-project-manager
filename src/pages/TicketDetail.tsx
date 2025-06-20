import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, FileText, MessageSquare } from 'lucide-react';
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchTicketById, selectTicketById, selectTicketsLoading } from '@/store/slices/ticketsSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface TicketComment {
  id: number;
  user: string;
  date: string;
  comment: string;
}

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const ticket = useAppSelector(selectTicketById(Number(id)));
  const isLoading = useAppSelector(selectTicketsLoading);
  const [comments, setComments] = useState<TicketComment[]>([
    {
      id: 1,
      user: 'John Doe',
      date: '2024-02-01T12:00:00.000Z',
      comment: 'Initial ticket creation and problem description.'
    },
    {
      id: 2,
      user: 'Jane Smith',
      date: '2024-02-02T09:30:00.000Z',
      comment: 'Providing additional information and steps taken.'
    }
  ]);

  useEffect(() => {
    if (id) {
      dispatch(fetchTicketById(Number(id)));
    }
  }, [dispatch, id]);

  const handleGoBack = () => {
    navigate('/my-tickets');
  };

  if (isLoading) {
    return (
      <AppLayoutNew>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </AppLayoutNew>
    );
  }

  if (!ticket) {
    return (
      <AppLayoutNew>
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Ticket Not Found</h2>
          <p className="text-gray-500">The requested ticket could not be found.</p>
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Tickets
          </Button>
        </div>
      </AppLayoutNew>
    );
  }

  return (
    <AppLayoutNew>
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleGoBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Tickets
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-semibold">{ticket.title}</CardTitle>
              <Badge variant="secondary">{ticket.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <User className="w-4 h-4" />
                <span>{ticket.reporter_name}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-md font-semibold">Description</h3>
              <p className="text-gray-700">{ticket.description}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-md font-semibold">Comments</h3>
              {comments.map(comment => (
                <div key={comment.id} className="border rounded-md p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold">{comment.user}</span>
                    <span className="text-gray-500 text-sm">
                      {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayoutNew>
  );
};

export default TicketDetail;
