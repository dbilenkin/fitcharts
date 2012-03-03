class UsersController < ApplicationController
  
  before_filter :authenticate_user!
  #before_filter :verify_is_admin

  # GET /workouts
  # GET /workouts.json
  def index
    @users = User.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @users }
    end
  end
  
  private

  def verify_is_admin
    if (current_user.nil?) 
      logger.info "User is not logged in. redirecting..."
      redirect_to(root_path) 
    else
      logger.info "Current user admin? #{current_user.admin?}"
      redirect_to(root_path) unless current_user.admin?
    end
  end
  
end
