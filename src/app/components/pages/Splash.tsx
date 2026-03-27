import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      setTimeout(() => {
        if (session) {
          navigate('/home');
        } else {
          navigate('/login');
        }
      }, 2500);
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 200,
          damping: 20,
          duration: 1 
        }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut'
          }}
          className="mb-6 inline-block"
        >
          <Zap className="w-24 h-24 text-[#9FE870]" fill="#9FE870" strokeWidth={2} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-bold text-white mb-2"
        >
          LitBeam
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[#9FE870] text-lg font-medium"
        >
          Discover the vibe
        </motion.p>
      </motion.div>
    </div>
  );
}
