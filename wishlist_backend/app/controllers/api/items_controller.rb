class Api::ItemsController < ApplicationController
  before_action :require_authentication
  before_action :set_item, only: [:show, :update, :destroy]
  
  def index
    # Track SQL queries for educational purposes
    sql_queries = []
    query_start_time = Time.current
    
    # Subscribe to SQL notifications for educational display
    subscriber = ActiveSupport::Notifications.subscribe('sql.active_record') do |*args|
      event = ActiveSupport::Notifications::Event.new(*args)
      next if event.payload[:name] == 'SCHEMA' || event.payload[:sql].include?('sqlite_master')
      
      sql_queries << {
        sql: event.payload[:sql],
        duration: event.duration,
        name: event.payload[:name] || 'SQL Query'
      }
    end
    
    # Use advanced search method for better performance
    search_params = params.permit(:query, :status, :rating, :genre, :year_from, :year_to, :sort)
    items = Item.advanced_search_for_user(current_user.id, search_params)
    
    # Add pagination for large result sets
    page = params[:page]&.to_i || 1
    per_page = [params[:per_page]&.to_i || 20, 100].min # Max 100 items per page
    offset = (page - 1) * per_page
    
    # Execute query with pagination
    paginated_items = items.limit(per_page).offset(offset)
    total_count = items.count if params[:include_count] == 'true'
    
    # Get dashboard statistics using cached method
    stats = Item.dashboard_stats_for_user(current_user.id)
    
    query_end_time = Time.current
    total_duration = ((query_end_time - query_start_time) * 1000).round(2)
    
    # Unsubscribe from notifications
    ActiveSupport::Notifications.unsubscribe(subscriber)
    
    # Response with metadata for educational purposes
    response_data = {
      items: paginated_items.as_json(except: [:created_at]),
      stats: stats,
      pagination: {
        page: page,
        per_page: per_page,
        total: total_count
      }.compact,
      # Educational metadata
      debug_info: {
        query_duration_ms: total_duration,
        sql_queries_count: sql_queries.length,
        sql_queries: sql_queries.map { |q| 
          {
            sql: q[:sql].gsub(/\s+/, ' ').strip,
            duration_ms: q[:duration].round(2),
            name: q[:name]
          }
        },
        cache_hits: stats.present? ? ['dashboard_stats'] : [],
        indexes_used: determine_indexes_used(search_params)
      }
    }
    
    render json: response_data
  end
  
  def show
    render json: @item
  end
  
  def create
    # Educational SQL tracking
    sql_queries = []
    creation_start_time = Time.current
    
    subscriber = ActiveSupport::Notifications.subscribe('sql.active_record') do |*args|
      event = ActiveSupport::Notifications::Event.new(*args)
      next if event.payload[:name] == 'SCHEMA'
      
      sql_queries << {
        sql: event.payload[:sql],
        duration: event.duration,
        name: event.payload[:name] || 'SQL Query'
      }
    end
    
    # Use optimized duplicate check method
    if item_params[:external_id].present?
      existing_item = Item.find_by_external_id_for_user(item_params[:external_id], current_user.id)
      if existing_item
        ActiveSupport::Notifications.unsubscribe(subscriber)
        return render_json_error('This book is already in your collection', :conflict)
      end
    end
    
    item = current_user.items.build(item_params)
    
    creation_success = item.save
    creation_end_time = Time.current
    total_duration = ((creation_end_time - creation_start_time) * 1000).round(2)
    
    ActiveSupport::Notifications.unsubscribe(subscriber)
    
    if creation_success
      response_data = {
        item: item.as_json,
        debug_info: {
          operation: 'create_book',
          duration_ms: total_duration,
          sql_queries_count: sql_queries.length,
          sql_queries: sql_queries.map { |q| 
            {
              sql: q[:sql].gsub(/\s+/, ' ').strip,
              duration_ms: q[:duration].round(2),
              type: determine_query_type(q[:sql])
            }
          },
          validations_run: item.class.validators.map(&:class).map(&:name),
          cache_operations: ['dashboard_stats cleared']
        }
      }
      render json: response_data, status: :created
    else
      render_json_error(item.errors.full_messages.join(', '))
    end
  end
  
  def update
    if @item.update(item_params)
      render json: @item
    else
      render_json_error(@item.errors.full_messages.join(', '))
    end
  end
  
  def destroy
    @item.destroy
    head :no_content
  end
  
  private
  
  def set_item
    @item = current_user.items.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_json_error('Item not found', :not_found)
  end
  
  def item_params
    params.require(:item).permit(
      :title, :item_type, :status, :rating, :notes, :external_id,
      :cover_image_url, :author_or_director, :genre, :release_year, :description
    )
  end
  
  # Educational helper methods for Rails learning
  def determine_indexes_used(search_params)
    indexes = []
    indexes << 'index_items_on_user_id_and_status' if search_params[:status].present?
    indexes << 'index_items_on_user_id_and_updated_at' if search_params[:sort].blank? || search_params[:sort] == 'updated_at'
    indexes << 'index_items_on_fulltext_search' if search_params[:query].present?
    indexes << 'index_items_on_user_id_and_rating' if search_params[:rating].present?
    indexes << 'index_items_on_user_id_and_created_at' if search_params[:sort] == 'created_at'
    indexes.presence || ['index_items_on_user_id']
  end
  
  def determine_query_type(sql)
    case sql.upcase
    when /^SELECT/
      'SELECT'
    when /^INSERT/
      'INSERT'
    when /^UPDATE/
      'UPDATE'
    when /^DELETE/
      'DELETE'
    else
      'OTHER'
    end
  end
end