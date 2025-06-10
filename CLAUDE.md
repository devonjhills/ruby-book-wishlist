# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a full-stack book collection application with separate backend and frontend:

- **Backend**: Rails 8 API-only app in `wishlist_backend/`
- **Frontend**: React + Vite app in `wishlist_frontend/`
- **Database**: PostgreSQL with JWT authentication
- **APIs**: Open Library for book search and metadata
- **Special Feature**: Rails processing visualization for educational purposes

## Essential Development Commands

### Backend (Rails API)
```bash
cd wishlist_backend
bundle install                    # Install dependencies
rails db:create db:migrate        # Setup database
rails db:seed                     # Create demo user
rails server -p 3001             # Start backend server
rails test                       # Run test suite
rails console                    # Access Rails console
```

### Frontend (React)
```bash
cd wishlist_frontend
npm install                       # Install dependencies
npm run dev                       # Start dev server (port 5173)
npm run build                     # Build for production
npm run lint                      # Run ESLint
```

### Running Both Services
- Backend runs on `http://localhost:3001`
- Frontend runs on `http://localhost:5173`
- Both must be running for full functionality

## Authentication Architecture

- **JWT tokens** with 24-hour expiration
- **Demo account**: `demo@example.com` / `password123`
- Tokens stored in localStorage on frontend
- Automatic token attachment via Axios interceptors
- Auth state managed through React Context (`AuthContext`)

## Database Models

### Users
- Standard authentication with bcrypt
- `has_many :items` relationship

### Items (Books Only)
- **item_type**: Always 'book' (movies removed)
- **Status enum**: `want_to_read`, `currently_reading`, `completed`
- **Fields**: title, author_or_director (author), description, notes, rating (1-5), cover_image_url, genre, release_year, external_id
- **Associations**: `belongs_to :user`

## API Structure

### Core Endpoints
- **Auth**: `/api/auth/{register,login,me}`
- **Items**: `/api/items` (full REST)
- **Search**: `/api/search/books?q=query`

### External APIs
- **Books**: Open Library API (no key required)
  - Search: `https://openlibrary.org/search.json`
  - Details: `https://openlibrary.org{work_key}.json`
  - Covers: `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg`

## Key Frontend Patterns

- **AuthContext**: Global authentication state
- **Protected Routes**: Route guards for auth/unauth users
- **API Service**: Centralized Axios instance with interceptors
- **Component Structure**: Pages (`pages/`) and reusable components (`components/`)
- **RailsDebugPanel**: Educational component showing backend processing

## Special Features

### Rails Processing Visualization
- **RailsDebugPanel**: Shows step-by-step Rails operations
- **Operations Covered**: 
  - `create_book`: Book creation workflow
  - `update_book`: Book update operations
  - `search_books`: Open Library API integration
  - `load_dashboard`: Data fetching and aggregation
- **Educational Value**: Demonstrates Rails routing, controllers, Active Record, SQL queries

### Enhanced Book Features
- **Descriptions**: Fetched from Open Library Works API
- **Cover Images**: High-quality covers from Open Library
- **Rich Metadata**: Author, genre, release year, ratings, personal notes

## Development Workflow

1. Ensure PostgreSQL is running
2. Start backend: `cd wishlist_backend && rails server -p 3001`
3. Start frontend: `cd wishlist_frontend && npm run dev`
4. Use demo credentials or register new account
5. Backend tests with `rails test`, frontend linting with `npm run lint`

## External Dependencies

- **Required**: PostgreSQL 14+, Ruby 3.4+, Node.js 18+
- **External APIs**: Open Library (free, no key required)
- CORS configured for `localhost:3000` and `localhost:5173`

## File Structure Notes

### Backend Key Files
- `app/models/item.rb`: Book model with validations
- `app/controllers/api/items_controller.rb`: CRUD operations
- `app/controllers/api/search_controller.rb`: Open Library integration
- `db/migrate/*_add_description_to_items.rb`: Description field migration

### Frontend Key Files
- `src/components/RailsDebugPanel.jsx`: Rails visualization component
- `src/components/ItemCard.jsx`: Book display and editing
- `src/pages/AddItem.jsx`: Book creation with search
- `src/pages/Dashboard.jsx`: Collection overview
- `src/services/api.js`: Centralized API calls

## Development Philosophy

This app serves as both a functional book collection manager and an educational tool for understanding Rails backend processing. The Rails debug panels provide insight into:

- HTTP request routing
- Controller action execution
- Active Record operations
- Database query generation
- External API integration
- JSON response serialization

Perfect for learning full-stack development patterns and Rails architecture!