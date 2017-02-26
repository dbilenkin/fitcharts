class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  
  has_many :workouts, :dependent  => :delete_all
  
  def admin?
    self.admin == true
  end
  
  def custom_fields
    @custom_fields = Array.new
    self.workouts.each do |workout|
      if (!workout.custom_fields.blank?)
        workout.custom_fields.each do |custom_field|
          @custom_fields.push(custom_field)
        end        
      end     
    end
    @custom_fields
  end
end
