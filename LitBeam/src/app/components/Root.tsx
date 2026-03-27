import { Outlet } from 'react-router';
import BottomNav from './BottomNav';

export default function Root() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <Outlet />
      <BottomNav />
    </div>
  );
}