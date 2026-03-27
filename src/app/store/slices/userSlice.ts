import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string;
  name: string;
  avatar: string;
  neighborhood: string;
  rsvpedEvents: string[];
  following: string[]; // User IDs
  followers: string[]; // User IDs
  age: number;
  isVerified: boolean;
}

const initialState: UserState = {
  id: 'currentUser',
  name: 'You',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
  neighborhood: 'Lekki',
  rsvpedEvents: [],
  following: ['host1', 'host2'],
  followers: [],
  age: 22,
  isVerified: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleRsvp: (state, action: PayloadAction<string>) => {
      const index = state.rsvpedEvents.indexOf(action.payload);
      if (index > -1) {
        state.rsvpedEvents.splice(index, 1);
      } else {
        state.rsvpedEvents.push(action.payload);
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    followUser: (state, action: PayloadAction<string>) => {
      if (!state.following.includes(action.payload)) {
        state.following.push(action.payload);
      }
    },
    unfollowUser: (state, action: PayloadAction<string>) => {
      state.following = state.following.filter(id => id !== action.payload);
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
  },
});

export const { toggleRsvp, updateUserProfile, followUser, unfollowUser, updateUserAvatar } = userSlice.actions;
export default userSlice.reducer;