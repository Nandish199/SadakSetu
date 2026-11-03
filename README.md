# SadakSetu Admin Dashboard

Phase-gated React frontend for municipal road safety operations. This repository contains all Phases 0–12: project foundation, responsive application shell, client-side authentication/session boundaries, dashboard overview, complaint management, road map, AI detection, repair team management, user management, reports and analytics, notifications and settings, backend API integration preparation, and final quality assurance.

## Phase 0 status

- React + TypeScript + Vite initialized directly in this directory.
- Tailwind CSS 3 configured with shadcn/ui-compatible CSS variables and aliases.
- `components.json` configured for future shadcn/ui component generation.
- ESLint flat configuration enabled for TypeScript and React hooks.
- Vitest + Testing Library smoke-test setup included.
- `.env.example` provides `VITE_API_BASE_URL` for future API integration.
- SadakSetu logo stored at `public/sadaksetu-logo.png`.

## Phase 1 status

- Responsive navy sidebar with branded navigation, workspace sections, profile area, and help affordance.
- Sticky top navigation with search, notification, profile, and mobile menu controls.
- Reusable shadcn/ui-style `Button`, `Card`, `Badge`, `Input`, and `Separator` primitives.
- React Router route structure for overview, incidents, roads, citizens, analytics, live map, and settings.
- Placeholder route pages clearly identify the future phase that owns each feature.
- Mobile navigation drawer closes on backdrop click or route selection.

## Phase 2 status

- Public admin login route with email/password validation and accessible error states.
- Protected application routes redirect unauthenticated users to `/login` and preserve the requested path.
- Backend authentication stores only session metadata in `sessionStorage`; passwords are never persisted by the frontend.
- Unique session ID, creation time, last activity time, and absolute expiry are tracked.
- Automatic logout after 30 minutes of inactivity or 8 hours of absolute session lifetime.
- Activity events refresh last activity, and a polling check detects expired or replaced sessions.
- Sign-out control is available in the sidebar.
- Expired sessions return to login with an expiration message.
- `TESTING.md` records the mandatory seven-pass verification for each completed phase.
- `PHASE_TRACKER.md` records phase status and approval boundaries.

Authentication uses the connected backend API. Server-side identity verification, secure token handling, session revocation, and API error handling are implemented by the backend.

## Phase 3 status

- Dashboard statistics cards for complaint volume, resolution rate, active complaints, and response time.
- Complaint activity chart with reported/resolved trends.
- Geographic complaint summary by municipal zone.
- Recent complaints and recent operations activity.
- Dashboard route is lazy-loaded to keep the initial bundle smaller.

## Phase 4 status

- Searchable complaint listing with status/priority filters, sorting, pagination, and empty states.
- Complaint detail drawer with photo viewing, location, reporter, priority, and description.
- Status updates, repair-team assignment, administrative notes, and invalid-complaint deletion confirmation.
- Uses the connected backend complaint service for loading, filtering, status updates, and administrative notes.

## Phase 5 status

- Leaflet/OpenStreetMap live road map with backend-provided complaint markers.
- Complaint markers with severity indicators and map popups.
- Search, status, priority, and zone filters.
- Reset view, legend, and selected-location details with complaint-management navigation.

## Phase 6 status

- Protected AI pothole detection workspace with image upload and preview.
- YOLO11-compatible inference adapter interface with explicit unavailable behavior until a persisted image is sent to the backend.
- Bounding boxes, confidence scores, severity classification, and recommended actions.
- Detection history and tested image validation.

## Phase 7 status

- Protected repair team management route with team summary statistics.
- Search and availability filtering across repair teams.
- Add and edit team forms with required-field validation.
- Team detail drawer with contact information, specialties, availability, and assigned complaints.
- Team management state is empty until teams are loaded from the connected backend service.
- Team management links into the existing complaint workspace.

## Phase 8 status

- Protected user-management workspace at the existing `/citizens` route.
- User listing with responsive desktop/mobile views, search, status filtering, and role filtering.
- User profile drawer with contact details, reporting activity, joined date, and last activity.
- Edit-profile workflow for contact details, area, and role.
- Account activation and deactivation actions with visible status updates.
- User summary cards for total, active, inactive, and submitted-report counts.

## Phase 9 status

- Protected Reports & Analytics workspace at `/analytics`.
- Monthly reported-versus-resolved complaint trend chart.
- Severity distribution with resolution progress for critical, high, medium, and low complaints.
- Area-wise reports with complaint volume, critical counts, and resolution rates.
- Repair team performance report with assignments, resolutions, and average response time.
- CSV export containing all report datasets and print-friendly report styling.

## Phase 10 status

- Persistent notification center in the top navigation with unread counts and mark-as-read actions.
- Administrator profile settings with backend-oriented save feedback.
- Password settings with required-field, length, and confirmation validation.
- Application preferences for email alerts, critical alerts, weekly reports, and compact tables.
- Current session information showing status, session ID, activity, and expiry details.
- Explicit sign-out control from the settings workspace.

## Phase 11 status

- Axios client configured from `VITE_API_BASE_URL` and `VITE_API_TIMEOUT_MS`.
- Typed API contracts for authentication, complaints, dashboard summaries, and common FastAPI envelopes.
- Request authentication headers and 401 session-expiry event handling.
- Normalized API error type with status, code, and request ID support.
- Authentication, complaint, and dashboard services use the real FastAPI contract.

## Phase 12 status

- Full automated regression suite, TypeScript build, ESLint, dependency audit, and production preview verification completed.
- Responsive browser checks completed for mobile login/dashboard/users and desktop reports/settings/notifications.
- Browser runtime console check completed with no errors or warnings.
- All planned frontend phases are complete; backend deployment and production security hardening remain environment-specific follow-up work.

## Commands

```bash
npm run dev       # start the Vite development server
npm run build     # type-check and create a production build
npm run lint      # run ESLint
npm test          # run the test suite once
npm run test:watch
```

## Environment

Copy `.env.example` to `.env.local` and adjust `VITE_API_BASE_URL` when an API is available.

The planned frontend implementation is complete.
## Windows quick start

Double-click [`run_sadaksetu.bat`](run_sadaksetu.bat) from the project root. It opens the FastAPI backend, Vite web dashboard, and Android debug build/install in separate Command Prompt windows, runs database migrations, and starts the applications.

Requirements: Python 3.12 with `backend\.venv` installed, Node.js LTS/npm, the configured PostgreSQL/PostGIS database, Android Studio/Gradle, and `adb` on PATH for automatic phone installation. The Android project is expected at `..\Android Application`; override it with `SADAKSETU_ANDROID_DIR` when needed. Override the detected Wi-Fi address with `SADAKSETU_LAN_IP` if Windows selects the wrong adapter.

The launcher uses backend port `8001` and dashboard port `5174`, and passes the detected Windows LAN address to the Android debug build so a phone on the same Wi-Fi network can connect.

