class CreateWorkouts < ActiveRecord::Migration
  def change
    create_table :workouts do |t|
      t.date :date
      t.time :time
      t.decimal :duration
      t.decimal :distance
      t.integer :avg_hr
      t.integer :max_hr
      t.decimal :weight
      t.text :comments
      t.integer :user_id
      t.integer :workout_type_id
      
      t.timestamps
    end
  end
end
