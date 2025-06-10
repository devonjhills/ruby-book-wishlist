# Book Collection Manager

A full-stack web application for managing your personal book collection. Built with Ruby on Rails backend and React frontend, featuring real-time Rails processing visualization.

## Features

- **Book Management**: Track reading status, add ratings, and personal notes
- **Smart Search**: Find books with covers and descriptions via Open Library API
- **Rails Visualization**: See Ruby backend processing in real-time (educational feature)
- **User Authentication**: JWT-based secure login system

## Quick Start

### Prerequisites
- Ruby 3.4+, Node.js 18+, PostgreSQL 14+

### Easy Start (Recommended)
```bash
# macOS/Linux
./start.sh

# Windows
start.bat
```

### Manual Setup
```bash
# Backend
cd wishlist_backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3001

# Frontend (in new terminal)
cd wishlist_frontend
npm install
npm run dev
```

### Demo Account
- **Email**: demo@example.com
- **Password**: password123

## Usage

1. **Access**: Frontend at `http://localhost:5173`, Backend at `http://localhost:3001`
2. **Login**: Use demo credentials or register new account
3. **Add Books**: Search Open Library or add manually
4. **Track Progress**: Update status (want to read → reading → completed)
5. **View Rails Processing**: Watch backend operations in real-time debug panels

## Architecture

```
ruby-app/
├── wishlist_backend/     # Rails 8 API + PostgreSQL
└── wishlist_frontend/    # React + Vite + Tailwind CSS
```

## Key Technologies

- **Backend**: Rails 8, PostgreSQL, JWT auth, Open Library API
- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Educational**: Real-time Rails processing visualization

## Book Statuses
- `want_to_read` → `currently_reading` → `completed`

## API Endpoints
- **Auth**: `/api/auth/{register,login,me}`
- **Books**: `/api/items` (full CRUD)
- **Search**: `/api/search/books?q=query`

## Educational Feature: Rails Debug Panel

The app includes a unique visualization showing:
- Rails routing and controller actions
- Active Record operations
- Database queries
- API integrations
- Real Ruby/Rails code snippets

Perfect for learning Rails patterns and backend processing!

## Troubleshooting

- **Database**: Ensure PostgreSQL is running
- **Ports**: Backend (3001), Frontend (5173)
- **CORS**: Check `config/initializers/cors.rb` if needed