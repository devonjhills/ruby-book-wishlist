class Api::ItemsController < ApplicationController
  before_action :require_authentication
  before_action :set_item, only: [:show, :update, :destroy]
  
  def index
    items = current_user.items
    
    items = items.where(item_type: params[:type]) if params[:type].present?
    items = items.where(status: params[:status]) if params[:status].present?
    
    case params[:sort]
    when 'title'
      items = items.order(:title)
    when 'rating'
      items = items.order(rating: :desc)
    when 'created_at'
      items = items.order(created_at: :desc)
    else
      items = items.order(updated_at: :desc)
    end
    
    render json: items
  end
  
  def show
    render json: @item
  end
  
  def create
    # Check if book already exists for this user
    if item_params[:external_id].present?
      existing_item = current_user.items.find_by(external_id: item_params[:external_id])
      if existing_item
        return render_json_error('This book is already in your collection', :conflict)
      end
    end
    
    item = current_user.items.build(item_params)
    
    if item.save
      render json: item, status: :created
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
end