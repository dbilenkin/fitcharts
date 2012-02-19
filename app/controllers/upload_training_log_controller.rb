class UploadTrainingLogController < ApplicationController
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
    Workout.delete_all
    
    xml_file = params[:upload_file][:uploaded_file].read
    doc = Hpricot.XML(xml_file)
    #puts "doc: #{doc}"
    (doc.search("//Event[@typeName='Run']")).each_with_index do |event, i|
      puts "Event: #{i}"
      
      workout = Workout.new
      
      datetime = Time.parse(event[:time])
      workout.date = datetime
      distance_element = (event/:Distance).first
      if (!distance_element.nil?)
        distance = distance_element.inner_html
        workout.distance = distance
      end
      
      duration_element = (event/:Duration).first
      if (!duration_element.nil?)
        duration = duration_element[:seconds]
        workout.duration = duration
      end
      
      workout.save

    end
    
    redirect_to workouts_path
  end
end
