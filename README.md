# 💎 Ruby Library

<div align="center">

![Ruby Library Logo](wishlist_frontend/public/ruby-icon.svg)

**A sophisticated full-stack book collection management system built with Ruby on Rails and React**

[![Ruby](https://img.shields.io/badge/Ruby-3.4+-CC342D?style=for-the-badge&logo=ruby&logoColor=white)](https://www.ruby-lang.org/)
[![Rails](https://img.shields.io/badge/Rails-8.0-CC0000?style=for-the-badge&logo=rubyonrails&logoColor=white)](https://rubyonrails.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg?style=for-the-badge)](https://github.com/your-username/ruby-library)

[🚀 Live Demo](#live-demo) • [📖 Documentation](#documentation) • [⚡ Quick Start](#quick-start) • [🏗️ Architecture](#architecture)

</div>

---

## 🌟 Overview

Ruby Library is a modern, full-stack web application designed for book enthusiasts and Ruby developers. It combines elegant book collection management with educational insights into Ruby on Rails architecture, making it perfect for both personal use and learning Rails development patterns.

### ✨ Key Features

- 📚 **Smart Book Management** - Track reading progress, ratings, and personal notes
- 🔍 **Intelligent Search** - Find books with covers and descriptions via Open Library API
- 🎯 **Reading Status Tracking** - Organize books by want-to-read, currently-reading, and completed
- 🔐 **Secure Authentication** - JWT-based user authentication with demo account
- 📊 **Educational Rails Insights** - Real-time visualization of Rails processing (unique feature!)
- 🎨 **Ruby-Themed Design** - Beautiful dark theme with ruby red accents
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

### 🎓 Educational Value

This project serves as an **excellent portfolio piece** and **learning resource** for:

- Full-stack Ruby on Rails development
- Modern React frontend architecture
- API design and integration
- Database optimization and indexing
- Authentication and security best practices
- Real-time backend processing visualization

---

## 🚀 Live Demo

**Demo Credentials:**

- Email: `demo@example.com`
- Password: `password123`

> 🎯 **Portfolio Note**: This application showcases advanced full-stack development skills with Ruby on Rails backend, React frontend, PostgreSQL database, and modern web development practices.

---

## ⚡ Quick Start

### Prerequisites

Ensure you have the following installed:

- **Ruby 3.4+** ([Install Ruby](https://www.ruby-lang.org/en/documentation/installation/))
- **Node.js 18+** & **npm** ([Install Node.js](https://nodejs.org/))
- **PostgreSQL 14+** ([Install PostgreSQL](https://www.postgresql.org/download/))

### 🎯 One-Command Start (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/ruby-library.git
cd ruby-library

# macOS/Linux
./start.sh

# Windows
start.bat
```

### 🔧 Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

```bash
# 1. Backend Setup (Terminal 1)
cd wishlist_backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3001

# 2. Frontend Setup (Terminal 2)
cd wishlist_frontend
npm install
npm run dev
```

</details>

### 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api (when running)

---

## 🏗️ Architecture

```
ruby-library/
├── 🚂 wishlist_backend/         # Ruby on Rails 8 API
│   ├── app/
│   │   ├── controllers/api/     # API endpoints
│   │   ├── models/              # Active Record models
│   │   └── services/            # Business logic
│   ├── config/                  # Rails configuration
│   └── db/                      # Database migrations & seeds
│
├── ⚛️ wishlist_frontend/        # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route components
│   │   ├── contexts/            # React Context providers
│   │   └── services/            # API integration
│   └── public/                  # Static assets
│
└── 📋 Configuration Files
    ├── CLAUDE.md               # AI development guidelines
    ├── start.sh / start.bat    # Quick start scripts
    └── README.md              # This file
```

### 🔧 Tech Stack

#### Backend (Ruby on Rails)

- **Framework**: Ruby on Rails 8.0 (API-only)
- **Database**: PostgreSQL with optimized indexing
- **Authentication**: JWT tokens with 24-hour expiration
- **External APIs**: Open Library for book metadata
- **Testing**: Rails built-in test suite

#### Frontend (React)

- **Framework**: React 18 with Vite build tool
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom Ruby theme
- **UI Components**: shadcn/ui component library
- **HTTP Client**: Axios with interceptors
- **Typography**: Crimson Text (serif) + IBM Plex Sans

#### Database Schema

- **Users**: Authentication and profile management
- **Items**: Book records with metadata and user associations
- **Optimized Indexes**: Strategic indexing for performance

---

## 🎯 Core Features Deep Dive

### 📖 Book Management

- **CRUD Operations**: Full create, read, update, delete functionality
- **Status Tracking**: Want to read → Currently reading → Completed
- **Rich Metadata**: Covers, descriptions, authors, genres, release years
- **Personal Notes**: Add private notes and ratings (1-5 stars)

### 🔍 Smart Search Integration

- **Open Library API**: Real-time book search with cover images
- **Auto-complete**: Intelligent search suggestions
- **Metadata Enrichment**: Automatically fetch book descriptions and covers

### 🛡️ Security & Authentication

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Comprehensive server-side validation

### 📊 Educational Rails Visualization

_Unique feature that sets this project apart:_

- **Request Lifecycle**: Visualize Rails request processing pipeline
- **Database Queries**: Real-time SQL query monitoring and optimization
- **Active Record Operations**: See ORM operations in action
- **Performance Metrics**: Query timing and performance analysis

---

## 🚀 API Reference

### Authentication Endpoints

```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
```

### Book Management Endpoints

```
GET    /api/items          # List user's books
POST   /api/items          # Create new book
GET    /api/items/:id      # Get specific book
PUT    /api/items/:id      # Update book
DELETE /api/items/:id      # Delete book
```

### Search Endpoints

```
GET /api/search/books?q=query    # Search Open Library
```

---

## 🎨 Ruby Library Theme

The application features a sophisticated **Ruby Library** theme:

- **Color Palette**: Deep ruby reds with dark charcoal backgrounds
- **Typography**: Crimson Text for headings, IBM Plex Sans for body text
- **Icons**: Ruby gem iconography throughout the interface
- **Visual Effects**: Subtle gem patterns and ruby glow effects

---

## 🧪 Development & Testing

### Running Tests

```bash
# Backend tests
cd wishlist_backend
rails test

# Frontend linting
cd wishlist_frontend
npm run lint
```

### Development Commands

```bash
# Backend console
rails console

# Database operations
rails db:reset          # Reset database
rails db:seed           # Seed with demo data

# Frontend development
npm run dev             # Development server
npm run build           # Production build
```

---

## 📈 Performance Optimizations

- **Database Indexing**: Strategic indexes on user_id, status, and search fields
- **Query Optimization**: Efficient Active Record queries with includes()
- **Caching**: Rails.cache for frequently accessed data
- **Frontend**: Code splitting and lazy loading
- **API**: Pagination and filtering support

---

## 🤝 Contributing

Contributions are welcome! This project is designed to showcase modern full-stack development practices.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Ruby and Rails conventions
- Use the existing code style and patterns
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Portfolio Highlights

This project demonstrates:

- **Full-Stack Expertise**: End-to-end application development
- **Modern Architecture**: API-first design with separate frontend/backend
- **Database Design**: Optimized PostgreSQL schema with proper indexing
- **Security Best Practices**: JWT authentication, input validation, CORS
- **Educational Value**: Unique Rails processing visualization feature
- **UI/UX Design**: Custom theming with responsive design
- **API Integration**: External API consumption and error handling
- **Testing**: Comprehensive test coverage
- **Documentation**: Clear, professional documentation

---

<div align="center">

**Built with ❤️ and Ruby by [Your Name]**

[⭐ Star this repo](https://github.com/your-username/ruby-library) • [🐛 Report Bug](https://github.com/your-username/ruby-library/issues) • [💡 Request Feature](https://github.com/your-username/ruby-library/issues)

</div>
