import Layout from '@/components/Layout';
import ChatBot from '@/components/ChatBot';

export default function AskBot() {
  return (
    <Layout userRole="employee">
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Help Desk Assistant</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Ask me anything about IT support, software, hardware, or general help desk queries.
            I'll do my best to assist you or guide you to the right resources.
          </p>
          <ChatBot />
        </div>
      </div>
    </Layout>
  );
}
