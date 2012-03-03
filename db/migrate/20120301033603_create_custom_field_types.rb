class CreateCustomFieldTypes < ActiveRecord::Migration
  def change
    create_table :custom_field_types do |t|
      t.string :name
      t.integer :workout_type_id
      t.timestamps
    end
  end
end
