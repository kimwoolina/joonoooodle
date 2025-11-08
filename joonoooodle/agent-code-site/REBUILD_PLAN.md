# Agent Code Site - Rebuild Plan

## Current Issues
1. ❌ Demo site is separate from main site
2. ❌ Split view (chat left, preview right) instead of embedded chat
3. ❌ Changes apply immediately without review
4. ❌ AI messages are too technical (mentions file operations)
5. ❌ Chat is not interruptible (must wait for completion)

## Target Architecture

### Core Concept
- **Main Website**: Full-featured production website (main branch)
- **Embedded Chat**: Floating chat widget/panel on the website
- **Feature Branches**: Each user request creates a Git branch
- **Preview Mode**: Users see their own branch changes
- **Admin Queue**: Requests wait for admin approval
- **Admin Dashboard**: Review, approve, or reject requests
- **Interruptible**: Can send new messages while AI is working

### User Workflow
```
1. User visits site → Prompted for name (cookie stored)
2. User opens chat widget → Asks for feature
3. AI creates feature branch → `user-john-dark-mode`
4. AI makes changes on branch → Commits to branch
5. User gets notification → "Preview ready!"
6. User previews changes → Sees their branch in iframe
7. User submits for approval → Added to admin queue
8. User sees status → "Pending approval..."

   [Meanwhile on Admin side:]
   A. Admin opens dashboard → Sees queue
   B. Admin reviews request → Views preview + diff
   C. Admin approves → Branch merges to main, live site updates
   OR
   C. Admin rejects → Branch deleted, user notified

9. User gets notification → "Approved!" or "Rejected"
```

### Git Branch Strategy
```
main (live site)
├── user-alice-dark-mode (pending)
├── user-bob-add-gallery (pending)
└── user-charlie-new-colors (approved, merged, deleted)
```

---

## Detailed Implementation Plan

### Phase 1: Git Branch & Queue System (Backend)
**Goal**: Per-user feature branches with admin approval queue

1. **Git Branch Service** (`server/src/services/gitService.js`)
   - Create feature branch per user request: `user-{username}-{feature-slug}`
   - All AI changes committed to user's feature branch
   - Branches are isolated - users only see their own changes
   - Admin can merge approved branches to main
   - Delete rejected branches

2. **Queue Service** (`server/src/services/queueService.js`)
   - Store pending change requests in queue
   - Each entry: `{ id, username, branchName, description, timestamp, status }`
   - Status: `pending`, `approved`, `rejected`
   - API to add/remove/update queue items
   - Persist queue to file or database

3. **Update File Service**
   - All file modifications happen on active feature branch
   - Check out user's branch before making changes
   - Switch back to main for live site serving

4. **API Endpoints**

   **User Endpoints:**
   - `POST /api/user/request` - Submit feature request (creates branch + queue entry)
   - `GET /api/user/preview/:branchName` - Preview their feature branch
   - `GET /api/user/status` - Check status of their requests
   - `POST /api/user/cancel/:requestId` - Cancel pending request

   **Admin Endpoints:**
   - `GET /api/admin/queue` - Get all pending requests
   - `POST /api/admin/approve/:requestId` - Merge branch to main
   - `POST /api/admin/reject/:requestId` - Delete branch + mark rejected
   - `GET /api/admin/preview/:branchName` - Preview any branch

   **Session:**
   - `GET /api/user/name` - Get username from session
   - `POST /api/user/name` - Set username for session

### Phase 2: Chat Interruption (Backend)
**Goal**: Allow users to interrupt ongoing AI requests

1. **Session Management**
   - Track active AI requests by session ID
   - Add abort controller for each Claude API call
   - When new message arrives, cancel previous request

2. **Update Claude Service**
   - Add `abortController` to each stream
   - Implement `cancelRequest(sessionId)` method
   - Handle cleanup when request is cancelled

3. **WebSocket Events**
   - `message:cancel` - Client requests cancellation
   - `message:cancelled` - Server confirms cancellation
   - Queue new message after cancellation

### Phase 3: Conversational AI (Backend)
**Goal**: Make AI responses user-friendly, not technical

1. **Update System Prompt**
   - Instruct AI to be conversational
   - Don't mention file names, tool usage, or technical details
   - Focus on what's being done, not how
   - Examples:
     - ❌ "I'm using the Edit tool to modify styles.css..."
     - ✅ "Working on changing the colors to blue..."

2. **Filter Tool Events**
   - Don't show tool execution events to user
   - Only show AI's conversational messages
   - Keep tool events in logs for debugging

### Phase 4: Main Website Features
**Goal**: Build a full-featured website (not just a demo)

1. **Enhanced Website Content**
   - Rich landing page with animations
   - Multiple sections (hero, features, testimonials, pricing, FAQ, contact)
   - Blog/articles section
   - User authentication UI (mock or real)
   - Dashboard/account section
   - Product showcase
   - Interactive elements (sliders, modals, dropdowns)

2. **Better Styling**
   - Modern design system
   - Responsive layouts
   - Animations and transitions
   - Dark mode capability
   - Component library

3. **JavaScript Functionality**
   - Form validation
   - Dynamic content loading
   - Interactive components
   - State management
   - API integration examples

### Phase 5: Embedded Chat Widget
**Goal**: Move chat from split view to embedded widget on main site

1. **Username Prompt** (`main-site/username-modal.js`)
   - Show modal on first visit
   - Ask "What's your name?"
   - Store in cookie
   - Use for git commits and chat history

2. **Chat Widget Component** (`main-site/chat-widget.js`)
   - Floating button/icon (bottom right)
   - Click to open/close chat panel
   - Slide-in panel animation
   - Minimize/maximize/close controls
   - Badge for notifications when preview is ready

3. **Chat Panel**
   - Overlay panel (not split view)
   - Same chat UI as before, but embedded
   - Z-index above main content
   - Shows chat history from localStorage

4. **Remove Split View**
   - Full screen shows main website
   - Chat is overlay/modal when opened
   - No separate "client" React app needed (or merge into main site)

### Phase 6: Preview & Submit System (Frontend)
**Goal**: Users preview their changes and submit for admin approval

1. **Preview Notification**
   - When AI finishes creating feature branch, show notification
   - "Preview is ready! Click to review your changes"
   - Badge on chat widget icon
   - Click to open preview modal

2. **Preview Modal Component**
   - Modal/overlay showing user's feature branch
   - iframe with their branch version of site
   - Diff view for file changes
   - List of modified files
   - Branch name displayed: `user-john-dark-mode`

3. **Submit for Approval Controls**
   - "Submit for Approval" button (green) - adds to admin queue
   - "Cancel" button (red) - discards branch
   - "View Diff" to see file-by-file changes
   - Show summary: "3 files will be modified"
   - After submission: "Your request has been queued for admin approval"

4. **Request Status Indicator**
   - Show status of user's requests in chat widget
   - Badge: "1 request pending", "Request approved!", "Request rejected"
   - Click to view request details
   - Notification when admin approves/rejects

### Phase 7: Admin Dashboard
**Goal**: Admins can review and approve/reject user requests

1. **Admin Dashboard Page** (`main-site/admin.html`)
   - Protected page (simple password or secret URL for now)
   - List all pending requests in queue
   - Show: username, feature description, timestamp, branch name
   - Sort by date, filter by status

2. **Request Review Interface**
   - Click request to open review modal
   - Preview iframe showing the branch
   - Diff view of all changes
   - User's chat conversation with AI
   - Approve/Reject buttons

3. **Approve Action**
   - Merges feature branch to main
   - Deletes feature branch
   - Updates queue status to "approved"
   - Sends notification to user
   - Live site updates immediately

4. **Reject Action**
   - Deletes feature branch
   - Updates queue status to "rejected"
   - Sends notification to user with reason (optional)
   - User can retry with modifications

### Phase 8: File Structure Reorganization
**Goal**: Clean architecture with staging support

```
agent-code-site/
├── server/                    # Backend (unchanged location)
│   ├── src/
│   │   ├── services/
│   │   │   ├── claudeService.js      # Updated for conversational AI
│   │   │   ├── fileService.js        # Updated for staging
│   │   │   ├── versionService.js     # NEW - staging/versioning
│   │   │   └── sessionService.js     # NEW - session management
│   │   ├── routes/
│   │   │   └── changes.js            # NEW - apply/reject endpoints
│   │   └── server.js
│   └── package.json
│
├── main-site/                 # The actual website (replaces demo-site)
│   ├── index.html             # Full-featured homepage
│   ├── styles.css             # Enhanced styling
│   ├── script.js              # Main site functionality
│   ├── chat-widget.js         # NEW - Embedded chat widget
│   ├── chat-widget.css        # NEW - Chat widget styles
│   ├── pages/                 # NEW - Additional pages
│   │   ├── about.html
│   │   ├── features.html
│   │   └── contact.html
│   └── components/            # NEW - Reusable components
│       ├── header.js
│       ├── footer.js
│       └── modal.js
│
├── staging/                   # NEW - Temporary staged changes
│   └── [session-id]/          # Per-session staging area
│
└── client/                    # REMOVE or integrate into main-site
```

### Phase 9: Integration & Testing
**Goal**: Everything works together

1. **Connect Components**
   - Chat widget → Backend WebSocket
   - Preview panel → Staging API
   - Apply button → Commit changes
   - Reject button → Discard changes

2. **Test Flows**
   - User asks for feature
   - AI works on it (can be interrupted)
   - Changes staged (not live yet)
   - Preview shows proposed changes
   - User applies or rejects
   - Live site updates only after apply

3. **Error Handling**
   - Handle cancelled requests gracefully
   - Revert if apply fails
   - Session cleanup
   - Concurrent user handling

---

## Implementation Order

### Sprint 1: Backend Foundation
1. ✅ Create gitService.js (branch management)
2. ✅ Create queueService.js (approval queue)
3. ✅ Update fileService.js for branch-based operations
4. ✅ Add sessionService.js for user session management
5. ✅ Implement chat interruption (abort controllers)
6. ✅ Add user API endpoints (request, preview, status)
7. ✅ Add admin API endpoints (queue, approve, reject)
8. ✅ Update Claude system prompt (conversational)

### Sprint 2: Main Website
1. ✅ Create enhanced main-site with rich features
2. ✅ Add multiple pages and sections
3. ✅ Implement modern design
4. ✅ Add interactive JavaScript features

### Sprint 3: Chat Widget
1. ✅ Build floating chat widget
2. ✅ Create chat panel overlay
3. ✅ Integrate WebSocket connection
4. ✅ Add open/close/minimize controls

### Sprint 4: Preview & Admin System
1. ✅ Create preview modal for users
2. ✅ Build submit for approval controls
3. ✅ Implement diff viewer
4. ✅ Add change notifications
5. ✅ Build admin dashboard page
6. ✅ Create admin review interface
7. ✅ Implement approve/reject actions

### Sprint 5: Polish & Testing
1. ✅ End-to-end testing
2. ✅ Fix bugs
3. ✅ Optimize performance
4. ✅ Documentation

---

## Key Technical Decisions

### Staging Approach
**Option A**: In-memory staging (fast, but lost on restart)
**Option B**: Temp directory per session (persistent, slower)
**Recommendation**: Start with Option A, add Option B later

### Chat Widget Integration
**Option A**: Keep React client, embed as iframe
**Option B**: Vanilla JS widget, no React
**Recommendation**: Option B (lighter, easier to embed)

### Preview Display
**Option A**: Side-by-side iframe comparison
**Option B**: Single iframe with toggle
**Recommendation**: Option B (simpler UX)

### Interruption Strategy
**Option A**: Cancel and discard previous request
**Option B**: Queue requests
**Recommendation**: Option A (simpler, more responsive)

---

## Success Criteria

- ✅ User can chat with AI from main website (embedded widget)
- ✅ AI responses are conversational, not technical
- ✅ User can interrupt AI at any time
- ✅ Changes go to staging first
- ✅ User can preview changes before applying
- ✅ User can apply or reject changes
- ✅ Live site only updates after "Apply"
- ✅ Main website is feature-rich and production-quality
- ✅ System handles multiple concurrent users

---

## Decisions Made ✅

1. ✅ **Staging**: Use Git branches per user per feature
2. ✅ **Preview**: Modal view, only show notification when AI is done (no hot reload)
3. ✅ **Chat history**: Persist across browser sessions (localStorage)
4. ✅ **User identification**: Ask for name on first visit, store in cookie (no login/auth)
5. ✅ **Multiple users**: Each user gets own feature branch (e.g., `user-john-dark-mode`)
6. ✅ **Approval Queue**: Changes go to admin queue, not live immediately
7. ✅ **User-specific preview**: Users see their own branches, not others' pending changes
8. ✅ **Admin dashboard**: Admins can approve/reject queued changes
9. ✅ **Git workflow**: Per-feature branches, admin approval merges to main
10. ✅ **Color scheme**: Light blue (revert from green)
11. ⏸️ **Mobile**: Handle later
12. ⏸️ **Rate limiting**: Handle later

---

## Timeline Estimate

- Sprint 1 (Backend): 2-3 hours
- Sprint 2 (Main Site): 2-3 hours
- Sprint 3 (Chat Widget): 1-2 hours
- Sprint 4 (Preview): 1-2 hours
- Sprint 5 (Polish): 1-2 hours

**Total**: ~7-12 hours of development

---

## Next Steps

1. Review and approve this plan
2. Answer questions above
3. Start Sprint 1 (Backend Foundation)
4. Iterate and test each sprint
5. Deploy and celebrate! 🎉
