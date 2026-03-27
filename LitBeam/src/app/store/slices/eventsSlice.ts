import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EventReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'house-party' | 'club' | 'outdoor' | 'concert' | 'other';
  date: string;
  time: string;
  location: string;
  address: string;
  neighborhood: string;
  images: string[];
  hostId: string;
  hostName: string;
  hostAvatar: string;
  attendees: number;
  maxAttendees?: number;
  isVerified: boolean;
  createdAt: string;
  price?: number;
  isPaid: boolean;
  ageRestriction?: number;
  reviews: EventReview[];
  averageRating: number;
}

interface EventsState {
  events: Event[];
  selectedCategory: string;
  searchQuery: string;
}

const initialState: EventsState = {
  events: [
    {
      id: '1',
      title: 'Rooftop Vibes - Sunset Party',
      description: 'Come through for an amazing sunset party on the rooftop. Good music, good vibes, and dope people. BYOB 🍾',
      category: 'outdoor',
      date: '2026-03-28',
      time: '18:00',
      location: 'Lekki Phase 1',
      address: '15 Admiralty Way, Lekki Phase 1',
      neighborhood: 'Lekki',
      images: [
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80'
      ],
      hostId: 'host1',
      hostName: 'Tunde',
      hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      attendees: 23,
      maxAttendees: 50,
      isVerified: true,
      createdAt: '2026-03-25T10:00:00Z',
      isPaid: false,
      reviews: [
        {
          id: 'r1',
          userId: 'user5',
          userName: 'Kemi',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
          rating: 5,
          comment: 'Amazing vibes! Tunde always throws the best parties 🔥',
          timestamp: '2026-03-20T10:00:00Z',
        }
      ],
      averageRating: 5,
      ageRestriction: 18,
    },
    {
      id: '2',
      title: 'Afrobeats House Session',
      description: 'Small intimate gathering. Just vibes and Afrobeats all night. Limited space so RSVP early!',
      category: 'house-party',
      date: '2026-03-26',
      time: '21:00',
      location: 'Ikeja GRA',
      address: '23 Oduduwa Crescent, Ikeja GRA',
      neighborhood: 'Ikeja',
      images: [
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80'
      ],
      hostId: 'host2',
      hostName: 'Amaka',
      hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      attendees: 15,
      maxAttendees: 25,
      isVerified: true,
      createdAt: '2026-03-24T15:00:00Z',
      isPaid: false,
      reviews: [],
      averageRating: 0,
      ageRestriction: 21,
    },
    {
      id: '3',
      title: 'Friday Night Turn Up at Club Quilox',
      description: 'End the week right! Free entry before 11pm. Dress code: Sharp sharp 🔥',
      category: 'club',
      date: '2026-03-27',
      time: '22:00',
      location: 'Victoria Island',
      address: 'Ozumba Mbadiwe Avenue, VI',
      neighborhood: 'Victoria Island',
      images: [
        'https://images.unsplash.com/photo-1566417713940-fe7c737a9f5e?w=800&q=80',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'
      ],
      hostId: 'host3',
      hostName: 'Chidi',
      hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      attendees: 67,
      isVerified: true,
      createdAt: '2026-03-23T09:00:00Z',
      price: 5000,
      isPaid: true,
      reviews: [
        {
          id: 'r2',
          userId: 'user6',
          userName: 'Ayo',
          userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
          rating: 4,
          comment: 'Great club night! Music was on point',
          timestamp: '2026-03-22T10:00:00Z',
        },
        {
          id: 'r3',
          userId: 'user7',
          userName: 'Tola',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
          rating: 5,
          comment: 'Best Friday night ever!',
          timestamp: '2026-03-22T12:00:00Z',
        }
      ],
      averageRating: 4.5,
      ageRestriction: 21,
    },
    {
      id: '4',
      title: 'Beach Hangout & BBQ',
      description: 'Sunday funday at the beach! Bringing the grill, good music and positive energy. Pull up! 🏖️',
      category: 'outdoor',
      date: '2026-03-29',
      time: '14:00',
      location: 'Elegushi Beach',
      address: 'Elegushi Royal Beach, Lekki',
      neighborhood: 'Lekki',
      images: [
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80'
      ],
      hostId: 'host4',
      hostName: 'Funke',
      hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      attendees: 34,
      isVerified: false,
      createdAt: '2026-03-25T08:00:00Z',
      isPaid: false,
      reviews: [],
      averageRating: 0,
    },
  ],
  selectedCategory: 'all',
  searchQuery: '',
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.unshift(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    rsvpToEvent: (state, action: PayloadAction<string>) => {
      const event = state.events.find(e => e.id === action.payload);
      if (event) {
        event.attendees += 1;
      }
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addReview: (state, action: PayloadAction<{ eventId: string; review: EventReview }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.reviews.push(action.payload.review);
        const totalRating = event.reviews.reduce((sum, r) => sum + r.rating, 0);
        event.averageRating = totalRating / event.reviews.length;
      }
    },
  },
});

export const { addEvent, updateEvent, rsvpToEvent, setSelectedCategory, setSearchQuery, addReview } = eventsSlice.actions;
export default eventsSlice.reducer;
