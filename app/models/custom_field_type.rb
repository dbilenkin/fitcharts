class CustomFieldType < ActiveRecord::Base
  has_many :custom_fields
  belongs_to :workout_type
end
