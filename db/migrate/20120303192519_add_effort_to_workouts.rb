class AddEffortToWorkouts < ActiveRecord::Migration
  def change
    add_column :workouts, :effort, :integer
    add_column :workouts, :temperature, :decimal
    add_column :workouts, :rest_hr, :integer
    add_column :workouts, :weather, :string
    add_column :workouts, :quality, :integer
    add_column :workouts, :sub_type_id, :integer
  end
end
