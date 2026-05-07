# Gear Up — Vehicle Marketplace Frontend

Gear Up is a production-style vehicle marketplace frontend built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack React Query**, **Axios**, and **SignalR**.  
The platform connects car buyers, dealers, and administrators through car listings, appointment booking, KYC verification, community posts, notifications, and role-based dashboards.

> This repository focuses on the frontend application. The backend API is expected to run separately.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [My Role](#my-role)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Authentication & Authorization](#authentication--authorization)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Current Improvements](#current-improvements)
- [Future Improvements](#future-improvements)

---

## Overview

Gear Up is a full-featured vehicle marketplace frontend designed for three main user roles:

- **Users** can browse cars, view car details, book appointments, interact with posts, and manage their profile.
- **Dealers** can manage their vehicle inventory, handle appointments, complete KYC verification, and communicate with users.
- **Admins** can manage platform data, review dealer KYC submissions, and monitor listings.

The application uses a feature-based architecture with reusable UI components, typed API responses, protected routes, real-time communication, and test coverage for dashboard-related components.

---

## Getting Started

This project is a frontend-only app that expects a separate backend API.

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Other useful commands:

```bash
npm run lint
npm run build
npm run start
```

## My Role

I worked as the **frontend developer** responsible for:

- Building the frontend architecture with Next.js App Router and TypeScript
- Creating role-based dashboards for users, dealers, and admins
- Integrating protected backend APIs
- Implementing authentication flows with secure cookie-based sessions
- Building dealer inventory and appointment management interfaces
- Integrating SignalR for real-time updates
- Improving UI performance for image-heavy and data-heavy pages
- Writing unit and integration tests with Jest and React Testing Library
- Creating reusable UI components, hooks, and utility functions

---

## Key Features

### Authentication & Session Management

- Login, registration, password reset, and email verification flows
- Secure token handling with httpOnly cookies
- Access token and refresh token flow
- Protected routes based on authentication state
- Role-based redirects for Admin, Dealer, and User accounts
- App-level providers for shared auth/session state

### Role-Based Dashboards

- Admin dashboard for platform management
- Dealer dashboard for vehicle inventory and appointment tracking
- User profile and account management pages
- Dashboard statistics, filters, empty states, and responsive layouts

### Vehicle Marketplace

- Car search and listing pages
- Car detail pages
- Dealer car management
- Status-based filtering for vehicle listings
- Image support through remote image configuration

### Appointment System

- Appointment booking flow
- Dealer-side appointment management
- Appointment status handling
- User-friendly empty states and dashboard summaries

### KYC Verification

- Dealer KYC submission flow
- Admin KYC review interface
- KYC filtering and status-based dashboard views

### Community & Notifications

- Community post discovery
- Comments, likes, and user interactions
- Notification and messaging support

### Testing

- Component tests for dashboard UI
- Integration tests for dashboard behavior
- User interaction tests with React Testing Library
- Mocked dependencies for isolated and reliable test cases

---

## Tech Stack

| Category       | Technology                                        |
| -------------- | ------------------------------------------------- |
| Framework      | Next.js (App Router)                              |
| Language       | TypeScript                                        |
| UI Library     | React                                             |
| Styling        | Tailwind CSS                                      |
| Server State   | TanStack React Query                              |
| Realtime       | SignalR (@microsoft/signalr)                      |
| HTTP Client    | Axios                                             |
| Validation     | Zod                                               |
| Animation      | Framer Motion                                     |
| Icons          | Lucide React                                      |
| Virtualization | @tanstack/react-virtual                           |
| Utilities      | clsx, date-fns                                    |
| Testing        | Jest, React Testing Library, Jest DOM, User Event |
| Code Quality   | ESLint, Prettier                                  |

---

## Architecture Overview

```txt
Browser
  │
  ├─► Next.js App Router
  │     │
  │     ├─► Server Components
  │     ├─► Client Components
  │     ├─► Route Handlers
  │     └─► Protected Pages
  │
  ├─► Authentication Layer
  │     │
  │     ├─► Route handlers + auth helpers
  │     ├─► httpOnly cookies
  │     ├─► access_token
  │     └─► refresh_token
  │
  ├─► API Layer
  │     │
  │     ├─► Axios helpers
  │     ├─► Route Handler proxies
  │     └─► typed API responses
  │
  ├─► State/Data Layer
  │     │
  │     ├─► React Query
  │     └─► custom hooks
  │
  └─► Gear Up Backend API
```

## Authentication & Authorization

Gear Up uses a secure cookie-based authentication approach with role-based access control.

### Main Auth Flow

```txt
User submits login form
  ↓
Frontend sends credentials to the authentication API
  ↓
Backend validates credentials
  ↓
Backend returns access token and refresh token
  ↓
Frontend stores tokens in secure httpOnly cookies
  ↓
User is redirected based on role
```

## Project Structure

```txt
src/
├── app/
│   ├── api/                  # Route handlers and API proxy routes
│   ├── auth/                 # Login, register, reset, and verification flows
│   ├── features/             # Feature modules (auth, car, post, messaging, etc.)
│   ├── shared/               # Shared UI, hooks, types, providers, utilities
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
│
├── proxy.ts                  # API proxy/token helper
```

## Testing

This project uses **Jest** and **React Testing Library** for unit and integration testing.

The test setup focuses on verifying UI behavior, user interactions, conditional rendering, and dashboard component reliability.

### Current Test Coverage

Current test coverage includes:

- Dashboard statistic cards
- Dashboard header rendering
- Filter dropdown behavior
- Empty inventory states
- Dealer car card rendering
- Dealer car edit and delete interactions
- Car list rendering
- Dealer dashboard integration behavior
- User interaction tests with React Testing Library
- Conditional rendering and edge case handling
- Mocked components and context providers for isolated tests

### Testing Tools

| Tool                  | Purpose                                      |
| --------------------- | -------------------------------------------- |
| Jest                  | Test runner and assertions                   |
| React Testing Library | Component rendering and user-focused testing |
| Jest DOM              | Custom DOM matchers                          |
| User Event            | Realistic user interaction testing           |

### Run Tests

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test -- --coverage
```

### Testing Strategy

The project follows a user-focused testing approach:

- Test what the user sees and interacts with
- Avoid testing internal implementation details
- Mock external dependencies when needed
- Keep dashboard and UI tests isolated
- Verify important user actions such as filtering, editing, deleting, and rendering empty states
- Use integration tests for larger dashboard flows

---

## Current Improvements

Recent updates reflected in the codebase include:

- Real-time messaging and notifications via SignalR
- Virtualized lists for post discovery using `@tanstack/react-virtual`
- Token-aware API proxy flow and route handlers
- Expanded feature modules under `src/app/features`

---

## Recommended Screenshots

Adding screenshots will make the project more recruiter-friendly and easier to understand at a glance.

Recommended screenshot structure:

```txt
public/readme/
├── home-page.png
├── car-detail.png
├── dealer-dashboard.png
├── admin-dashboard.png
├── kyc-review.png
├── appointment-flow.png
├── community-posts.png
└── mobile-view.png
```

Example README screenshot section:

```md
## Screenshots

### Home Page

![Home Page](public/readme/home-page.png)

### Dealer Dashboard

![Dealer Dashboard](public/readme/dealer-dashboard.png)

### Car Detail Page

![Car Detail Page](public/readme/car-detail.png)

### Admin KYC Review

![Admin KYC Review](public/readme/kyc-review.png)
```

Recommended screenshots to add:

- Home page
- Featured car listings
- Car detail page
- Dealer dashboard
- Admin dashboard
- KYC verification page
- Appointment booking flow
- Community post/discover page
- Mobile responsive layout

---

## What This Project Demonstrates

This project demonstrates my ability to build a real-world frontend application with:

- Modern Next.js App Router architecture
- Type-safe React development with TypeScript
- Secure authentication handling
- Role-based access control
- Complex dashboard UI development
- API integration with backend services
- Real-time frontend communication with SignalR
- Performance-aware list rendering
- Form validation and user feedback
- Component and integration testing
- Feature-based project organization
- Reusable UI component design
- Responsive layouts for multiple screen sizes
- Production-style error handling and loading states

---

## Future Improvements

Planned improvements:

- Add Playwright E2E tests for critical user flows
- Improve production error handling for safer toast messages
- Add better demo data for portfolio and recruiter review
- Add screenshots and GIFs to this README
- Add CI workflow for linting, testing, and building
- Improve image fallback handling
- Add stronger loading and skeleton states
- Improve mobile dashboard navigation
- Improve reusable form components
- Add stronger API response validation with Zod
- Improve empty states across all dashboard pages
- Add more documentation for authentication and route protection
- Add more integration tests for appointment and KYC flows
- Add better error boundaries for page-level failures
- Add Storybook for reusable UI components
- Improve SEO metadata for public marketplace pages
- Add performance monitoring for image-heavy pages
