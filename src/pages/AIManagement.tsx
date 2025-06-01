
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle, TrendingUp, Settings, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AIManagement = () => {
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [retrainingData, setRetrainingData] = useState({
    ticketContent: '',
    correctDepartment: '',
    correctResponse: '',
    reasoning: ''
  });

  const aiStats = [
    { title: 'Routing Accuracy', value: '92%', change: '+3%', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Avg Response Quality', value: '4.2/5', change: '+0.3', icon: ThumbsUp, color: 'text-blue-600' },
    { title: 'Automated Replies', value: '156', change: '+12', icon: Brain, color: 'text-purple-600' },
    { title: 'Pattern Detections', value: '23', change: '+5', icon: AlertCircle, color: 'text-orange-600' },
  ];

  const recentFeedback = [
    {
      id: 1,
      ticketId: 'TK-001',
      aiSuggestion: 'Password reset instructions provided',
      feedback: 'positive',
      rating: 5,
      comment: 'Perfect response, saved me time',
      agent: 'John Smith',
      date: '2024-01-15'
    },
    {
      id: 2,
      ticketId: 'TK-005',
      aiSuggestion: 'Routed to HR department',
      feedback: 'negative',
      rating: 2,
      comment: 'Should have been routed to IT, not HR',
      agent: 'Sarah Johnson',
      date: '2024-01-15'
    },
    {
      id: 3,
      ticketId: 'TK-008',
      aiSuggestion: 'VPN setup instructions provided',
      feedback: 'positive',
      rating: 4,
      comment: 'Good response but could be more detailed',
      agent: 'Mike Davis',
      date: '2024-01-14'
    },
  ];

  const patternDetections = [
    {
      id: 1,
      pattern: 'Password Reset Requests',
      occurrences: 28,
      trend: 'increasing',
      suggestion: 'Create self-service password reset portal',
      priority: 'high',
      status: 'new'
    },
    {
      id: 2,
      pattern: 'VPN Connection Issues',
      occurrences: 15,
      trend: 'stable',
      suggestion: 'Update VPN setup documentation',
      priority: 'medium',
      status: 'in-review'
    },
    {
      id: 3,
      pattern: 'Software License Requests',
      occurrences: 12,
      trend: 'decreasing',
      suggestion: 'Implement automated license tracking',
      priority: 'low',
      status: 'implemented'
    },
  ];

  const handleRetrainingSubmit = () => {
    toast({
      title: "Training Data Submitted",
      description: "Your feedback has been added to the AI training queue.",
    });
    setRetrainingData({
      ticketContent: '',
      correctDepartment: '',
      correctResponse: '',
      reasoning: ''
    });
  };

  const getFeedbackBadge = (feedback: string) => {
    return feedback === 'positive' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getPatternBadge = (priority: string) => {
    const priorityConfig = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-gray-100 text-gray-800',
    };
    return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['medium'];
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'new': 'bg-blue-100 text-blue-800',
      'in-review': 'bg-yellow-100 text-yellow-800',
      'implemented': 'bg-green-100 text-green-800',
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig['new'];
  };

  return (
    <Layout userRole="superAdmin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor and improve AI system performance</p>
        </div>

        {/* AI Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {aiStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="feedback" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
            <TabsTrigger value="training">Retraining</TabsTrigger>
            <TabsTrigger value="settings">AI Settings</TabsTrigger>
          </TabsList>

          {/* AI Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>AI Response Feedback</CardTitle>
                    <CardDescription>Review feedback from agents on AI-generated responses</CardDescription>
                  </div>
                  <Select value={feedbackFilter} onValueChange={setFeedbackFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Feedback</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentFeedback
                    .filter(feedback => feedbackFilter === 'all' || feedback.feedback === feedbackFilter)
                    .map((feedback) => (
                    <div key={feedback.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{feedback.ticketId}</span>
                          <Badge className={getFeedbackBadge(feedback.feedback)}>
                            {feedback.feedback}
                          </Badge>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{feedback.date}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm"><strong>AI Suggestion:</strong> {feedback.aiSuggestion}</p>
                        <p className="text-sm"><strong>Agent Comment:</strong> {feedback.comment}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Agent:</strong> {feedback.agent}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Mark Helpful
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Add to Training
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pattern Detection Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detected Patterns</CardTitle>
                <CardDescription>Repetitive issues and automation opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patternDetections.map((pattern) => (
                    <div key={pattern.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{pattern.pattern}</h4>
                          <Badge className={getPatternBadge(pattern.priority)}>
                            {pattern.priority}
                          </Badge>
                          <Badge className={getStatusBadge(pattern.status)}>
                            {pattern.status}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{pattern.occurrences} occurrences</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <strong>Suggestion:</strong> {pattern.suggestion}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retraining Tab */}
          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit Training Data</CardTitle>
                <CardDescription>Provide examples to improve AI routing and responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ticketContent">Ticket Content</Label>
                    <Textarea
                      id="ticketContent"
                      placeholder="Paste the original ticket content here..."
                      value={retrainingData.ticketContent}
                      onChange={(e) => setRetrainingData({...retrainingData, ticketContent: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="correctDepartment">Correct Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT">IT Support</SelectItem>
                          <SelectItem value="HR">Human Resources</SelectItem>
                          <SelectItem value="Admin">Administration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="reasoning">Reasoning</Label>
                      <Input
                        id="reasoning"
                        placeholder="Why this department?"
                        value={retrainingData.reasoning}
                        onChange={(e) => setRetrainingData({...retrainingData, reasoning: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="correctResponse">Correct Response (Optional)</Label>
                    <Textarea
                      id="correctResponse"
                      placeholder="Provide the ideal response for this type of ticket..."
                      value={retrainingData.correctResponse}
                      onChange={(e) => setRetrainingData({...retrainingData, correctResponse: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <Button onClick={handleRetrainingSubmit} className="w-full">
                    <Brain className="h-4 w-4 mr-2" />
                    Submit Training Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Auto-Routing Settings</CardTitle>
                  <CardDescription>Configure AI ticket routing behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable Auto-Routing</Label>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Confidence Threshold</Label>
                    <Select defaultValue="0.8">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.6">60%</SelectItem>
                        <SelectItem value="0.7">70%</SelectItem>
                        <SelectItem value="0.8">80%</SelectItem>
                        <SelectItem value="0.9">90%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Manual Review Queue</Label>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Generation</CardTitle>
                  <CardDescription>Configure AI response settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Auto-Generate Replies</Label>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Response Style</Label>
                    <Select defaultValue="professional">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Include FAQ Links</Label>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AIManagement;
