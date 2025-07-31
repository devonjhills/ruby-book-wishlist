class AddPerformanceIndexes < ActiveRecord::Migration[8.0]
  def change
    # Add composite index for common queries - user_id + status combination
    # This optimizes dashboard filtering by status for a specific user
    add_index :items, [:user_id, :status], name: 'index_items_on_user_id_and_status'
    
    # Add composite index for user_id + updated_at for dashboard ordering
    # This optimizes the common "recently updated items for user" query
    add_index :items, [:user_id, :updated_at], name: 'index_items_on_user_id_and_updated_at'
    
    # Add index for external_id to prevent duplicate book additions
    # This optimizes the duplicate check in items_controller.rb
    add_index :items, :external_id, name: 'index_items_on_external_id'
    
    # Add full-text search index for title and author fields
    # This enables better search performance for PostgreSQL
    # Using GIN index for full-text search capabilities
    add_index :items, "to_tsvector('english', coalesce(title, '') || ' ' || coalesce(author_or_director, ''))", 
              using: :gin, name: 'index_items_on_fulltext_search'
    
    # Add partial index for books with ratings (excludes NULL ratings)
    # This optimizes queries for rated books and statistics
    add_index :items, [:user_id, :rating], where: 'rating IS NOT NULL', 
              name: 'index_items_on_user_id_and_rating'
    
    # Add index for created_at to support timeline-based queries
    add_index :items, [:user_id, :created_at], name: 'index_items_on_user_id_and_created_at'
  end
end