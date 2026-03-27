import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent } from '../../store/slices/eventsSlice';
import { RootState } from '../../store/store';
import { ArrowLeft, Upload, X, Zap, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const categories = [
  { id: 'house-party', label: 'House Party', emoji: '🏠' },
  { id: 'club', label: 'Club', emoji: '🎵' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌅' },
  { id: 'concert', label: 'Concert', emoji: '🎤' },
  { id: 'other', label: 'Other', emoji: '✨' },
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'house-party' as const,
    date: '',
    time: '',
    location: '',
    address: '',
    neighborhood: user.neighborhood,
    maxAttendees: '',
    isPaid: false,
    price: '',
    ageRestriction: '',
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (imageFiles.length + files.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    setImageFiles([...imageFiles, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    if (formData.isPaid && !formData.price) {
      toast.error('Please set a price for paid events');
      return;
    }

    setUploading(true);

    try {
      // Upload images to Supabase Storage
      const imageUrls: string[] = [];
      
      for (const [index, file] of imageFiles.entries()) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`Image ${file.name} is larger than 10MB and will be skipped.`);
          continue;
        }

        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${uuidv4()}.${fileExt}`;

        try {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('event-images')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: publicUrlData, error: publicUrlError } = supabase.storage
            .from('event-images')
            .getPublicUrl(fileName);

          if (publicUrlError) throw publicUrlError;
          if (!publicUrlData?.publicUrl) throw new Error('Missing image URL from storage');

          imageUrls.push(publicUrlData.publicUrl);
        } catch (err: any) {
          const fallback = imagePreviews[index] || '';
          if (fallback) {
            imageUrls.push(fallback);
            toast.error(`Failed uploading ${file.name}. Using local preview image.`);
          } else {
            throw err;
          }
        }
      }

      const newEvent = {
        id: `event-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        address: formData.address,
        neighborhood: formData.neighborhood,
        images: imageUrls,
        hostId: user.id,
        hostName: user.name,
        hostAvatar: user.avatar,
        attendees: 0,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        isVerified: user.isVerified,
        createdAt: new Date().toISOString(),
        isPaid: formData.isPaid,
        price: formData.isPaid ? parseFloat(formData.price) : undefined,
        ageRestriction: formData.ageRestriction ? parseInt(formData.ageRestriction) : undefined,
        reviews: [],
        averageRating: 0,
      };

      dispatch(addEvent(newEvent));
      toast.success('Event created successfully! 🎉');
      navigate('/home');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-black px-6 py-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="bg-white/10 backdrop-blur-sm p-2 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#9FE870]" fill="#9FE870" />
            <h1 className="text-2xl font-bold text-white">Create Event</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            type="text"
            placeholder="e.g., Rooftop Vibes - Sunset Party"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="text-base border-gray-300"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Tell people what to expect..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="text-base resize-none border-gray-300"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category *</Label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setFormData({ ...formData, category: category.id as any })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.category === category.id
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-2xl mb-1">{category.emoji}</div>
                <div className="text-xs font-semibold">{category.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="text-base border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="text-base border-gray-300"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location/Neighborhood *</Label>
          <Input
            id="location"
            type="text"
            placeholder="e.g., Lekki Phase 1"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="text-base border-gray-300"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Full Address *</Label>
          <Input
            id="address"
            type="text"
            placeholder="e.g., 15 Admiralty Way, Lekki Phase 1"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="text-base border-gray-300"
          />
        </div>

        {/* Max Attendees & Age Restriction */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxAttendees">Max Attendees</Label>
            <Input
              id="maxAttendees"
              type="number"
              placeholder="Optional"
              value={formData.maxAttendees}
              onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
              className="text-base border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ageRestriction">Age Restriction</Label>
            <Input
              id="ageRestriction"
              type="number"
              placeholder="e.g., 18"
              value={formData.ageRestriction}
              onChange={(e) => setFormData({ ...formData, ageRestriction: e.target.value })}
              className="text-base border-gray-300"
            />
          </div>
        </div>

        {/* Paid Event Toggle */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Label htmlFor="isPaid">Paid Event</Label>
              <p className="text-xs text-gray-500 mt-1">Charge attendees for tickets</p>
            </div>
            <Switch
              id="isPaid"
              checked={formData.isPaid}
              onCheckedChange={(checked) => setFormData({ ...formData, isPaid: checked })}
            />
          </div>
          {formData.isPaid && (
            <div className="space-y-2">
              <Label htmlFor="price">Ticket Price (₦) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 5000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="text-base border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Images */}
        <div className="space-y-2">
          <Label>Event Images * (Max 4)</Label>
          
          {imagePreviews.length < 4 && (
            <label
              htmlFor="images"
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors bg-gray-50"
            >
              <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm font-semibold text-gray-700">Upload from Gallery</p>
              <p className="text-xs text-gray-500 mt-1">{4 - imagePreviews.length} more allowed</p>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {imagePreviews.map((url, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={uploading}
            className="w-full py-6 text-lg font-bold bg-black text-white hover:bg-gray-800 rounded-2xl"
          >
            {uploading ? 'Creating Event...' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  );
}
