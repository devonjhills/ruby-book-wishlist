# 🚂 Ruby Library Backend

**Ruby on Rails 8 API powering the Ruby Library book collection system**

[![Ruby](https://img.shields.io/badge/Ruby-3.4+-CC342D?style=flat-square&logo=ruby&logoColor=white)](https://www.ruby-lang.org/)
[![Rails](https://img.shields.io/badge/Rails-8.0-CC0000?style=flat-square&logo=rubyonrails&logoColor=white)](https://rubyonrails.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 🌟 Overview

The Ruby Library backend is a modern Rails 8 API-only application designed to showcase best practices in Ruby on Rails development. It features JWT authentication, optimized database queries, external API integration, and educational insights into Rails processing.

## 🏗️ Architecture

```
wishlist_backend/
├── app/
│   ├── controllers/
│   │   ├── api/                 # API endpoints (v1)
│   │   │   ├── auth_controller.rb      # Authentication
│   │   │   ├── items_controller.rb     # Books CRUD
│   │   │   └── search_controller.rb    # Book search
│   │   └── application_controller.rb   # Base controller
│   ├── models/
│   │   ├── user.rb             # User authentication model
│   │   └── item.rb             # Book model with validations
│   └── services/
│       └── jwt_service.rb      # JWT token management
├── config/
│   ├── routes.rb              # API routes definition
│   ├── database.yml           # PostgreSQL configuration
│   └── initializers/cors.rb   # CORS settings
└── db/
    ├── migrate/               # Database migrations
    └── seeds.rb              # Demo data seeding
```

## 🔧 Tech Stack

- **Framework**: Ruby on Rails 8.0 (API-only mode)
- **Database**: PostgreSQL 14+ with strategic indexing
- **Authentication**: JWT with bcrypt password hashing
- **External APIs**: Open Library integration
- **Testing**: Rails Test Suite (minitest)
- **Development**: Rails console, logging, debugging tools

## 🚀 Getting Started

### Prerequisites

- Ruby 3.4+ ([Install Ruby](https://www.ruby-lang.org/en/documentation/installation/))
- PostgreSQL 14+ ([Install PostgreSQL](https://www.postgresql.org/download/))
- Bundler gem (`gem install bundler`)

### Setup

```bash
# Install dependencies
bundle install

# Database setup
rails db:create
rails db:migrate
rails db:seed

# Start server
rails server -p 3001
```

### Environment Variables

Create a `.env` file (optional, defaults provided):

```bash
DATABASE_URL=postgresql://localhost/ruby_library_development
JWT_SECRET=your_jwt_secret_key
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📊 Database Schema

### Users Table

```ruby
create_table "users" do |t|
  t.string "name", null: false
  t.string "email", null: false, unique: true
  t.string "password_digest", null: false
  t.timestamps
end

add_index "users", ["email"], name: "index_users_on_email", unique: true
```

### Items Table (Books)

```ruby
create_table "items" do |t|
  t.string "title", null: false
  t.string "author_or_director"
  t.text "description"
  t.string "item_type", default: "book"
  t.string "status", default: "want_to_read"
  t.integer "rating"
  t.text "notes"
  t.string "cover_image_url"
  t.string "genre"
  t.integer "release_year"
  t.string "external_id"
  t.references "user", null: false, foreign_key: true
  t.timestamps
end

# Performance indexes
add_index "items", ["user_id", "status"]
add_index "items", ["user_id", "created_at"]
add_index "items", ["title"]
```

## 🛡️ Security Features

### JWT Authentication

```ruby
# JWT Service for secure token management
class JwtService
  SECRET = Rails.application.credentials.secret_key_base

  def self.encode(payload)
    JWT.encode(payload, SECRET, 'HS256')
  end

  def self.decode(token)
    JWT.decode(token, SECRET, true, { algorithm: 'HS256' })
  end
end
```

### CORS Configuration

```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:5173', 'localhost:3000'
    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

## 🎯 API Endpoints

### Authentication

```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Current user info
```

### Books Management

```
GET    /api/items          # List user's books (with filters)
POST   /api/items          # Create new book
GET    /api/items/:id      # Get specific book
PUT    /api/items/:id      # Update book
DELETE /api/items/:id      # Delete book
```

### Book Search

```
GET /api/search/books?q=query    # Search Open Library API
```

## 📈 Performance Optimizations

### Database Indexing

Strategic indexes for optimal query performance:

- `user_id` + `status` for filtered book lists
- `user_id` + `created_at` for recent books
- `title` for search functionality

### Query Optimization

```ruby
# Efficient querying with includes
def index
  @items = current_user.items
    .includes(:user)
    .where(status: params[:status])
    .order(created_at: :desc)
    .limit(params[:limit] || 50)
end
```

### Caching Strategy

```ruby
# Cache frequently accessed data
def dashboard_stats
  Rails.cache.fetch("user_#{current_user.id}_stats", expires_in: 1.hour) do
    calculate_user_statistics
  end
end
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
rails test

# Run specific test files
rails test test/models/user_test.rb
rails test test/controllers/api/items_controller_test.rb

# Run with coverage
rails test --verbose
```

### Test Structure

```
test/
├── controllers/
│   └── api/
│       ├── auth_controller_test.rb
│       ├── items_controller_test.rb
│       └── search_controller_test.rb
├── models/
│   ├── user_test.rb
│   └── item_test.rb
└── fixtures/
    ├── users.yml
    └── items.yml
```

## 🔍 Debugging & Development

### Rails Console

```bash
# Access Rails console
rails console

# Common debugging commands
User.count
Item.where(status: 'completed').count
Rails.cache.stats
```

### Logging

```ruby
# Application logs in log/development.log
Rails.logger.info "Processing book creation for user #{user.id}"
Rails.logger.debug "SQL Query: #{query}"
```

## 📚 Educational Features

### Rails Processing Visualization

The backend includes special debug endpoints that provide insights into:

- **Request Lifecycle**: Route resolution → Controller → Model → Response
- **Database Operations**: SQL queries with timing information
- **Active Record**: ORM operations and optimizations
- **Performance Metrics**: Response times and bottlenecks

### Learning Opportunities

This backend demonstrates:

- **API-first Design**: Clean separation of concerns
- **RESTful Architecture**: Standard HTTP methods and status codes
- **Security Best Practices**: JWT, password hashing, input validation
- **Database Design**: Proper indexing and relationships
- **Error Handling**: Comprehensive error responses
- **Code Organization**: Rails conventions and patterns

## 🚀 Deployment

### Production Setup

```bash
# Environment setup
export RAILS_ENV=production
export DATABASE_URL=postgresql://user:pass@host:port/db
export JWT_SECRET=your_production_secret

# Database setup
rails db:create
rails db:migrate

# Precompile assets (if any)
rails assets:precompile

# Start server
rails server -p 3001
```

### Docker Support

```dockerfile
FROM ruby:3.4
WORKDIR /app
COPY Gemfile* ./
RUN bundle install
COPY . .
EXPOSE 3001
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3001"]
```

## 🤝 Contributing

### Development Guidelines

- Follow Rails conventions and best practices
- Write tests for new features
- Use proper commit messages
- Update documentation as needed

### Code Style

- Use RuboCop for style enforcement
- Follow Rails naming conventions
- Keep controllers thin, models fat
- Use services for complex business logic

---

**Part of the Ruby Library full-stack application**

[← Back to Main README](../README.md) • [Frontend README →](../wishlist_frontend/README.md)
