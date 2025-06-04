import { useParams } from 'react-router-dom';
import { ChatBot } from '@/components/ChatBot';

export default function AskBot() {
  const { ticketId } = useParams();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">IT Support Assistant</h1>
      <ChatBot ticketId={ticketId} />
    </div>
  );
}
