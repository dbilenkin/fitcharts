class CustomField < ActiveRecord::Base
  belongs_to :custom_field_type
  belongs_to :workout
  
  def name
    self.custom_field_type.name
  end
  
  def as_json(options={}) {
    :name => self.name,
    :value => self.value   
  }
  end
end
