class WorkoutsController < ApplicationController
  
  before_filter :authenticate_user!
  # GET /workouts
  # GET /workouts.json
  def index
    @workouts = current_user.workouts(:include => :custom_fields)
    @custom_fields = current_user.custom_fields

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @workouts }
    end
  end
  
  def graph
    @workouts = Workout.find(:all, :conditions => {:date => Date.today.prev_month..Date.today})
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @workouts }
    end
  end
  
  def by_date_range
    start_month = Date.today.months_ago(params[:startMonth].to_i).beginning_of_month
    end_month = Date.today.months_ago(params[:endMonth].to_i).end_of_month
    date_range = start_month..end_month
    @workouts = current_user.workouts.where(:date => date_range).order('date asc')
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @workouts }
    end
  end
  
  def group_by
    if (params[:userId])
      user = User.find(params[:userId])
    else
      user = current_user
    end

    start_month = Date.today.months_ago(params[:startMonth].to_i).beginning_of_month
    end_month = Date.today.months_ago(params[:endMonth].to_i).end_of_month
    date_range = start_month..end_month
    
    if (params[:metric]).starts_with?("custom_")
      custom_field = params[:metric]
      custom_field.slice!(0..6)
      workouts = user.workouts.
        includes([:workout_type, :custom_fields, :custom_field_types]).
        where('date BETWEEN ? AND ? AND custom_field_types.name = ?', 
        start_month, end_month, custom_field).order('date asc')
      
      metric = "custom_field"
      workouts.each{|x| x.custom_field = x.custom_fields[0].value}
    else
      workouts = user.workouts.select([params[:metric], :date, 'workout_types.name']).includes(:workout_type).
        where(:date => date_range).order('date asc')
      metric = params[:metric]
    end

    workouts.reject!{|x| x.workout_type.name != params[:type]}
    
    puts "workout: #{workouts[0]}"
    puts "workout custom field: #{workouts[0].custom_field}"
    
    workout_groups = workouts.group_by { |t| t.date.send("beginning_of_" + params[:group_by]) }
    
    
    @grouped_workouts = Array.new
    
    workout_groups.each do |group, records|

      workout = Workout.new
      #workout.month = records[0].date.strftime('%B, %Y')
      workout.date = group      
      workout.type = records[0].workout_type.name
      
      metric_total = 0.0
      num_metric_records = 0
      records.each do |record|
        if (!record.send(metric).blank?)
          metric_total+=record.send(metric)
          #puts "metric_total #{metric_total}"
          num_metric_records+=1
        end  
      end
      
      #puts "group #{group}"
      #puts "num_metric_records #{num_metric_records}"
      if (params[:aggregate] == "sum")
        workout.metric = metric_total
      elsif (params[:aggregate] == "avg")
        workout.metric = num_metric_records == 0 ? nil : metric_total/num_metric_records
      elsif (params[:aggregate] == "max")
        workout.metric = records.reject{|x| x.send(metric).nil?}.collect{|r| r.send(metric)}.max
      elsif (params[:aggregate] == "min")
        workout.metric = records.reject{|x| x.send(metric).nil?}.collect{|r| r.send(metric)}.min
      end

      @grouped_workouts.push(workout) 
      
    end
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @grouped_workouts }
    end
    
  end
  
  def old_group_by
    
    if (params[:userId])
      user = User.find(params[:userId])
    else
      user = current_user
    end
    
    start_month = Date.today.months_ago(params[:startMonth].to_i).beginning_of_month
    end_month = Date.today.months_ago(params[:endMonth].to_i).end_of_month
    date_range = start_month..end_month
    workouts = user.workouts.includes(:workout_type).where(:date => date_range).order('date asc')
    
    workouts.reject!{|x| x.workout_type.name != params[:type]}
    
    if (params[:group_by] == "year")
      workout_groups = workouts.group_by { |t| t.date.beginning_of_year }
    elsif (params[:group_by] == "month")
      workout_groups = workouts.group_by { |t| t.date.beginning_of_month }
    elsif (params[:group_by] == "week")
      workout_groups = workouts.group_by { |t| t.date.beginning_of_week }
    elsif (params[:group_by] == "day")
      workout_groups = workouts.group_by { |t| t.date.beginning_of_day }
    end
    
    
    @grouped_workouts = Array.new
    
    workout_groups.each do |group, records|
      workout = Workout.new
      #workout.month = records[0].date.strftime('%B, %Y')
      workout.date = group
      
      workout.type = records[0].workout_type.name
      
      puts "group #{group}"
      puts "record #{records[0].date.strftime('%B, %Y')}"
      
      workout.distance = records.reject{|x| x.distance.nil?}.collect(&:distance).sum
      workout.duration = records.reject{|x| x.duration.nil?}.collect(&:duration).sum
      workout.avg_vdot = records.reject{|x| x.vdot.nil?}.collect(&:vdot).sum.to_f/records.size
      
      #custom fields
      custom_field_total = 0.0
      avg_hr_total = 0.0
      distance_total = 0.0
      duration_total = 0.0
      weight_total = 0.0
      num_custom_field_records = 0
      num_hr_records = 0
      num_weight_records = 0
      
      custom_field_hash = Hash.new
      records.each do |record|
        if (!record.custom_field.nil?)
          custom_field_total+=record.custom_field
          num_custom_field_records+=1
        end  
        
        if (!record.avg_hr.nil?)
          avg_hr_total += record.avg_hr
          num_hr_records+=1
        end
        
        if (!record.weight.nil?)
          weight_total += record.weight
          num_weight_records+=1
        end
        
        if (!record.distance.blank? && !record.duration.blank?)
          distance_total+=record.distance
          duration_total+=record.duration
        end
      end
      
      
      workout.avg_custom_field = num_custom_field_records == 0 ? nil : custom_field_total/num_custom_field_records         
      workout.avg_hr = avg_hr_total / num_hr_records
      workout.weight = weight_total / num_weight_records
      
      if (distance_total == 0 || duration_total == 0)
        workout.pace = nil
        workout.speed = nil
      else
        workout.pace = duration_total / distance_total
        workout.speed = 3600 * distance_total / duration_total
      end
      
      
      @grouped_workouts.push(workout) 
      
    end
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @grouped_workouts }
    end
  end

  # GET /workouts/1
  # GET /workouts/1.json
  def show
    @workout = Workout.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @workout }
    end
  end

  # GET /workouts/new
  # GET /workouts/new.json
  def new
    @workout = Workout.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @workout }
    end
  end

  # GET /workouts/1/edit
  def edit
    @workout = Workout.find(params[:id])
  end

  # POST /workouts
  # POST /workouts.json
  def create
    @workout = Workout.new(params[:workout])

    respond_to do |format|
      if @workout.save
        format.html { redirect_to @workout, notice: 'Workout was successfully created.' }
        format.json { render json: @workout, status: :created, location: @workout }
      else
        format.html { render action: "new" }
        format.json { render json: @workout.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /workouts/1
  # PUT /workouts/1.json
  def update
    @workout = Workout.find(params[:id])

    respond_to do |format|
      if @workout.update_attributes(params[:workout])
        format.html { redirect_to @workout, notice: 'Workout was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @workout.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /workouts/1
  # DELETE /workouts/1.json
  def destroy
    @workout = Workout.find(params[:id])
    @workout.destroy

    respond_to do |format|
      format.html { redirect_to workouts_url }
      format.json { head :no_content }
    end
  end
end
