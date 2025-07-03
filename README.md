# Poker Admin Frontend

This is the admin frontend for the poker game platform. It provides a comprehensive admin panel for managing users, tournaments, transactions, and system settings.

## Features

- **Dashboard**: Overview of platform statistics and recent activity
- **User Management**: View, search, and manage all registered users
- **Tournament Management**: Create and manage poker tournaments
- **Transaction Monitoring**: Track all financial transactions
- **Settings**: Configure admin panel preferences and system settings
- **Authentication**: Secure admin login and registration system

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Prerequisites

- Node.js 18+ 
- npm or yarn
- The poker server should be running on `http://localhost:5000`

## Installation

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the admin directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

## Development

Start the development server:

```bash
npm run dev
```

The admin frontend will be available at `http://localhost:3001`

## Building for Production

```bash
npm run build
```

## Project Structure

```
admin/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AdminLayout.tsx  # Main admin layout with sidebar
│   │   └── ProtectedRoute.tsx # Authentication guard
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── TournamentsPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── api.ts           # API client and endpoints
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── package.json
├── tailwind.config.js
└── README.md
```

## API Integration

The admin frontend communicates with the poker server through REST API endpoints:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Admin Dashboard**: `/api/admin/stats`
- **User Management**: `/api/admin/users`
- **Transactions**: `/api/admin/transactions`
- **Tournaments**: `/api/admin/create`

## Authentication

- Only users with `admin` role can access the admin panel
- JWT tokens are used for authentication
- Tokens are stored in localStorage
- Automatic redirect to login for unauthorized access

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for the API server (default: `http://localhost:5000`)

## Development Notes

- The admin frontend runs on port 3001 to avoid conflicts with the main client (port 3000)
- All admin routes are prefixed with `/admin/`
- The frontend uses the same authentication system as the main client but with role-based access control
- Mock data is used for some features until the corresponding API endpoints are implemented

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new features
3. Use Tailwind CSS for styling
4. Test authentication flows thoroughly
5. Ensure responsive design for mobile devices
