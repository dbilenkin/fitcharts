class CreateCustomFields < ActiveRecord::Migration
  def change
    create_table :custom_fields do |t|

      t.decimal :value
      t.integer :workout_id
      t.integer :custom_field_type_id
      
      t.timestamps
    end
  end
end
