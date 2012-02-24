class UploadTrainingLogController < ApplicationController
  
  before_filter :authenticate_user!
  
  require 'hpricot'
  require 'fileutils'
  # GET upload_training_log
  def index
    respond_to do |format|
      format.html # index.html.erb
    end
  end
  
  def upload_file
    
    #delete everything first
    current_user.workouts.delete_all
    
    xml_file = params[:upload_file][:uploaded_file].read
    doc = Hpricot.XML(xml_file)
    #puts "doc: #{doc}"
    (doc.search("//Event[@typeName='Run']")).each_with_index do |event, i|
      puts "Event: #{i}"
      
      workout = current_user.workouts.create
      workout.workout_type_id = WorkoutType.find_or_create_by_name(event[:typeName]).id

      datetime = Time.parse(event[:time])
      workout.date = datetime
      workout.time = datetime
      distance_element = (event/:Distance).first
      if (!distance_element.nil?)
        if (distance_element[:unit] == "km")
          distance = distance_element.inner_html.to_f/1.609
        elsif (distance_element[:unit] == "yd")
          distance = distance_element.inner_html.to_f/1760
        elsif (distance_element[:unit] == "m")
          distance = distance_element.inner_html.to_f/1609
        else
          distance = distance_element.inner_html
        end
        
        workout.distance = distance
      end
      
      duration_element = (event/:Duration).first
      if (!duration_element.nil?)
        duration = duration_element[:seconds]
        workout.duration = duration
      end
      
      weight_element = (event/:Weight).first
      if (!weight_element.nil?)
        weight = weight_element.inner_html
        workout.weight = weight
      end
      
      notes_element = (event/:Notes).first
      if (!notes_element.nil?)
        notes = notes_element.inner_html
        workout.comments = notes
      end
      
      hr_element = (event/:HeartRate).first
      if (!hr_element.nil?)
        avg_hr_element = (hr_element/:AvgHR).first
        if (!avg_hr_element.nil?)
          workout.avg_hr = avg_hr_element.inner_html
        end
        max_hr_element = (hr_element/:MaxHR).first
        if (!max_hr_element.nil?)
          workout.max_hr = max_hr_element.inner_html
        end

      end

      workout.save

    end
    
    redirect_to workouts_path
  end
end
