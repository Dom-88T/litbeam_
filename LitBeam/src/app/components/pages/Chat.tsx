import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate, useParams } from 'react-router';
import { MessageCircle, Users, Calendar, Send, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { addMessage } from '../../store/slices/chatSlice';
import { toast } from 'sonner';

export default function Chat() {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId?: string }>(); // For individual chat view
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const events = useSelector((state: RootState) => state.events.events);
  const approvedChats = useSelector((state: RootState) => state.chat.approvedUsers);
  const messages = useSelector((state: RootState) => state.chat.messages);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get all accessible chats (hosting or approved)
  const accessibleChats = events.filter(event => {
    const isHost = event.hostId === user.id;
    const isApproved = approvedChats[event.id]?.includes(user.id) || false;
    return isHost || isApproved;
  });

  // If we're in a specific chat (e.g. /chat/:eventId)
  const currentEvent = eventId ? events.find(e => e.id === eventId) : null;
  const currentMessages = eventId ? (messages[eventId] || []) : [];

  const isHostOfCurrent = currentEvent ? currentEvent.hostId === user.id : false;

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !eventId || !currentEvent) return;

    const messageData = {
      id: `msg_${Date.now()}`,
      eventId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(messageData));
    setNewMessage('');
    toast.success('Message sent');
  };

  // Main Chat List View
  if (!eventId) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-black px-6 py-6 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 text-sm mt-1">
            {accessibleChats.length} active {accessibleChats.length === 1 ? 'chat' : 'chats'}
          </p>
        </div>

        {/* Chat List */}
        <div className="px-4 py-4">
          {accessibleChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Chats Yet</h3>
              <p className="text-sm text-gray-500 text-center max-w-xs">
                Join an event and get approved by the host to start chatting
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {accessibleChats.map((event) => {
                const eventMessages = messages[event.id] || [];
                const lastMessage = eventMessages[eventMessages.length - 1];
                const isHost = event.hostId === user.id;

                return (
                  <motion.button
                    key={event.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/chat/${event.id}`)}
                    className="w-full bg-white border border-gray-200 rounded-3xl p-4 hover:border-gray-300 transition-all text-left flex gap-4"
                  >
                    <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={event.images[0]}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate pr-2">
                          {event.title}
                        </h3>
                        {isHost && (
                          <span className="text-xs bg-[#9FE870] text-black px-2.5 py-0.5 rounded-full font-medium">
                            HOST
                          </span>
                        )}
                      </div>

                      {lastMessage ? (
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage.userName}: {lastMessage.message}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">No messages yet • Tap to start chatting</p>
                      )}

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{event.attendees}</span>
                        </div>
                        <div>{new Date(event.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Individual Chat View (when eventId exists)
  if (!currentEvent) {
    return <div className="p-6 text-center">Chat not found</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Chat Header */}
      <div className="bg-black px-4 py-4 sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => navigate('/chat')} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden">
            <img src={currentEvent.images[0]} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h2 className="text-white font-semibold truncate">{currentEvent.title}</h2>
            <p className="text-gray-400 text-sm">
              {isHostOfCurrent ? 'You are the host' : `${currentEvent.attendees} members`}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ paddingBottom: '80px' }}>
        {currentMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">No messages yet.<br />Be the first to say something!</p>
          </div>
        ) : (
          currentMessages.map((msg) => {
            const isMyMessage = msg.userId === user.id;
            return (
              <div key={msg.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-3xl px-4 py-3 ${
                  isMyMessage 
                    ? 'bg-black text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }`}>
                  {!isMyMessage && (
                    <p className="text-xs text-gray-500 mb-1">{msg.userName}</p>
                  )}
                  <p className="text-[15px] leading-relaxed">{msg.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-base focus:outline-none focus:ring-1 focus:ring-[#9FE870]"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}