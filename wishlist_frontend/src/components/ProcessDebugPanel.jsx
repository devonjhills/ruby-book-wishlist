import React, { useState, useEffect } from 'react';

const ProcessDebugPanel = ({ isVisible, operation, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState(new Set());
  
  const getOperationSteps = (operation) => {
    switch (operation) {
      case 'create_book':
        return [
          { 
            step: 'Route Resolution', 
            code: 'Rails.application.routes.recognize_path("/api/items", method: :post)', 
            description: 'Rails router matches POST /api/items to Api::ItemsController#create',
            details: 'The Rails router analyzes the HTTP method (POST) and URL path (/api/items) against all defined routes in config/routes.rb. It finds the matching route definition and determines which controller action should handle this request. This is the first step in the Rails request-response cycle.'
          },
          { 
            step: 'Middleware Stack', 
            code: 'ActionDispatch::MiddlewareStack.build { use Rack::Cors, ... }', 
            description: 'Request passes through Rails middleware stack including CORS, authentication, and logging',
            details: 'Rails processes the request through a series of middleware components in order: CORS handling for cross-origin requests, JWT authentication middleware to verify the user token, parameter logging filters to prevent sensitive data from being logged, and request ID generation for tracing.'
          },
          { 
            step: 'Controller Instantiation', 
            code: 'Api::ItemsController.new.dispatch(:create, request, response)', 
            description: 'Rails instantiates the controller and calls the create action',
            details: 'Rails creates a new instance of Api::ItemsController, sets up the request/response objects, and prepares to execute the create action. The controller inherits from ApplicationController, gaining access to authentication helpers and shared functionality.'
          },
          { 
            step: 'Before Actions', 
            code: 'before_action :require_authentication, :set_current_user', 
            description: 'Executes before_action callbacks for authentication and user context',
            details: 'Before the main action runs, Rails executes any before_action callbacks. Here it validates the JWT token from the Authorization header, decodes it to get the user ID, and sets @current_user for use in the action. If authentication fails, the request is rejected with a 401 status.'
          },
          { 
            step: 'Strong Parameters', 
            code: 'params.require(:item).permit(:title, :author_or_director, :status, :notes, :rating)', 
            description: 'Filters and validates request parameters using Rails strong parameters',
            details: 'Rails Strong Parameters prevent mass assignment vulnerabilities by explicitly whitelisting allowed parameters. Only the permitted fields can be used to create/update the model. Any other parameters in the request are filtered out for security.'
          },
          { 
            step: 'Model Building', 
            code: '@item = current_user.items.build(item_params)', 
            description: 'Creates new Item instance with user association using Active Record',
            details: 'Active Record builds a new Item object with the filtered parameters. Using current_user.items.build automatically sets the user_id foreign key, establishing the has_many/belongs_to relationship. The object exists in memory but is not yet saved to the database.'
          },
          { 
            step: 'Model Validation', 
            code: '@item.valid? # runs validates :title, presence: true, etc.', 
            description: 'Runs all Active Record validations defined in the Item model',
            details: 'Active Record validates the object against all validation rules: presence validations for required fields, format validations for data types, length validations for string fields, and custom business logic validations. If any validation fails, the save operation will be prevented.'
          },
          { 
            step: 'Database Transaction', 
            code: 'ActiveRecord::Base.transaction { @item.save! }', 
            description: 'Wraps database operations in a transaction for data integrity',
            details: 'Rails wraps the save operation in a database transaction to ensure data consistency. If any part of the save process fails (constraints, triggers, etc.), the entire transaction is rolled back, leaving the database in its original state.'
          },
          { 
            step: 'SQL Generation', 
            code: 'INSERT INTO items (title, author_or_director, item_type, status, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            description: 'Active Record generates optimized SQL INSERT statement',
            details: 'Active Record converts the Ruby object into a SQL INSERT statement, handling data type conversion, escaping values to prevent SQL injection, and automatically setting timestamp fields (created_at, updated_at). Rails uses prepared statements for security and performance.',
            advanced: {
              concepts: ['Prepared Statements', 'SQL Injection Prevention', 'Data Type Conversion', 'Timestamp Automation'],
              codeExample: `# Ruby code:
@item = current_user.items.build(title: "The Great Gatsby", status: "want_to_read")
@item.save

# Generated SQL (with parameter binding):
INSERT INTO "items" 
  ("title", "author_or_director", "item_type", "status", "user_id", "created_at", "updated_at") 
VALUES 
  ($1, $2, $3, $4, $5, $6, $7)
  
# Parameters: ["The Great Gatsby", nil, "book", "want_to_read", 1, "2025-07-31 12:00:00", "2025-07-31 12:00:00"]`,
              tips: [
                'Rails automatically prevents SQL injection by using parameterized queries',
                'created_at and updated_at timestamps are managed automatically',
                'Active Record handles proper data type conversion (String to VARCHAR, Integer to BIGINT, etc.)',
                'Database constraints and validations work together for data integrity'
              ]
            }
          },
          { 
            step: 'Database Execution', 
            code: 'PG::Connection.exec_params(sql, values)', 
            description: 'PostgreSQL executes the INSERT and returns the new record ID',
            details: 'The SQL statement is sent to PostgreSQL via prepared statements for security and performance. PostgreSQL validates constraints, executes the insert, assigns a new primary key ID, and returns the newly created record data back to Rails.'
          },
          { 
            step: 'Model Callbacks', 
            code: 'after_create :update_search_index, :send_notifications', 
            description: 'Executes any after_create callbacks defined on the model',
            details: 'After successful database insertion, Rails runs any after_create callbacks. These might include updating search indexes, sending notification emails, logging audit trails, or triggering background jobs for additional processing.'
          },
          { 
            step: 'JSON Serialization', 
            code: 'render json: @item.as_json(include: [:user], except: [:created_at]), status: :created', 
            description: 'Converts Active Record object to JSON and sends HTTP 201 response',
            details: 'Rails serializes the Item object to JSON format, including specified associations and excluding sensitive fields. It sets the HTTP status to 201 (Created), adds appropriate headers, and sends the response back to the client. The Location header may include the URL of the newly created resource.'
          }
        ];
      case 'search_books':
        return [
          { 
            step: 'Route Resolution', 
            code: 'get "search/books", to: "api/search#books"', 
            description: 'Rails router maps GET /api/search/books to SearchController#books',
            details: 'The Rails router matches the GET request to /api/search/books against the routes defined in config/routes.rb. It identifies this as a search endpoint and routes it to the Api::SearchController#books action.'
          },
          { 
            step: 'Authentication Middleware', 
            code: 'before_action :require_authentication', 
            description: 'JWT token validation ensures only authenticated users can search',
            details: 'The before_action callback verifies the JWT token in the Authorization header. It decodes the token, validates its signature and expiration, and sets the current_user context. This prevents unauthorized access to the search functionality.'
          },
          { 
            step: 'Parameter Validation', 
            code: 'query = params[:q]&.strip; return render_json_error("Query required") if query.blank?', 
            description: 'Validates that a search query was provided and is not empty',
            details: 'Rails validates the query parameter (:q) is present and contains meaningful content. Empty queries are rejected with a 400 Bad Request response to prevent unnecessary API calls to external services.'
          },
          { 
            step: 'External API Request', 
            code: 'response = HTTParty.get("https://openlibrary.org/search.json", query: { q: query, limit: 20 })', 
            description: 'Makes HTTP GET request to Open Library API with search parameters',
            details: 'Rails uses HTTParty gem to make a secure HTTPS request to the Open Library API. The request includes the user\'s search query and limits results to 20 items for performance. HTTParty handles JSON parsing and error handling automatically.'
          },
          { 
            step: 'API Response Processing', 
            code: 'books_data = response.parsed_response["docs"] || []', 
            description: 'Extracts book data from the Open Library API response',
            details: 'Rails processes the JSON response from Open Library, extracting the "docs" array which contains the search results. Error handling ensures the application continues to function even if the external API returns unexpected data structures.'
          },
          { 
            step: 'Data Transformation', 
            code: 'books = books_data.map { |book| transform_book_data(book) }', 
            description: 'Transforms external API data into our application\'s data structure',
            details: 'Rails maps each book from the Open Library format to our internal format, extracting fields like title, author, ISBN, cover image IDs, and work keys. This abstraction layer protects our application from changes in the external API structure.'
          },
          { 
            step: 'Detailed Info Lookup', 
            code: 'work_data = HTTParty.get("https://openlibrary.org#{work_key}.json")', 
            description: 'Fetches additional book details including descriptions from Open Library Works API',
            details: 'For each book, Rails makes additional API calls to fetch detailed information from the Open Library Works API. This includes book descriptions, subject classifications, and extended metadata not available in the search results.'
          },
          { 
            step: 'Result Aggregation', 
            code: 'results = books.compact.uniq { |book| book[:external_id] }', 
            description: 'Combines search results with detailed info, removing duplicates',
            details: 'Rails aggregates the search results with the detailed information, removes any nil entries from failed API calls, and eliminates duplicate books based on their external_id to ensure clean, unique results.'
          },
          { 
            step: 'JSON Response', 
            code: 'render json: { results: results, query: query, total: results.size }', 
            description: 'Returns formatted search results as JSON with metadata',
            details: 'Rails serializes the processed book data to JSON format, including the original search query and result count for the frontend. The response follows REST API conventions with consistent structure and proper HTTP status codes.'
          }
        ];
      case 'update_book':
        return [
          { 
            step: 'Route Resolution', 
            code: 'patch "/api/items/:id", to: "api/items#update"', 
            description: 'RESTful routing maps PATCH request to ItemsController#update',
            details: 'Rails router identifies this as a RESTful update operation using the PATCH HTTP method with a resource ID parameter. The :id parameter is extracted from the URL path and made available in the params hash for the controller action.'
          },
          { 
            step: 'Authentication & Authorization', 
            code: 'before_action :require_authentication; current_user.items.find(params[:id])', 
            description: 'Validates user authentication and ownership of the resource',
            details: 'Rails first validates the JWT token, then uses current_user.items.find() to both locate the item and ensure the authenticated user owns it. This prevents users from updating other users\' items, implementing proper authorization at the database level.'
          },
          { 
            step: 'Resource Loading', 
            code: '@item = current_user.items.find(params[:id])', 
            description: 'Loads the specific item with automatic ownership validation',
            details: 'Active Record uses the association to automatically add a WHERE clause filtering by user_id. If the item doesn\'t exist or belongs to another user, a RecordNotFound exception is raised, returning a 404 error.'
          },
          { 
            step: 'Strong Parameters', 
            code: 'item_params = params.require(:item).permit(:title, :status, :notes, :rating, :author_or_director)', 
            description: 'Filters incoming parameters to prevent mass assignment vulnerabilities',
            details: 'Rails Strong Parameters create a secure parameter hash containing only explicitly permitted fields. This prevents malicious users from updating fields like user_id, id, or other protected attributes through parameter injection attacks.'
          },
          { 
            step: 'Optimistic Locking Check', 
            code: '@item.lock_version == params[:lock_version] || raise StaleObjectError', 
            description: 'Prevents concurrent update conflicts using version-based locking',
            details: 'Rails checks if the record has been modified by another request since it was loaded. The lock_version field is incremented on each update, preventing lost updates when multiple users edit the same record simultaneously.'
          },
          { 
            step: 'Model Validation', 
            code: '@item.assign_attributes(item_params); @item.valid?', 
            description: 'Assigns new attributes and validates against model constraints',
            details: 'Active Record assigns the new attribute values and runs all validations defined in the Item model. This includes presence validations, format checks, length constraints, and any custom validation logic. Invalid data is rejected before database interaction.'
          },
          { 
            step: 'Database Transaction', 
            code: 'ActiveRecord::Base.transaction { @item.save! }', 
            description: 'Wraps the update in a database transaction for consistency',
            details: 'Rails begins a database transaction to ensure atomicity. If the update succeeds, the transaction commits. If any error occurs (validations, constraints, triggers), the entire transaction rolls back, maintaining database integrity.'
          },
          { 
            step: 'SQL Update Generation', 
            code: 'UPDATE items SET title = ?, status = ?, updated_at = ?, lock_version = ? WHERE id = ? AND lock_version = ?', 
            description: 'Generates optimized SQL UPDATE with optimistic locking',
            details: 'Active Record generates a SQL UPDATE statement with parameterized values for security. The WHERE clause includes both the item ID and current lock_version to ensure the record hasn\'t changed since loading. The lock_version is automatically incremented.'
          },
          { 
            step: 'Model Callbacks', 
            code: 'after_update :log_changes, :update_search_index', 
            description: 'Executes after_update callbacks for additional processing',
            details: 'After successful database update, Rails runs any after_update callbacks defined on the model. These might include audit logging, cache invalidation, search index updates, or triggering background jobs for derived data updates.'
          },
          { 
            step: 'JSON Response', 
            code: 'render json: @item.reload, status: :ok', 
            description: 'Returns the updated item as JSON with fresh database values',
            details: 'Rails reloads the object from the database to ensure it contains any values modified by database triggers or callbacks, then serializes it to JSON. The HTTP 200 status indicates successful update completion.'
          }
        ];
      case 'load_dashboard':
        return [
          { 
            step: 'Route Resolution', 
            code: 'get "/api/items", to: "api/items#index"', 
            description: 'Rails router maps GET request to ItemsController#index for dashboard data',
            details: 'The Rails router identifies this as a RESTful index action for the items resource. This follows REST conventions where GET /api/items retrieves a collection of items for the authenticated user.'
          },
          { 
            step: 'Authentication Middleware', 
            code: 'before_action :require_authentication, :set_current_user', 
            description: 'Validates JWT token and establishes user context for authorization',
            details: 'Rails middleware validates the JWT token from the Authorization header, decodes the user ID, and loads the current_user object. This ensures only authenticated users can access their dashboard data.'
          },
          { 
            step: 'Base Query Building', 
            code: 'items = current_user.items', 
            description: 'Creates Active Record relation scoped to the current user\'s items',
            details: 'Active Record builds a lazy-loaded query starting with the user association. This automatically adds a WHERE user_id = ? clause to ensure users only see their own items, providing built-in authorization at the database level.'
          },
          { 
            step: 'Dynamic Filtering', 
            code: 'items = items.where(status: params[:status]) if params[:status].present?', 
            description: 'Applies conditional filtering based on query parameters',
            details: 'Rails dynamically builds the WHERE clause based on optional query parameters. If a status filter is provided (want_to_read, currently_reading, completed), it\'s added to the query. The conditional ensures invalid or empty parameters don\'t affect the query.'
          },
          { 
            step: 'Search Filtering', 
            code: 'items = items.where("title ILIKE ? OR author_or_director ILIKE ?", "%#{query}%", "%#{query}%") if params[:search].present?', 
            description: 'Adds case-insensitive search across title and author fields',
            details: 'Active Record uses PostgreSQL\'s ILIKE operator for case-insensitive pattern matching. The query searches both title and author fields simultaneously, with % wildcards for partial matches. Parameterized queries prevent SQL injection.'
          },
          { 
            step: 'Sorting & Pagination', 
            code: 'items = items.order(updated_at: :desc).limit(50).offset(page * 50)', 
            description: 'Applies sorting and pagination for optimal performance',
            details: 'Rails adds ORDER BY updated_at DESC to show recently modified items first, then applies LIMIT and OFFSET for pagination. This prevents large datasets from overwhelming the client and improves response times.'
          },
          { 
            step: 'Query Optimization', 
            code: 'items = items.includes(:user).select(:id, :title, :author_or_director, :status, :rating, :updated_at)', 
            description: 'Optimizes query with eager loading and field selection',
            details: 'Active Record uses includes() to prevent N+1 queries when accessing user data, and select() to only fetch required columns, reducing memory usage and network transfer. This is especially important for mobile clients.'
          },
          { 
            step: 'SQL Execution', 
            code: 'SELECT items.id, items.title, items.author_or_director, items.status, items.rating, items.updated_at FROM items WHERE items.user_id = ? ORDER BY items.updated_at DESC LIMIT 50', 
            description: 'PostgreSQL executes the optimized query with proper indexing',
            details: 'The database executes the final SQL query using indexes on user_id and updated_at for optimal performance. PostgreSQL\'s query planner optimizes execution based on table statistics and available indexes.'
          },
          { 
            step: 'Data Aggregation', 
            code: 'stats = { total: items.count, want_to_read: items.want_to_read.count, currently_reading: items.currently_reading.count, completed: items.completed.count }', 
            description: 'Calculates dashboard statistics using efficient aggregate queries',
            details: 'Rails generates separate COUNT queries for dashboard statistics. These use the same base scope for consistency and leverage database indexes for fast aggregation. The stats provide summary information for the dashboard UI.'
          },
          { 
            step: 'JSON Serialization', 
            code: 'render json: { items: items.as_json(only: [:id, :title, :author_or_director, :status, :rating]), stats: stats }', 
            description: 'Serializes items and statistics to JSON with controlled field exposure',
            details: 'Rails converts the Active Record objects to JSON format, explicitly controlling which fields are included for security and performance. The response includes both the item list and aggregated statistics in a structured format optimized for the frontend dashboard.'
          }
        ];
      default:
        return [
          { step: 'Rails Processing', code: 'Processing request...', description: 'Ruby on Rails is handling your request' }
        ];
    }
  };

  const steps = getOperationSteps(operation);

  const toggleStepDetails = (stepIndex) => {
    const newExpandedSteps = new Set(expandedSteps);
    if (newExpandedSteps.has(stepIndex)) {
      newExpandedSteps.delete(stepIndex);
    } else {
      newExpandedSteps.add(stepIndex);
    }
    setExpandedSteps(newExpandedSteps);
  };

  useEffect(() => {
    if (isVisible && !isProcessing) {
      setIsProcessing(true);
      setCurrentStep(0);
      setIsExpanded(true);
      
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(timer);
            setTimeout(() => {
              setIsProcessing(false);
              // Don't auto-close, let user decide when to close
            }, 1500);
            return prev;
          }
          return prev + 1;
        });
      }, 800);

      return () => clearInterval(timer);
    }
  }, [isVisible, operation, steps.length, isProcessing]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      {/* Side Drawer */}
      <div className={`fixed top-0 right-0 h-full bg-card border-l border-border z-50 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-96' : 'w-12'
      }`}>
        
        {/* Toggle Button */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-card border border-border rounded-l-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {isExpanded ? '→' : '←'}
          </button>
        </div>

        {/* Collapsed State - Rails Icon */}
        {!isExpanded && (
          <div className="p-3 flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mb-2">
              <span className="text-primary-foreground font-bold text-sm">💎</span>
            </div>
            <div className="text-xs text-muted-foreground text-center leading-tight">
              Rails
            </div>
          </div>
        )}

        {/* Expanded State - Full Content */}
        {isExpanded && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">💎</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Rails Backend</h3>
                  <p className="text-xs text-muted-foreground">Ruby on Rails • Active Record</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg transition-all duration-500 ${
                      index <= currentStep
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <div 
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleStepDetails(index)}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          index < currentStep
                            ? 'bg-green-600 text-white'
                            : index === currentStep
                            ? 'bg-primary text-primary-foreground animate-pulse'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {index < currentStep ? '✓' : index + 1}
                        </div>
                        <h4 className={`font-medium text-sm flex-1 ${
                          index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.step}
                        </h4>
                        <div className={`text-xs transition-transform duration-200 ${
                          expandedSteps.has(index) ? 'rotate-180' : 'rotate-0'
                        }`}>
                          ▼
                        </div>
                      </div>
                      
                      <div className={`ml-7 space-y-2 ${
                        index <= currentStep ? 'opacity-100' : 'opacity-50'
                      }`}>
                        <code className="block text-xs bg-input border border-border rounded p-2 text-primary font-mono overflow-x-auto">
                          {step.code}
                        </code>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    
                    {/* Collapsible detailed explanation */}
                    {expandedSteps.has(index) && step.details && (
                      <div className="border-t border-border p-3 bg-accent/5">
                        <div className="ml-7 space-y-4">
                          <div>
                            <h5 className="text-xs font-semibold text-accent mb-2">💎 Rails Framework Deep Dive:</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">{step.details}</p>
                          </div>
                          
                          {/* Advanced teaching features */}
                          {step.advanced && (
                            <div className="space-y-3">
                              {/* Key Concepts */}
                              {step.advanced.concepts && (
                                <div>
                                  <h6 className="text-xs font-semibold text-primary mb-2">🎯 Key Concepts:</h6>
                                  <div className="flex flex-wrap gap-1">
                                    {step.advanced.concepts.map((concept, i) => (
                                      <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                                        {concept}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Code Example */}
                              {step.advanced.codeExample && (
                                <div>
                                  <h6 className="text-xs font-semibold text-green-600 mb-2">📝 Code Example:</h6>
                                  <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded overflow-x-auto font-mono border border-green-500/20">
                                    {step.advanced.codeExample}
                                  </pre>
                                </div>
                              )}
                              
                              {/* Learning Tips */}
                              {step.advanced.tips && (
                                <div>
                                  <h6 className="text-xs font-semibold text-blue-600 mb-2">💡 Pro Tips:</h6>
                                  <ul className="space-y-1">
                                    {step.advanced.tips.map((tip, i) => (
                                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                        <span className="text-blue-500 text-xs">•</span>
                                        <span className="leading-relaxed">{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {currentStep >= steps.length - 1 && (
                <div className="mt-4 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✅</span>
                    <span className="text-green-400 font-medium text-sm">Rails processing completed successfully!</span>
                  </div>
                  <p className="text-xs text-green-400/80 mt-1 ml-6">
                    💡 Click on any step above to explore the Rails framework internals and learn how Ruby on Rails handles this operation.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProcessDebugPanel;