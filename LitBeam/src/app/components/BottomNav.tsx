import { Home, PlusCircle, User, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/home/create', icon: PlusCircle, label: 'Create' },
    { path: '/home/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/home/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-6 py-4 shadow-lg z-50 safe-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} className="relative flex flex-col items-center gap-1.5">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-xl transition-colors ${
                  isActive ? 'bg-[#9FE870]' : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`w-7 h-7 ${isActive ? 'text-black' : 'text-white'}`}
                  strokeWidth={2.5}
                />
              </motion.div>
              <span className={`text-xs font-medium ${isActive ? 'text-[#9FE870]' : 'text-gray-400'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}