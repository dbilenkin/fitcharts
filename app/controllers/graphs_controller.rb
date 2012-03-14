class GraphsController < ApplicationController
  
  before_filter :authenticate_user!
  
  def index
    if (params[:userId])
      user = User.find(params[:userId])
    else
      user = current_user
    end
    @custom_field_names = user.custom_fields.collect {|x| x.name}.uniq
  end
end
