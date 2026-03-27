import { Link } from 'react-router';
import { Calendar, Clock, MapPin, Users, ShieldCheck, Star, Banknote } from 'lucide-react';
import { Event } from '../store/slices/eventsSlice';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'EEE, MMM d');

  return (
    <Link to={`/home/event/${event.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-200"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {event.isVerified && (
              <div className="bg-[#9FE870] text-black px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </div>
            )}
            {event.isPaid && (
              <div className="bg-black text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                <Banknote className="w-3 h-3" />
                ₦{event.price?.toLocaleString()}
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-bold text-lg">{event.title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Calendar className="w-4 h-4 text-black" />
              <span>{formattedDate}</span>
              <Clock className="w-4 h-4 text-black ml-2" />
              <span>{event.time}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4 text-[#9FE870]" />
              <span className="truncate">{event.location}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <img
                  src={event.hostAvatar}
                  alt={event.hostName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#9FE870]"
                />
                <span className="text-sm text-gray-900 font-semibold">{event.hostName}</span>
              </div>

              <div className="flex items-center gap-3">
                {event.averageRating > 0 && (
                  <div className="flex items-center gap-1 text-black">
                    <Star className="w-4 h-4 fill-[#9FE870] text-[#9FE870]" />
                    <span className="text-sm font-semibold">{event.averageRating.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-semibold">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees}</span>
                  {event.maxAttendees && <span className="text-gray-500">/ {event.maxAttendees}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}