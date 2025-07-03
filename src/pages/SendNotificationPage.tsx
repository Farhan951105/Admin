import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Bell, Send } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const SendNotificationPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_BASE_URL}/api/admin/notifications`,
        {
          title,
          body,
          userId: userId ? Number(userId) : undefined,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      toast.success('Notification sent successfully!', {
        description: 'Your notification has been delivered to the recipients.',
      });
      setTitle('');
      setBody('');
      setUserId('');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send notification.';
      setError(errorMessage);
      toast.error('Failed to send notification', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-bold text-primary">Send Notification</h1>
        <p className="text-muted-foreground">Send notifications to all users or a specific user.</p>
      </div>

      <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            Compose Notification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter notification title"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Enter notification message"
                required
                rows={4}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userId">User ID (Optional)</Label>
              <Input
                id="userId"
                type="number"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="Leave blank to send to all users"
                min={1}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                If left blank, the notification will be sent to all users.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="transition-all duration-200 hover:scale-105"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
            
            {error && (
              <div className="text-destructive animate-fade-in-up">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendNotificationPage; 