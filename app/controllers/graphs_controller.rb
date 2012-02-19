class GraphsController < ApplicationController
  def workouts_by_date_range(from, to)
    @workouts = Workout.find(:all, :conditions => {:date => 2012-01-01..2012-02-15})
  end
end
