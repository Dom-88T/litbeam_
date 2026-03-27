import { createBrowserRouter } from 'react-router';
import Root from './components/Root';
import Splash from './components/pages/Splash';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Home from './components/pages/Home';
import CreateEvent from './components/pages/CreateEvent';
import EventDetails from './components/pages/EventDetails';
import Profile from './components/pages/Profile';
import Chat from './components/pages/Chat';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Splash />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/home',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'create', element: <CreateEvent /> },
      { path: 'event/:id', element: <EventDetails /> },
      { path: 'chat', element: <Chat /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
]);