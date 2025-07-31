import { useState, createContext, useContext } from "react";

// Context for managing backend activities globally
const BackendActivityContext = createContext();

export const useBackendActivity = () => {
  const context = useContext(BackendActivityContext);
  if (!context) {
    throw new Error(
      "useBackendActivity must be used within BackendActivityProvider",
    );
  }
  return context;
};

export const BackendActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);

  const addActivity = (operation, description) => {
    const activity = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      operation,
      description,
      steps: getOperationSteps(operation),
      currentStep: 0,
      status: "running",
      startTime: new Date(),
      endTime: null,
    };

    setCurrentActivity(activity);
    setActivities((prev) => [activity, ...prev.slice(0, 9)]); // Keep last 10 activities

    // Simulate step progression
    const timer = setInterval(() => {
      setCurrentActivity((prev) => {
        if (!prev || prev.id !== activity.id) {
          clearInterval(timer);
          return prev;
        }

        const nextStep = prev.currentStep + 1;
        const updatedActivity = { ...prev, currentStep: nextStep };

        if (nextStep >= prev.steps.length) {
          updatedActivity.status = "completed";
          updatedActivity.endTime = new Date();
          clearInterval(timer);
          setCurrentActivity(null);
        }

        setActivities((activities) =>
          activities.map((a) => (a.id === activity.id ? updatedActivity : a)),
        );

        return updatedActivity;
      });
    }, 800);

    return activity.id;
  };

  const getOperationSteps = (operation) => {
    switch (operation) {
      case "create_book":
        return [
          {
            step: "Route Resolution",
            code: "POST /api/items → Api::ItemsController#create",
          },
          {
            step: "Authentication",
            code: "before_action :require_authentication",
          },
          {
            step: "Strong Parameters",
            code: "params.require(:item).permit(:title, :author, ...)",
          },
          {
            step: "Model Creation",
            code: "current_user.items.build(item_params)",
          },
          { step: "Validation", code: "validates :title, presence: true" },
          {
            step: "Database Insert",
            code: "INSERT INTO items (title, item_type, status, user_id, ...)",
          },
          {
            step: "JSON Response",
            code: "render json: item, status: :created",
          },
        ];
      case "search_books":
        return [
          {
            step: "Route Resolution",
            code: "GET /api/search/books → SearchController#books",
          },
          {
            step: "Authentication",
            code: "before_action :require_authentication",
          },
          {
            step: "Query Validation",
            code: "return render_error if query.blank?",
          },
          {
            step: "External API Call",
            code: 'HTTParty.get("https://openlibrary.org/search.json")',
          },
          {
            step: "Data Transformation",
            code: 'response["docs"].map { |book| transform_book(book) }',
          },
          {
            step: "Description Lookup",
            code: 'HTTParty.get("https://openlibrary.org#{work_key}.json")',
          },
          { step: "JSON Response", code: "render json: { results: books }" },
        ];
      case "update_book":
        return [
          {
            step: "Route Resolution",
            code: "PATCH /api/items/:id → Api::ItemsController#update",
          },
          {
            step: "Authentication",
            code: "before_action :require_authentication",
          },
          {
            step: "Record Loading",
            code: "@item = current_user.items.find(params[:id])",
          },
          {
            step: "Parameter Filtering",
            code: "item_params = params.require(:item).permit(...)",
          },
          { step: "Model Update", code: "@item.update(item_params)" },
          {
            step: "Database Update",
            code: "UPDATE items SET status = ?, updated_at = ? WHERE id = ?",
          },
          { step: "JSON Response", code: "render json: @item" },
        ];
      case "load_dashboard":
        return [
          {
            step: "Route Resolution",
            code: "GET /api/items → ItemsController#index",
          },
          {
            step: "Authentication",
            code: "before_action :require_authentication",
          },
          { step: "Query Building", code: "items = current_user.items" },
          {
            step: "Filtering",
            code: "items = items.where(status: params[:status]) if params[:status].present?",
          },
          { step: "Sorting", code: "items = items.order(updated_at: :desc)" },
          {
            step: "Database Query",
            code: "SELECT * FROM items WHERE user_id = ? ORDER BY updated_at DESC",
          },
          { step: "JSON Serialization", code: "render json: items" },
        ];
      default:
        return [
          {
            step: "Rails Processing",
            code: "Processing request...",
            description: "Ruby on Rails is handling your request",
          },
        ];
    }
  };

  return (
    <BackendActivityContext.Provider
      value={{ activities, currentActivity, addActivity }}
    >
      {children}
    </BackendActivityContext.Provider>
  );
};
