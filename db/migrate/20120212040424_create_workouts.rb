class CreateWorkouts < ActiveRecord::Migration
  def change
    create_table :workouts do |t|
      t.date :date
      t.integer :duration
      t.decimal :distance
      t.text :comments

      t.timestamps
    end
  end
end
