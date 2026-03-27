import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { store } from './store/store';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </Provider>
  );
}