class Workout < ActiveRecord::Base
  
  belongs_to :user
  belongs_to :workout_type
  has_many :custom_fields
  has_many :custom_field_types, :through => :custom_fields
  
  attr_accessor :vdot, :month, :type, :custom_field, :pace, :speed, :metric
  
  
  def vdot
    if (!self.distance.nil? && !self.duration.nil?)     
      duration = self.duration/60
      distance = self.distance * 1609.3
      speed = distance/duration
      
      
      percent_max = 0.8 + 0.1894393 * 
      Math.exp(-0.012778 * duration) + 0.2989558 * 
      Math.exp(-0.1932605 * duration)
      
      vo2 = -4.6 + 0.182258 * speed + 
      0.000104 * speed**2
      
      vdot = vo2 / percent_max
      
      if (vdot > 60 && vdot < 40.5)
        puts "self.duration #{self.duration}"
        puts "self.distance #{self.distance}"
        puts "duration #{duration}"
        puts "distance #{distance}"
        puts "percent_max #{percent_max}"
        puts "vo2 #{vo2}" 
        puts "vdot #{vo2 / percent_max}"
      end

      vdot
      
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
  
  def pace
    if (!self.distance.nil? && !self.duration.nil?)
      self.duration / self.distance
    end     
  end
  
  def speed
    if (!self.distance.nil? && !self.duration.nil?)
      3600 * self.distance / self.duration
    end  
    
  end
  
  def vdotoverhr
    if (!self.vdot.blank? && !self.avg_hr.nil?)
      100 * self.vdot / self.avg_hr
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
    :type => self.type,
    :metric => self.metric
  }

  end
  
  
end
