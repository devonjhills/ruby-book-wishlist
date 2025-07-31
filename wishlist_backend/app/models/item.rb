class Item < ApplicationRecord
  belongs_to :user
  
  enum :item_type, { book: 'book' }
  enum :status, { 
    want_to_read: 'want_to_read', 
    currently_reading: 'currently_reading', 
    completed: 'completed'
  }
  
  validates :title, presence: true, length: { minimum: 1, maximum: 500 }
  validates :item_type, presence: true
  validates :status, presence: true
  validates :rating, inclusion: { in: 1..5 }, allow_nil: true
  validates :external_id, uniqueness: { scope: :user_id, message: 'book already exists in your collection' }, allow_nil: true
  validates :author_or_director, length: { maximum: 200 }, allow_nil: true
  validates :genre, length: { maximum: 100 }, allow_nil: true
  validates :notes, length: { maximum: 2000 }, allow_nil: true
  validates :description, length: { maximum: 5000 }, allow_nil: true
  validates :release_year, inclusion: { in: 1000..Date.current.year + 10 }, allow_nil: true
  
  # Optimized scopes using database indexes
  scope :books, -> { where(item_type: 'book') }
  scope :by_status, ->(status) { where(status: status) }
  scope :by_user_and_status, ->(user_id, status) { where(user_id: user_id, status: status) }
  scope :recently_updated, -> { order(updated_at: :desc) }
  scope :recently_created, -> { order(created_at: :desc) }
  scope :with_ratings, -> { where.not(rating: nil) }
  scope :by_rating, ->(rating) { where(rating: rating) }
  scope :search_text, ->(query) { 
    where("to_tsvector('english', coalesce(title, '') || ' ' || coalesce(author_or_director, '')) @@ plainto_tsquery('english', ?)", query)
  }
  
  # Cache key for efficient caching
  def cache_key_with_version
    "items/#{id}-#{updated_at.to_i}"
  end
  
  # Performance-optimized finder methods
  class << self
    def find_by_external_id_for_user(external_id, user_id)
      Rails.cache.fetch("item/external_id/#{external_id}/user/#{user_id}", expires_in: 5.minutes) do
        find_by(external_id: external_id, user_id: user_id)
      end
    end
    
    # Dashboard statistics with caching
    def dashboard_stats_for_user(user_id)
      Rails.cache.fetch("user/#{user_id}/dashboard_stats", expires_in: 1.hour) do
        base_scope = where(user_id: user_id)
        {
          total: base_scope.count,
          want_to_read: base_scope.want_to_read.count,
          currently_reading: base_scope.currently_reading.count,
          completed: base_scope.completed.count,
          avg_rating: base_scope.with_ratings.average(:rating)&.round(2),
          total_rated: base_scope.with_ratings.count
        }
      end
    end
    
    # Optimized search with full-text search
    def advanced_search_for_user(user_id, params = {})
      scope = where(user_id: user_id)
      
      # Full-text search using PostgreSQL's built-in capabilities
      if params[:query].present?
        scope = scope.search_text(params[:query])
      end
      
      # Filter by status
      scope = scope.by_status(params[:status]) if params[:status].present?
      
      # Filter by rating
      scope = scope.by_rating(params[:rating]) if params[:rating].present?
      
      # Filter by genre
      scope = scope.where('genre ILIKE ?', "%#{params[:genre]}%") if params[:genre].present?
      
      # Filter by year range
      if params[:year_from].present? || params[:year_to].present?
        year_from = params[:year_from]&.to_i || 0
        year_to = params[:year_to]&.to_i || Date.current.year
        scope = scope.where(release_year: year_from..year_to)
      end
      
      # Sorting with proper indexing
      case params[:sort]
      when 'title'
        scope = scope.order(:title)
      when 'author'  
        scope = scope.order(:author_or_director)
      when 'rating'
        scope = scope.order(rating: :desc, updated_at: :desc)
      when 'year'
        scope = scope.order(release_year: :desc, updated_at: :desc)
      when 'created_at'
        scope = scope.order(created_at: :desc)
      else
        scope = scope.recently_updated
      end
      
      scope
    end
  end
  
  # Callbacks to clear cache when needed
  after_save :clear_user_cache
  after_destroy :clear_user_cache
  
  private
  
  def clear_user_cache
    Rails.cache.delete("user/#{user_id}/dashboard_stats")
    Rails.cache.delete("item/external_id/#{external_id}/user/#{user_id}") if external_id.present?
  end
end
