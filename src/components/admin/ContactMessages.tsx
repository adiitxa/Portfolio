import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MailOpen, Trash2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('contact_messages_realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contact_messages' }, 
        (payload) => {
          console.log('Contact message change detected:', payload);
          fetchMessages(); // Refetch when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Fetching contact messages with updated RLS policies...');
      
      // Fetch all contact messages
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setError(`Database error: ${error.message}`);
        return;
      }
      
      console.log('Contact messages fetched successfully:', data);
      console.log('Number of messages:', data?.length || 0);
      
      setMessages(data || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      setError(`Fetch error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      console.log('Marking message as read:', id);
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking message as read:', error);
        alert(`Error marking message as read: ${error.message}`);
        return;
      }
      
      console.log('Message marked as read successfully');
      fetchMessages(); // Refresh the list
    } catch (error: any) {
      console.error('Error marking message as read:', error);
      alert('Error marking message as read. Please try again.');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      console.log('Deleting message:', id);
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting message:', error);
        alert(`Error deleting message: ${error.message}`);
        return;
      }
      
      console.log('Message deleted successfully');
      fetchMessages(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting message:', error);
      alert('Error deleting message. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  console.log('Component render - Loading:', loading, 'Error:', error, 'Messages count:', messages.length);

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Contact Messages</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Contact Messages</h3>
          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="text-center py-12 text-red-400">
          <Mail size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold mb-2">Error loading messages</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Contact Messages</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            Total: {messages.length} messages ({messages.filter(msg => !msg.is_read).length} unread)
          </div>
          <button
            onClick={fetchMessages}
            className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Mail size={48} className="mx-auto mb-4 opacity-50" />
          <p>No messages found</p>
          <p className="text-xs mt-2">Messages sent through the contact form will appear here</p>
          <button
            onClick={fetchMessages}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Check Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-slate-700 rounded-lg p-6 ${
                !message.is_read ? 'border-l-4 border-blue-400' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.is_read ? 'bg-slate-600' : 'bg-blue-500/20'
                  }`}>
                    {message.is_read ? (
                      <MailOpen size={20} className="text-slate-400" />
                    ) : (
                      <Mail size={20} className="text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{message.name}</h4>
                    <p className="text-sm text-slate-400">{message.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={14} />
                  {formatDate(message.created_at)}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-slate-300 leading-relaxed">{message.message}</p>
              </div>

              <div className="flex gap-2">
                {!message.is_read && (
                  <button
                    onClick={() => markAsRead(message.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(message.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
