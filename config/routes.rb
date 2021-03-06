Myapp::Application.routes.draw do
  resources :workout_types
 
  devise_for :users
  devise_for :users do get '/users/sign_out' => 'devise/sessions#destroy' end
    
  get "users" => "users#index"

  get "workouts/by_date_range/:months" => "workouts#by_date_range"
  get "charts/group_by/:group_by/:startMonth/:endMonth/:type/:metric/:aggregate" => "workouts#group_by"
  get ":userId/charts/group_by/:group_by/:startMonth/:endMonth/:type/:metric/:aggregate" => "workouts#group_by"
  resources :workouts
  resources :graphs
  get "charts" => "graphs#index"
  
  get ":userId/charts" => "graphs#index"
  get "upload_training_log" => "upload_training_log#index"
  post "upload_training_log" => "upload_training_log#upload_file"
  
  get "about" => "about#index"
  get "faq" => "faq#index"
  get "home/index"

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'home#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
