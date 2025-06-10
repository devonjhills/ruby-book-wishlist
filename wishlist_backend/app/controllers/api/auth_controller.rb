class Api::AuthController < ApplicationController
  skip_before_action :authenticate_request, only: [:register, :login]
  
  def register
    user = User.new(user_params)
    
    if user.save
      token = JwtService.encode(user_id: user.id)
      render json: { 
        token: token, 
        user: { id: user.id, name: user.name, email: user.email }
      }, status: :created
    else
      render_json_error(user.errors.full_messages.join(', '))
    end
  end
  
  def login
    user = User.find_by(email: params[:email]&.downcase)
    
    if user&.authenticate(params[:password])
      token = JwtService.encode(user_id: user.id)
      render json: { 
        token: token, 
        user: { id: user.id, name: user.name, email: user.email }
      }
    else
      render_json_error('Invalid email or password', :unauthorized)
    end
  end
  
  def me
    if current_user
      render json: { user: { id: current_user.id, name: current_user.name, email: current_user.email } }
    else
      render_json_error('Not authenticated', :unauthorized)
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end