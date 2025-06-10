# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Create sample user
user = User.find_or_create_by!(email: 'demo@example.com') do |u|
  u.name = 'Demo User'
  u.password = 'password123'
end

# Create sample books
book_samples = [
  {
    title: 'The Great Gatsby',
    item_type: 'book',
    status: 'want_to_read',
    author_or_director: 'F. Scott Fitzgerald',
    genre: 'Classic Literature',
    release_year: 1925
  },
  {
    title: 'To Kill a Mockingbird',
    item_type: 'book',
    status: 'completed',
    rating: 5,
    author_or_director: 'Harper Lee',
    genre: 'Fiction',
    release_year: 1960,
    notes: 'Amazing book about justice and moral growth'
  }
]

# Create items for the user
book_samples.each do |item_data|
  user.items.find_or_create_by!(title: item_data[:title]) do |item|
    item.assign_attributes(item_data)
  end
end

puts "Seeded #{User.count} users and #{Item.count} items"
