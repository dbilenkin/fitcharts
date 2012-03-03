class Workout < ActiveRecord::Base
  
  belongs_to :user
  belongs_to :workout_type
  has_many :custom_fields
  
  attr_accessor :avg_vdot, :month, :type, :avg_custom_field, :pace, :speed
  
  
  def vdot
    if (!self.distance.nil? && !self.duration.nil?)     
      duration = self.duration/60
      distance = self.distance * 1609.3
      speed = distance/duration
      
      percent_max = 0.8 + 0.1894393 * 
      Math.exp(-0.012778 * duration) + 0.2989558 * 
      Math.exp(-0.1932605 * duration * 1440)
      
      vo2 = -4.6 + 0.182258 * speed + 
      0.000104 * speed**2
      
      vdot = vo2 / percent_max
    else
      0
    end
  end
  
  def time_formatted(seconds)
    p = Time.mktime(0)+seconds
    if (seconds >= 3600)
      p.strftime("%k:%M:%S")
    else
      p.strftime("%_M:%S")
    end
    
    
  end
  
  def pace_formatted
    if (!self.pace.nil?)
      self.time_formatted(self.pace)
    end
  end
  
  def duration_formatted
    if (!self.duration.nil?)
      self.time_formatted(self.duration) 
    end
  end
  
  def custom_field
    if (self.custom_fields.empty?)
      logger.debug "custom field nil"
      nil
    else
      logger.debug "custom field value: #{self.custom_fields[0].value}"
      self.custom_fields[0].value.to_f
    end
  end
  
  def as_json(options={}) {
    :date => self.date,
    :distance => self.distance,
    :duration => self.duration,
    :avg_hr => self.avg_hr,
    :pace => self.pace,
    :speed => self.speed,
    :vdot => self.avg_vdot,
    :type => self.type,
    :custom_fields => self.custom_fields
  }

  end
  
  
end
