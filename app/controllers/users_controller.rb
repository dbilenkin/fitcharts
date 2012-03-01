class UsersController < ApplicationController
  
  before_filter :authenticate_user!
  before_filter :verify_is_admin

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
    (current_user.nil?) ? redirect_to(root_path) : (redirect_to(root_path) unless current_user.admin?)
  end
  
end
