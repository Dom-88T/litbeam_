import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: string;
}

export interface ChatRequest {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

interface ChatState {
  messages: { [eventId: string]: Message[] };
  chatRequests: { [eventId: string]: ChatRequest[] };
  approvedUsers: { [eventId: string]: string[] }; // eventId -> userId[]
}

const initialState: ChatState = {
  messages: {
    '1': [
      {
        id: 'm1',
        eventId: '1',
        userId: 'user1',
        userName: 'Biodun',
        userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80',
        message: 'This looks lit! What\'s the drink situation?',
        timestamp: '2026-03-25T11:30:00Z',
      },
      {
        id: 'm2',
        eventId: '1',
        userId: 'host1',
        userName: 'Tunde',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
        message: 'BYOB but we got mixers and ice covered!',
        timestamp: '2026-03-25T11:35:00Z',
      },
      {
        id: 'm3',
        eventId: '1',
        userId: 'user2',
        userName: 'Chioma',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
        message: 'Can I bring a plus one?',
        timestamp: '2026-03-25T12:00:00Z',
      },
      {
        id: 'm4',
        eventId: '1',
        userId: 'host1',
        userName: 'Tunde',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
        message: 'Yeah sure! Just RSVP so we can keep count',
        timestamp: '2026-03-25T12:05:00Z',
      },
    ],
    '2': [
      {
        id: 'm5',
        eventId: '2',
        userId: 'user3',
        userName: 'Emeka',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
        message: 'What time should we pull up?',
        timestamp: '2026-03-24T16:00:00Z',
      },
      {
        id: 'm6',
        eventId: '2',
        userId: 'host2',
        userName: 'Amaka',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
        message: 'Anytime after 9pm! Party goes till late',
        timestamp: '2026-03-24T16:10:00Z',
      },
    ],
  },
  chatRequests: {
    '1': [],
    '2': [],
  },
  approvedUsers: {
    '1': ['user1', 'user2', 'host1'],
    '2': ['user3', 'host2'],
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const { eventId } = action.payload;
      if (!state.messages[eventId]) {
        state.messages[eventId] = [];
      }
      state.messages[eventId].push(action.payload);
    },
    requestChatAccess: (state, action: PayloadAction<ChatRequest>) => {
      const { eventId } = action.payload;
      if (!state.chatRequests[eventId]) {
        state.chatRequests[eventId] = [];
      }
      state.chatRequests[eventId].push(action.payload);
    },
    approveChatRequest: (state, action: PayloadAction<{ eventId: string; requestId: string }>) => {
      const { eventId, requestId } = action.payload;
      const request = state.chatRequests[eventId]?.find(r => r.id === requestId);
      if (request) {
        request.status = 'approved';
        if (!state.approvedUsers[eventId]) {
          state.approvedUsers[eventId] = [];
        }
        state.approvedUsers[eventId].push(request.userId);
      }
    },
    rejectChatRequest: (state, action: PayloadAction<{ eventId: string; requestId: string }>) => {
      const { eventId, requestId } = action.payload;
      const request = state.chatRequests[eventId]?.find(r => r.id === requestId);
      if (request) {
        request.status = 'rejected';
      }
    },
  },
});

export const { addMessage, requestChatAccess, approveChatRequest, rejectChatRequest } = chatSlice.actions;
export default chatSlice.reducer;
