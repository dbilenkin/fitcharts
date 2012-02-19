class CreateTrainingLogFiles < ActiveRecord::Migration
  def change
    create_table :training_log_files do |t|

      t.timestamps
    end
  end
end
