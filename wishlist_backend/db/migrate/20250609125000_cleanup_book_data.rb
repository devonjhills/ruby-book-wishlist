class CleanupBookData < ActiveRecord::Migration[8.0]
  def up
    # Remove any movie items
    execute "DELETE FROM items WHERE item_type = 'movie'"
    
    # Fix any invalid book statuses
    execute "UPDATE items SET status = 'want_to_read' WHERE status IN ('want_to_watch', 'currently_watching', 'watched') OR status IS NULL"
    
    # Ensure all books have the correct item_type
    execute "UPDATE items SET item_type = 'book' WHERE item_type IS NULL OR item_type != 'book'"
  end
  
  def down
    # This migration is not reversible as it cleans up invalid data
    raise ActiveRecord::IrreversibleMigration
  end
end