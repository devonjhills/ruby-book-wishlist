class Item < ApplicationRecord
  belongs_to :user
  
  enum :item_type, { book: 'book' }
  enum :status, { 
    want_to_read: 'want_to_read', 
    currently_reading: 'currently_reading', 
    completed: 'completed'
  }
  
  validates :title, presence: true
  validates :item_type, presence: true
  validates :status, presence: true
  validates :rating, inclusion: { in: 1..5 }, allow_nil: true
  
  scope :books, -> { where(item_type: 'book') }
  scope :by_status, ->(status) { where(status: status) }
end
