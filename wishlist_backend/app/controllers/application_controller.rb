class ApplicationController < ActionController::API
  before_action :authenticate_request
  
  private
  
  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    
    if header
      decoded = JwtService.decode(header)
      @current_user = User.find(decoded[:user_id]) if decoded
    end
  end
  
  def current_user
    @current_user
  end
  
  def require_authentication
    render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user
  end
  
  def render_json_error(message, status = :unprocessable_entity)
    render json: { error: message }, status: status
  end
end
