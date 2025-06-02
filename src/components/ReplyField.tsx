import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { sendMessage } from '../lib/chat';

interface ReplyFieldProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export function ReplyField({ onSend, placeholder = 'Type your reply...' }: ReplyFieldProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      setSuggestions([]);
    }
  };

  const getAISuggestions = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await sendMessage(`Generate 3 professional and helpful reply suggestions for this message: "${message}"`);
      // Split the response into individual suggestions
      const suggestionList = response.message
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.'))
        .map(line => line.replace(/^[-123.]\s*/, '').trim())
        .filter(Boolean);
      
      setSuggestions(suggestionList);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px] pr-24"
        />
        <Button
          onClick={getAISuggestions}
          disabled={isLoading || !message.trim()}
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <Card className="p-4 space-y-2">
          <h4 className="text-sm font-medium">AI Suggestions</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => useSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSend} disabled={!message.trim()}>
          Send Reply
        </Button>
      </div>
    </div>
  );
} 