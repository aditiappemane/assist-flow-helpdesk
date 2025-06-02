import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { createTicket, TicketData } from '@/lib/tickets';
import Layout from '@/components/Layout';

const DEPARTMENTS = ['IT', 'HR', 'Admin'] as const;
const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

const SubmitTicket = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<typeof DEPARTMENTS[number]>('IT');
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!subject || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    if (subject.length < 5) {
      toast({
        title: "Error",
        description: "Subject must be at least 5 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (description.length < 20) {
      toast({
        title: "Error",
        description: "Description must be at least 20 characters long",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const ticketData: TicketData = {
        subject,
        description,
        department,
        priority,
      };

      await createTicket(ticketData);
      
      toast({
        title: "Success",
        description: "Ticket submitted successfully",
      });

      // Reset form
      setSubject('');
      setDescription('');
      setDepartment('IT');
      setPriority('medium');

      // Navigate to my tickets
      navigate('/my-tickets');
    } catch (error: any) {
      console.error('Error submitting ticket:', error);
      toast({
        title: "Error",
        description: error.error || "Failed to submit ticket",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout userRole="employee">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Submit New Ticket</CardTitle>
            <CardDescription>
              Fill out the form below to submit a new support ticket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide detailed information about your issue"
                  required
                  disabled={isLoading}
                  className="min-h-[150px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={department}
                    onValueChange={(value: typeof DEPARTMENTS[number]) => setDepartment(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={priority}
                    onValueChange={(value: typeof PRIORITIES[number]) => setPriority(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((pri) => (
                        <SelectItem key={pri} value={pri}>
                          {pri.charAt(0).toUpperCase() + pri.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Ticket'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SubmitTicket;
