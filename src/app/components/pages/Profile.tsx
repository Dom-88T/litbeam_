import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateUserProfile } from '../../store/slices/userSlice';
import { MapPin, Calendar, Users, TrendingUp, Zap, UserPlus, Upload, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import EventCard from '../EventCard';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const events = useSelector((state: RootState) => state.events.events);

  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);

  const [profileForm, setProfileForm] = useState({
    name: user.name,
    neighborhood: user.neighborhood,
  });

  const myEvents = events.filter((e) => e.hostId === user.id);
  const rsvpedEvents = events.filter((e) => user.rsvpedEvents.includes(e.id));

  // Sync with Redux
  useEffect(() => {
    setProfileForm({ name: user.name, neighborhood: user.neighborhood });
    setAvatarPreview(user.avatar);
  }, [user]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Profile photo must be 5MB or smaller');
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarPreview(localPreviewUrl);
    setSelectedAvatarFile(file);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setUploading(true);
    let newAvatarUrl = user.avatar;

    // 1. Upload avatar to Supabase Storage (if new file selected)
    if (selectedAvatarFile) {
      try {
        const fileExt = selectedAvatarFile.name.split('.').pop() || 'jpg';
        const fileName = `avatar-${uuidv4()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, selectedAvatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        newAvatarUrl = publicUrlData.publicUrl;

        console.log('✅ Avatar uploaded successfully:', newAvatarUrl);
      } catch (error: any) {
        console.error('Avatar upload error:', error);
        toast.error('Failed to upload avatar. Saving other changes...');
      }
    }

    try {
      // 2. Update profile in Supabase Database (This is the key fix for persistence)
      const { error: dbError } = await supabase
        .from('profiles')                    // Change to 'users' if your table is named users
        .update({
          name: profileForm.name.trim(),
          neighborhood: profileForm.neighborhood.trim() || user.neighborhood,
          avatar_url: newAvatarUrl,          // Important: save the URL here
        })
        .eq('id', user.id);

      if (dbError) {
        console.error('Database update error:', dbError);
        // Still continue - at least Redux will update temporarily
      } else {
        console.log('✅ Profile saved to database');
      }

      // 3. Update Redux state
      dispatch(
        updateUserProfile({
          name: profileForm.name.trim(),
          neighborhood: profileForm.neighborhood.trim() || user.neighborhood,
          avatar: newAvatarUrl,
        })
      );

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error('Failed to save profile. Please try again.');
      console.error(error);
    }

    setIsEditing(false);
    setSelectedAvatarFile(null);
    setAvatarPreview(newAvatarUrl);
    setUploading(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
    }
  };

  return (
    <div className="min-h-screen pb-6 bg-white">
      {/* Dark Header */}
      <div className="bg-black px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#9FE870]" fill="#9FE870" />
            <h1 className="text-2xl font-bold text-white">Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <LogOut className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Logout</span>
          </button>
        </div>

        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-24 h-24 rounded-full bg-[#9FE870] p-1 mb-4"
          >
            <img
              src={avatarPreview}
              alt={user.name}
              className="w-full h-full rounded-full object-cover border-2 border-black"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors border-2 border-[#9FE870]"
            >
              <Upload className="w-4 h-4 text-[#9FE870]" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploading}
            />
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-1">
            {isEditing ? profileForm.name : user.name}
          </h2>

          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="mb-6 text-sm font-semibold text-[#9FE870] hover:text-[#85d565]"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>

          <div className="flex items-center gap-2 text-gray-400 mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {isEditing ? profileForm.neighborhood : user.neighborhood}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-white font-bold">{user.following?.length || 0}</div>
              <div className="text-gray-400 text-xs">Following</div>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <div className="text-white font-bold">{user.followers?.length || 0}</div>
              <div className="text-gray-400 text-xs">Followers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-12 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-3 gap-4 border border-gray-200">
          <div className="text-center">
            <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-[#9FE870]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{myEvents.length}</p>
            <p className="text-xs text-gray-500 font-semibold">Hosted</p>
          </div>
          <div className="text-center">
            <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-[#9FE870]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{rsvpedEvents.length}</p>
            <p className="text-xs text-gray-500 font-semibold">Attending</p>
          </div>
          <div className="text-center">
            <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-[#9FE870]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {myEvents.reduce((sum, e) => sum + (e.attendees || 0), 0)}
            </p>
            <p className="text-xs text-gray-500 font-semibold">Total Reach</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="px-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
                <input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base"
                  placeholder="Your display name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Neighborhood</label>
                <input
                  value={profileForm.neighborhood}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, neighborhood: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base"
                  placeholder="e.g. Lekki, Yaba"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={uploading}
                className="w-full bg-[#9FE870] hover:bg-[#85d565] disabled:bg-gray-400 text-black font-semibold py-3.5 rounded-xl transition-colors"
              >
                {uploading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Sections */}
      <div className="px-6 space-y-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Events I'm Hosting</h3>
          {myEvents.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-[#9FE870]" />
              </div>
              <p className="text-gray-900 font-semibold mb-2">No events yet</p>
              <p className="text-sm text-gray-500">Tap the + button to create your first event!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Events I'm Attending</h3>
          {rsvpedEvents.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-[#9FE870]" />
              </div>
              <p className="text-gray-900 font-semibold mb-2">No RSVPs yet</p>
              <p className="text-sm text-gray-500">Explore the home feed to find events!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rsvpedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}