# ⚛️ Ruby Library Frontend

**Modern React frontend for the Ruby Library book collection system**

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 🌟 Overview

The Ruby Library frontend is a sophisticated React application built with modern tools and practices. It features a custom Ruby-themed design system, educational Rails processing visualization, and seamless integration with the Rails backend API.

## 🏗️ Architecture

```
wishlist_frontend/
├── src/
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.jsx          # Custom button component
│   │   │   ├── card.jsx            # Card layout component
│   │   │   └── ...                 # Other UI primitives
│   │   ├── ItemCard.jsx            # Book display component
│   │   ├── Navbar.jsx              # Navigation header
│   │   └── RailsTeachingPanel.jsx  # Educational Rails insights
│   ├── pages/
│   │   ├── Dashboard.jsx           # User dashboard
│   │   ├── Items.jsx               # Book collection view
│   │   ├── AddItem.jsx             # Add/search books
│   │   ├── Login.jsx               # Authentication
│   │   └── Register.jsx            # User registration
│   ├── contexts/
│   │   ├── AuthContext.jsx         # Authentication state
│   │   └── BackendActivityContext.jsx  # Rails debug tracking
│   ├── services/
│   │   └── api.js                  # Axios API client
│   └── assets/
│       └── ruby-icon.svg           # Custom Ruby gem icon
├── public/                         # Static assets
└── index.html                      # Single page app entry
```

## 🔧 Tech Stack

- **Frontend Framework**: React 18 with hooks and modern patterns
- **Build Tool**: Vite 5 for fast development and optimized builds
- **Styling**: Tailwind CSS with custom Ruby Library theme
- **UI Components**: shadcn/ui component library
- **Routing**: React Router v6 with protected routes
- **HTTP Client**: Axios with request/response interceptors
- **State Management**: React Context API
- **Typography**: Custom font stack (Crimson Text + IBM Plex Sans)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ ([Install Node.js](https://nodejs.org/))
- npm or yarn package manager

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file (optional):

```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_ENABLE_RAILS_DEBUG=true
```

## 🎨 Ruby Library Design System

### Typography Hierarchy

```css
/* Heading Fonts - Crimson Text (Serif) */
.typography-display    /* 4xl-6xl, for major headings */
.typography-h1         /* 3xl-4xl, page titles */
.typography-h2         /* 2xl-3xl, section headers */
.typography-h3         /* xl-2xl, subsection headers */
.typography-h4         /* lg-xl, component titles */

/* Body Fonts - IBM Plex Sans */
.typography-body-large /* lg, emphasized content */
.typography-body       /* base, standard text */
.typography-body-small /* sm, secondary text */
.typography-caption    /* xs, labels and captions */

/* Code Font - JetBrains Mono */
.typography-code       /* sm, code snippets */
```

### Color Palette

```css
/* Ruby Library Theme Colors */
--primary: 355 75% 55%; /* Deep ruby red */
--accent: 340 60% 45%; /* Rich burgundy */
--ruby: 355 85% 60%; /* Bright ruby */
--ruby-dark: 355 60% 35%; /* Dark ruby */
--garnet: 350 50% 30%; /* Deep garnet */
```

### Custom Components

```jsx
// Ruby-themed title component
<h1 className="ruby-title">Ruby Library</h1>

// Elegant serif text with advanced typography
<p className="elegant-text">Classical library aesthetic</p>

// Technical sans-serif text
<span className="tech-text">Modern development info</span>
```

## 🧩 Component Architecture

### Page Components

- **Dashboard**: Overview with statistics and recent books
- **Items**: Full book collection with filtering and sorting
- **AddItem**: Book search and manual entry with Open Library integration
- **Auth Pages**: Login and registration forms

### Reusable Components

- **ItemCard**: Displays book information with editing capabilities
- **Navbar**: Navigation with Ruby gem branding
- **RailsTeachingPanel**: Educational Rails processing visualization

### UI Components (shadcn/ui)

- **Button**: Consistent button styling with variants
- **Card**: Content containers with Ruby theme
- **Dialog**: Modal dialogs for forms and confirmations
- **Tabs**: Tabbed interfaces for complex content

## 🔐 Authentication Flow

### Context-Based State Management

```jsx
// Auth Context provides global authentication state
const { user, login, logout, isAuthenticated } = useAuth();

// Automatic token management with Axios interceptors
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Route Protection

```jsx
// Protected routes require authentication
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

// Public routes redirect authenticated users
<Route path="/login" element={
  <PublicRoute>
    <Login />
  </PublicRoute>
} />
```

## 📊 Rails Processing Visualization

### Educational Features

The frontend includes unique educational components:

- **RailsTeachingPanel**: Interactive Rails framework deep dive
- **Backend Activity Tracking**: Real-time Rails operation monitoring
- **SQL Query Visualization**: Database query performance analysis
- **Request Lifecycle**: Step-by-step Rails request processing

### Implementation

```jsx
// Track Rails backend operations
const { addActivity } = useBackendActivity();

// Visualize Rails processing steps
addActivity("create_book", "Creating book with validations");

// Display educational panels
<RailsTeachingPanel
  debugInfo={debugInfo}
  isVisible={showEducationalPanels}
  onToggle={() => setShowEducationalPanels(!showEducationalPanels)}
/>;
```

## 🛠️ Development Tools

### Available Scripts

```bash
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
```

### Development Features

- **Hot Module Replacement**: Instant updates during development
- **Fast Refresh**: Preserve component state during edits
- **Source Maps**: Debug original source code in browser
- **TypeScript Support**: Ready for TypeScript migration

### Browser DevTools Integration

- **React Developer Tools**: Component inspection and debugging
- **Redux DevTools**: State management debugging (if implemented)
- **Network Tab**: API request monitoring
- **Console**: Application logging and error tracking

## 📱 Responsive Design

### Breakpoint Strategy

```css
/* Mobile First Approach */
sm: '640px'   /* Small devices */
md: '768px'   /* Medium devices */
lg: '1024px'  /* Large devices */
xl: '1280px'  /* Extra large devices */
2xl: '1536px' /* 2X large devices */
```

### Responsive Components

- **Navigation**: Collapsible mobile menu
- **Cards**: Responsive grid layouts
- **Typography**: Scalable font sizes
- **Spacing**: Adaptive margins and padding

## 🚀 Performance Optimizations

### Build Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Image and CSS optimization
- **Minification**: JavaScript and CSS minification

### Runtime Optimizations

```jsx
// Lazy loading for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Items = lazy(() => import("./pages/Items"));

// Memoization for expensive calculations
const BookStats = memo(({ books }) => {
  const stats = useMemo(() => calculateStats(books), [books]);
  return <StatsDisplay stats={stats} />;
});
```

## 🧪 Testing & Quality

### Linting Configuration

```javascript
// eslint.config.js
export default [
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      "react/jsx-no-target-blank": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
```

### Code Quality Tools

- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting (optional)
- **Husky**: Git hooks for quality gates (optional)

## 🏗️ Build and Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Serve locally for testing
npm run preview

# Deploy build folder to hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

### Environment Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-tabs", "@radix-ui/react-dialog"],
        },
      },
    },
  },
});
```

## 📚 Learning Resources

### React Patterns Demonstrated

- **Custom Hooks**: Reusable stateful logic
- **Context API**: Global state management
- **Error Boundaries**: Graceful error handling
- **Suspense**: Loading states and code splitting
- **Compound Components**: Flexible component APIs

### Modern JavaScript Features

- **ES6+ Syntax**: Arrow functions, destructuring, modules
- **Async/Await**: Promise-based API calls
- **Optional Chaining**: Safe property access
- **Template Literals**: Dynamic string generation

## 🤝 Contributing

### Development Guidelines

- Follow React best practices and hooks patterns
- Use TypeScript for new features (migration planned)
- Maintain the Ruby Library design system
- Write accessible components (ARIA labels, semantic HTML)
- Test new features thoroughly

### Component Development

```jsx
// Component template
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState("");

  useEffect(() => {
    // Side effects
  }, []);

  return (
    <div className="component-wrapper">
      <Button onClick={() => setState("clicked")}>Click me</Button>
    </div>
  );
};

export default MyComponent;
```

---

**Part of the Ruby Library full-stack application**

[← Backend README](../wishlist_backend/README.md) • [Main README →](../README.md)
