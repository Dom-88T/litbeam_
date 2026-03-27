import { useParams, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { rsvpToEvent } from '../../store/slices/eventsSlice';
import { toggleRsvp, followUser, unfollowUser } from '../../store/slices/userSlice';
import { requestChatAccess } from '../../store/slices/chatSlice';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Users, ShieldCheck, Check, 
  Star, Flag, UserPlus, UserMinus, Lock, MessageCircle, Banknote, AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PaymentDialog from '../PaymentDialog';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allEvents = useSelector((state: RootState) => state.events.events);
  const user = useSelector((state: RootState) => state.user);
  
  const chatRequests = useSelector((state: RootState) =>
    state.chat.chatRequests[id || ''] || []
  );
  const approvedUsers = useSelector((state: RootState) =>
    state.chat.approvedUsers[id || ''] || []
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const event = allEvents.find(e => e.id === id);

  useEffect(() => {
    if (event) {
      setLoading(false);
    } else {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 3000); // 3s timeout
      return () => clearTimeout(timeout);
    }
  }, [event, id]);

  if (!id) {
    return <div className="flex items-center justify-center min-h-screen bg-white"><p className="text-gray-500">Invalid event link</p></div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-white"><p className="text-gray-500">Loading event details...</p></div>;
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
        <p className="text-2xl font-semibold text-gray-900 mb-3">Event not found</p>
        <p className="text-gray-500 mb-8">The event you're looking for might have been removed.</p>
        <Button onClick={() => navigate(-1)} className="bg-black text-white">Go Back</Button>
      </div>
    );
  }

  const isRsvped = user.rsvpedEvents.includes(event.id);
  const isHost = event.hostId === user.id;
  const isFollowing = user.following.includes(event.hostId);
  const hasAccess = isHost || approvedUsers.includes(user.id);
  const hasPendingRequest = chatRequests.some(r => r.userId === user.id && r.status === 'pending');
  const pendingRequests = chatRequests.filter(r => r.status === 'pending');

  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');

  const isFull = event.maxAttendees !== undefined && event.attendees >= event.maxAttendees;
  const canRsvp = !isFull || isRsvped;

  const handleRsvp = () => {
    if (!canRsvp && !isRsvped) {
      toast.error('Sorry, this event is full!');
      return;
    }
    
    if (event.isPaid && !isRsvped) {
      setShowPaymentDialog(true);
    } else {
      dispatch(toggleRsvp(event.id));
      if (!isRsvped) {
        dispatch(rsvpToEvent(event.id));
        toast.success("You're now attending this event! 🎉");
      }
    }
  };

  const handleRequestAccess = () => {
    const request = {
      id: `req${Date.now()}`,
      eventId: event.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      status: 'pending' as const,
      timestamp: new Date().toISOString(),
    };
    dispatch(requestChatAccess(request));
    toast.success('Request sent to host!');
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      dispatch(unfollowUser(event.hostId));
      toast.success(`Unfollowed ${event.hostName}`);
    } else {
      dispatch(followUser(event.hostId));
      toast.success(`Following ${event.hostName}`);
    }
  };

  const handleSubmitReview = () => {
    toast.success('Review submitted successfully! 🌟');
    setShowReviewDialog(false);
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header with Image */}
      <div className="relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
              <Flag className="w-6 h-6 text-gray-700" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Report Event</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to report this event?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => toast.success('Event reported. Thank you!')}>
                Report
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="relative h-80 bg-gray-900">
          <img
            src={event.images[selectedImageIndex]}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {event.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {event.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedImageIndex ? 'bg-[#9FE870] w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Title & Host Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex-1 pr-4">{event.title}</h1>
            <div className="flex flex-col gap-2 items-end">
              {event.isVerified && (
                <div className="bg-[#9FE870] text-black px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </div>
              )}
              {event.ageRestriction && (
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                  <AlertCircle className="w-3 h-3" /> {event.ageRestriction}+
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={event.hostAvatar}
                alt={event.hostName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#9FE870]"
              />
              <div>
                <p className="font-semibold text-gray-900">{event.hostName}</p>
                <p className="text-sm text-gray-500">Host</p>
              </div>
            </div>

            {!isHost && (
              <Button
                onClick={handleFollowToggle}
                variant="outline"
                size="sm"
                className={isFollowing ? 'bg-gray-100' : 'bg-black text-white hover:bg-gray-800'}
              >
                {isFollowing ? (
                  <> <UserMinus className="w-4 h-4 mr-1" /> Following </>
                ) : (
                  <> <UserPlus className="w-4 h-4 mr-1" /> Follow </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-black" />
              <span className="text-sm font-semibold">Date</span>
            </div>
            <p className="text-gray-900 font-medium">{formattedDate}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-black" />
              <span className="text-sm font-semibold">Time</span>
            </div>
            <p className="text-gray-900 font-medium">{event.time}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 col-span-2 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-[#9FE870]" />
              <span className="text-sm font-semibold">Location</span>
            </div>
            <p className="text-gray-900 font-medium">{event.location}</p>
            <p className="text-sm text-gray-600 mt-1">{event.address}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-black" />
              <span className="text-sm font-semibold">Attendance</span>
            </div>
            <p className="text-gray-900 font-medium">
              {event.attendees} going {event.maxAttendees && `(${event.maxAttendees} max)`}
            </p>
          </div>

          {event.isPaid && (
            <div className="bg-black rounded-2xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-[#9FE870] mb-1">
                <Banknote className="w-5 h-5" />
                <span className="text-sm font-semibold">Price</span>
              </div>
              <p className="text-white font-bold text-lg">₦{event.price?.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({event.reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <h3 className="font-bold text-gray-900 mb-3">About this event</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            {!hasAccess ? (
              <div className="text-center py-12 space-y-6">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <Lock className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Private Chat Group</h3>
                  <p className="text-gray-500">Request access from the host to join the event chat group</p>
                </div>

                {hasPendingRequest ? (
                  <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-6 py-3 rounded-2xl">
                    <MessageCircle className="w-5 h-5" />
                    Request Pending
                  </div>
                ) : (
                  <Button 
                    onClick={handleRequestAccess}
                    className="bg-black text-white hover:bg-gray-800 w-full py-6 rounded-2xl"
                  >
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Request to Join Chat
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Check className="w-16 h-16 text-[#9FE870] mx-auto mb-4" />
                <h3 className="text-xl font-bold">Chat Access Granted</h3>
                <p className="text-gray-500 mt-2">Go to the Chat tab in bottom navigation to message.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-6">
            {/* Reviews content remains the same */}
            {event.averageRating > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="flex justify-center gap-2 mb-2">
                  <Star className="w-10 h-10 fill-[#9FE870] text-[#9FE870]" />
                  <span className="text-4xl font-bold">{event.averageRating.toFixed(1)}</span>
                </div>
                <p className="text-gray-600">{event.reviews.length} reviews</p>
              </div>
            )}

            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
              <DialogTrigger asChild>
                <Button className="w-full bg-black text-white py-6 rounded-2xl">
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rate this Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div>
                    <label className="block text-sm font-semibold mb-3">Your Rating</label>
                    <div className="flex gap-3 justify-center">
                      {[1,2,3,4,5].map(r => (
                        <button key={r} onClick={() => setReviewRating(r)}>
                          <Star className={`w-10 h-10 ${r <= reviewRating ? 'fill-[#9FE870] text-[#9FE870]' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Comment</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What did you think about this event?"
                      className="w-full h-32 p-4 border border-gray-300 rounded-2xl"
                    />
                  </div>
                  <Button 
                    onClick={handleSubmitReview} 
                    disabled={!reviewComment.trim()}
                    className="w-full bg-[#9FE870] text-black py-3 rounded-2xl font-semibold"
                  >
                    Submit Review
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {event.reviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviews yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* TICKET BUTTON - LAST CONTENT ON PAGE (White background + Black button) */}
      <div className="px-6 pb-8">
        <Button
          onClick={handleRsvp}
          className={`w-full py-7 text-lg font-bold rounded-2xl transition-all ${
            isRsvped 
              ? 'bg-[#9FE870] text-black' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isRsvped ? (
            <>You're Going! 🎉</>
          ) : event.isPaid ? (
            <>Get Ticket - ₦{event.price?.toLocaleString()}</>
          ) : (
            <>RSVP Now</>
          )}
        </Button>
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        event={event}
        onPaymentSuccess={() => {
          dispatch(toggleRsvp(event.id));
          dispatch(rsvpToEvent(event.id));
          toast.success("Payment successful! You're going! 🎉");
        }}
      />
    </div>
  );
}