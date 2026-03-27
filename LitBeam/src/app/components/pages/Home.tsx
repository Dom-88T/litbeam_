import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setSelectedCategory, setSearchQuery } from '../../store/slices/eventsSlice';
import EventCard from '../EventCard';
import { Search, MapPin, Zap, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../ui/input';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const categories = [
  { id: 'all', label: 'All', emoji: '🎉' },
  { id: 'house-party', label: 'House Party', emoji: '🏠' },
  { id: 'club', label: 'Club', emoji: '🎵' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌅' },
  { id: 'concert', label: 'Concert', emoji: '🎤' },
  { id: 'other', label: 'Other', emoji: '✨' },
];

// Mock notifications
const mockNotifications = [
  { id: '1', title: '🎉 New Event Near You!', message: 'Rooftop Vibes in Lekki Phase 1', time: '2m ago', read: false },
  { id: '2', title: '💰 Special Offer', message: '20% off early bird tickets', time: '1h ago', read: false },
  { id: '3', title: '✅ Request Approved', message: 'You can now chat in "Beach Party"', time: '3h ago', read: true },
];

export default function Home() {
  const dispatch = useDispatch();
  const { events, selectedCategory, searchQuery } = useSelector((state: RootState) => state.events);
  const user = useSelector((state: RootState) => state.user);

  const [notifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Force re-render of avatar when it changes in Redux
  const [avatarKey, setAvatarKey] = useState(Date.now());

  useEffect(() => {
    setAvatarKey(Date.now()); // This helps refresh the image when avatar URL changes
  }, [user.avatar]);

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
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{user.neighborhood}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notification Icon */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                  <Bell className="w-5 h-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#9FE870] rounded-full flex items-center justify-center text-xs font-bold text-black">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 mr-4" align="end">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notif.read ? 'bg-[#9FE870]/5' : ''
                          }`}
                        >
                          <div className="flex gap-2">
                            {!notif.read && (
                              <div className="w-2 h-2 bg-[#9FE870] rounded-full mt-2 flex-shrink-0"></div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-900 mb-0.5">
                                {notif.title}
                              </p>
                              <p className="text-sm text-gray-600 mb-1">{notif.message}</p>
                              <p className="text-xs text-gray-400">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Profile Picture - Now properly reactive to Redux changes */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#9FE870]">
              <img
                key={avatarKey}                    // Forces image refresh when avatar changes
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  // Fallback in case image fails to load
                  e.currentTarget.src = 'https://via.placeholder.com/150?text=User';
                }}
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
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