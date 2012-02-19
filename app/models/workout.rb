class Workout < ActiveRecord::Base
  def pace
    self.duration / self.distance 
  end
  
  def vdot
    self.pace * self.duration
    
    duration = self.duration/60
    distance = self.distance * 1609.3
    speed = distance/duration
    
    percent_max = 0.8 + 0.1894393 * 
    Math.exp(-0.012778 * duration) + 0.2989558 * 
    Math.exp(-0.1932605 * duration * 1440)
    
    vo2 = -4.6 + 0.182258 * speed + 
    0.000104 * speed**2
    
    vdot = vo2 / percent_max
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
    self.time_formatted(self.pace)
  end
  
  def duration_formatted
    self.time_formatted(self.duration) 
  end
  
  def as_json(options={})
    super(:only => [:date, :distance], :methods =>[:pace])
    #super(:only => [:date, :distance], :methods =>[:pace_formatted, :duration_formatted, :vdot])
  end
  
  
end
