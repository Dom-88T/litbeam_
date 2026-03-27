import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setSelectedCategory, setSearchQuery } from '../../store/slices/eventsSlice';
import EventCard from '../EventCard';
import { Search, MapPin, Zap, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '../ui/input';
import { useNavigate } from 'react-router';

const categories = [
  { id: 'all', label: 'All', emoji: '🎉' },
  { id: 'house-party', label: 'House Party', emoji: '🏠' },
  { id: 'club', label: 'Club', emoji: '🎵' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌅' },
  { id: 'concert', label: 'Concert', emoji: '🎤' },
  { id: 'other', label: 'Other', emoji: '✨' },
];

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { events, selectedCategory, searchQuery } = useSelector((state: RootState) => state.events);
  const user = useSelector((state: RootState) => state.user);
  const messages = useSelector((state: RootState) => state.chat.messages);
  
  // Count total unread messages from all events
  const totalMessages = Object.values(messages).reduce((sum, msgs) => sum + (Array.isArray(msgs) ? msgs.length : 0), 0);
  const hasUnreadMessages = totalMessages > 0;

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-6 bg-white">
      {/* Header */}
      <div className="bg-black px-6 pt-8 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-[#9FE870]" fill="#9FE870" />
              <h1 className="text-2xl font-bold text-white">LitBeam</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/chat')}
                className="relative p-2 hover:bg-gray-900 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6 text-[#9FE870]" />
                {hasUnreadMessages && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"
                    title={`${totalMessages} messages`}
                  />
                )}
              </motion.button>

              {/* Profile Avatar */}
              <div className="w-12 h-12 rounded-full bg-[#9FE870]/20 flex items-center justify-center">
                {user ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <Zap className="w-6 h-6 text-[#9FE870]" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search parties, neighborhoods..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-0 bg-gray-900 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#9FE870]"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(setSelectedCategory(category.id))}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-black text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>{category.emoji}</span>
              <span className="text-sm font-semibold">{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="px-6 space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
