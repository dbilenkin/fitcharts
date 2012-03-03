class GraphsController < ApplicationController
  
  before_filter :authenticate_user!
  
  def index
    @custom_field_names = current_user.custom_fields.collect {|x| x.name}.uniq
  end
end
