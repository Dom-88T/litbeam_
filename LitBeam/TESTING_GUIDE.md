# LitBeam - Testing Guide 🧪

## How to Test All Features

### 1. Authentication Flow
**Test Signup:**
1. Open app → See "LitBeam" splash screen (animated logo)
2. Wait 2.5 seconds → Redirects to signup page
3. Click on upload icon → Select profile photo from device
4. Fill in: Name, Email, Password, Neighborhood, Age (must be 18+)
5. Click "Sign Up" → Should redirect to home page

**Test Login:**
1. Already have account → Go to login page
2. Enter email and password
3. Click "Log In" → Should redirect to home page
4. Profile picture should appear in header

### 2. Home Page
**Test Notifications:**
1. Look at top right → See bell icon with badge (showing "2")
2. Click bell icon → Dropdown appears with notifications
3. See different types:
   - 🎉 New event notifications
   - 💰 Promotional offers
   - ✅ Chat request approvals
4. Unread notifications have green dot

**Test Event Discovery:**
1. Scroll through events on home page
2. See events from different hosts (not just yours)
3. Filter by category (House Party, Club, Outdoor, Concert, Other)
4. Search for events by name or neighborhood

### 3. Create Event
**Test Multi-Image Upload:**
1. Click "+" button in bottom nav
2. Fill in event details
3. Click "Upload from Gallery" → Select 1st image
4. Click again → Select 2nd image (max 4 total)
5. See image previews with X button to remove
6. Try uploading 5th image → Should show "Maximum 4 images allowed"
7. Set event as paid → Enter ticket price
8. Set max attendees (e.g., 50)
9. Click "Create Event" → Should upload images and create event

**Expected:** Event appears on home feed with image carousel

### 4. Event Details
**Test Image Carousel:**
1. Click on any event with multiple images
2. See dots at bottom → Click to switch between images

**Test Max Attendance:**
1. Find event with maxAttendees set
2. If event is full → See "Event Full" message
3. Try to RSVP → Should show "Sorry, this event is full!"
4. If not full → Can RSVP normally

**Test Payment Flow (Paid Events):**
1. Click on paid event
2. Click "Get Ticket" or RSVP button
3. Payment dialog opens:
   - Enter email for ticket delivery
   - Enter card number (1234 5678 9012 3456)
   - Enter expiry (12/25)
   - Enter CVV (123)
4. Click "Pay ₦X,XXX" → Processing animation (2.5 seconds)
5. Success screen with QR code ticket
6. Download ticket → PNG file saved
7. Close dialog → You're now RSVP'd to event

**Test Chat Request System:**
1. Go to event details → Click "Chat" tab
2. If not host and not approved:
   - See "Request to Join Chat" button
   - Click it → Status changes to "Request Pending"
3. If you're the host:
   - See "Pending Requests" section
   - See user avatars with Approve/Reject buttons
   - Click "Approve" → User can now chat
   - Click "Reject" → Request removed
4. If approved:
   - See chat messages
   - Type message in input field
   - Click send → Message appears instantly
   - See your messages in black bubbles (right side)
   - See others' messages in gray bubbles (left side)

**Test Follow/Unfollow:**
1. Click follow button on event host
2. Button changes to "Following"
3. Click again → Unfollows host

**Test Reviews:**
1. Click "Reviews" tab
2. Click "Write a Review"
3. Select star rating (1-5)
4. Write comment
5. Submit → Review appears in list

**Test Report:**
1. Click flag icon (top right of event)
2. Confirm report → "Event reported" message

### 5. Chat Page
**Test Chat List:**
1. Click "Chat" icon in bottom nav (3rd icon)
2. See all events where you have chat access:
   - Events you're hosting
   - Events where host approved your request
3. Each chat shows:
   - Event thumbnail
   - Event title
   - Last message preview
   - "Host" badge if you're the host
   - Attendee count
   - Event date
4. Click on any chat → Opens event details with chat tab

**Expected:** Only see chats you have access to (not all events)

### 6. Profile Page
**Test Profile Picture Edit:**
1. Click "Profile" in bottom nav
2. See your profile picture with upload icon (bottom right)
3. Click upload icon → Select new photo from device
4. "Profile picture updated!" message appears
5. New photo appears immediately on profile page
6. Go to home page → See new photo in header
7. Create event → Your new photo appears as host
8. Send chat message → Your new photo appears in message

**Test Logout:**
1. Look at top right of profile page
2. Click "Logout" button
3. "Logged out successfully" message
4. Redirects to login page
5. Try going to home → Should redirect to login (not logged in)

**Test Stats:**
1. See three stat cards:
   - Hosted events count
   - Attending events count  
   - Total reach (sum of attendees from your events)

**Test Event Lists:**
1. Scroll down to "Events I'm Hosting"
2. See all events you created
3. Scroll to "Events I'm Attending"
4. See all events you RSVP'd to

### 7. Cross-User Testing (Requires 2 Accounts)
**Scenario: User A creates event, User B joins**

**User A (Host):**
1. Sign up as User A
2. Create event "Rooftop Party"
3. Set max attendees to 50
4. Make it a paid event (₦5000)
5. Upload 4 images

**User B (Attendee):**
1. Sign up as User B (different email)
2. Go to home page
3. See "Rooftop Party" in feed (created by User A)
4. Click on event → See all details
5. Click "Request to Join Chat"
6. Buy ticket (if paid event)

**Back to User A:**
1. Go to "Rooftop Party" event details
2. Click "Chat" tab
3. See "Pending Requests (1)"
4. See User B with avatar and name
5. Click "Approve"

**Back to User B:**
1. Refresh or go to chat tab
2. Can now send messages
3. Send "Hey everyone!" → Appears in chat
4. Go to "Chat" page in bottom nav
5. See "Rooftop Party" in chat list

**Both Users:**
- Can now chat with each other
- See each other's messages
- User A has "Host" badge in chat

### 8. Edge Cases to Test

**Age Restriction:**
1. Try signing up with age < 18
2. Should show error: "You must be 18 or older"

**Event Full:**
1. Create event with maxAttendees: 2
2. RSVP with 2 different accounts
3. Try RSVPing with 3rd account
4. Should see "Event Full" error

**Image Upload Limit:**
1. Try uploading 5 images when creating event
2. Should see "Maximum 4 images allowed"

**Payment Required:**
1. Try RSVPing to paid event without payment
2. Should open payment dialog (can't skip)

**Chat Access:**
1. Try accessing chat without being approved
2. Should see "Request to Join Chat" button only

## Expected Behavior Summary

✅ **Authentication:** Secure login/signup with Supabase
✅ **Splash Screen:** Animated logo transitions to login
✅ **Notifications:** Bell icon with dropdown and unread count
✅ **Multi-Upload:** Up to 4 images per event
✅ **Payment:** Smooth flow with QR ticket generation
✅ **Chat Access:** Request → Host Approves → Can Chat
✅ **Max Attendance:** Prevents RSVP when full
✅ **Profile Edit:** Upload new photo, reflects everywhere
✅ **Logout:** Signs out and redirects to login
✅ **Cross-User:** Different users can see and join each other's events

## Design Verification

✅ **Colors:** Kiwi green (#9FE870), black, white only
✅ **No Gradients:** All solid colors
✅ **No Neon/Glow:** Clean, professional look
✅ **Proper Sizing:** Chat messages, buttons, text - all appropriate sizes
✅ **Mobile First:** Touch-friendly, responsive design

## Known Limitations

⚠️ **Email Delivery:** QR tickets shown in app (email delivery requires mail server setup)
⚠️ **Real Payments:** Demo payment flow (real payments need Paystack/Flutterwave)
⚠️ **Push Notifications:** In-app only (push requires Firebase/OneSignal)

All core features are fully functional for prototyping and testing! 🚀
