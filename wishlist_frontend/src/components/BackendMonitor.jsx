import React, { useState, createContext, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import {
  ChevronDown,
  ChevronUp,
  Activity,
  Database,
  Server,
  Code,
  Clock,
  Scroll,
  Eye,
  Cpu,
  Zap,
  Terminal,
} from "lucide-react";

// Context for managing backend activities globally
const BackendActivityContext = createContext();

export const useBackendActivity = () => {
  const context = useContext(BackendActivityContext);
  if (!context) {
    throw new Error(
      "useBackendActivity must be used within BackendActivityProvider"
    );
  }
  return context;
};

export const BackendActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);

  const addActivity = (operation, description) => {
    const activity = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique keys
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
          activities.map((a) => (a.id === activity.id ? updatedActivity : a))
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
            description: "Rails router matching request to controller action",
            icon: Server,
          },
          {
            step: "Authentication",
            code: "before_action :require_authentication",
            description: "Validating JWT token and setting current_user",
            icon: Server,
          },
          {
            step: "Strong Parameters",
            code: "params.require(:item).permit(:title, :author, ...)",
            description: "Filtering and validating request parameters",
            icon: Code,
          },
          {
            step: "Model Creation",
            code: "current_user.items.build(item_params)",
            description: "Building new Item instance with user association",
            icon: Code,
          },
          {
            step: "Validation",
            code: "validates :title, presence: true",
            description: "Running ActiveRecord validations on the model",
            icon: Code,
          },
          {
            step: "Database Insert",
            code: "INSERT INTO items (title, item_type, status, user_id, ...)",
            description: "Executing SQL INSERT via Active Record",
            icon: Database,
          },
          {
            step: "JSON Response",
            code: "render json: item, status: :created",
            description:
              "Serializing model to JSON and sending HTTP 201 response",
            icon: Server,
          },
        ];
      case "search_books":
        return [
          {
            step: "Route Resolution",
            code: "GET /api/search/books → SearchController#books",
            description: "Rails router mapping search endpoint",
            icon: Server,
          },
          {
            step: "Authentication",
            code: "before_action :require_authentication",
            description: "JWT token validation middleware",
            icon: Server,
          },
          {
            step: "Query Validation",
            code: "return render_error if query.blank?",
            description: "Validating search query parameter",
            icon: Code,
          },
          {
            step: "External API Call",
            code: 'HTTParty.get("https://openlibrary.org/search.json")',
            description: "Making HTTP request to Open Library API",
            icon: Activity,
          },
          {
            step: "Data Transformation",
            code: 'response["docs"].map { |book| transform_book(book) }',
            description: "Transforming API response to our data structure",
            icon: Code,
          },
          {
            step: "Description Lookup",
            code: 'HTTParty.get("https://openlibrary.org#{work_key}.json")',
            description: "Fetching detailed book information",
            icon: Activity,
          },
          {
            step: "JSON Response",
            code: "render json: { results: books }",
            description: "Returning search results as JSON",
            icon: Server,
          },
        ];
      case "update_book":
        return [
          {
            step: "Route Resolution",
            code: "PATCH /api/items/:id → Api::ItemsController#update",
            description: "RESTful routing to update action",
            icon: Server,
          },
          {
            step: "Authentication",
            code: "before_action :require_authentication",
            description: "JWT token validation",
            icon: Server,
          },
          {
            step: "Record Loading",
            code: "@item = current_user.items.find(params[:id])",
            description: "Finding item by ID with user scope for security",
            icon: Database,
          },
          {
            step: "Parameter Filtering",
            code: "item_params = params.require(:item).permit(...)",
            description: "Strong parameters preventing mass assignment",
            icon: Code,
          },
          {
            step: "Model Update",
            code: "@item.update(item_params)",
            description: "Updating model attributes with validation",
            icon: Code,
          },
          {
            step: "Database Update",
            code: "UPDATE items SET status = ?, updated_at = ? WHERE id = ?",
            description: "Executing SQL UPDATE with optimistic locking",
            icon: Database,
          },
          {
            step: "JSON Response",
            code: "render json: @item",
            description: "Returning updated model as JSON",
            icon: Server,
          },
        ];
      case "load_dashboard":
        return [
          {
            step: "Route Resolution",
            code: "GET /api/items → ItemsController#index",
            description: "Rails routing to index action",
            icon: Server,
          },
          {
            step: "Authentication",
            code: "before_action :require_authentication",
            description: "JWT token validation",
            icon: Server,
          },
          {
            step: "Query Building",
            code: "items = current_user.items",
            description: "Building base Active Record relation",
            icon: Code,
          },
          {
            step: "Filtering",
            code: "items = items.where(status: params[:status]) if params[:status].present?",
            description: "Applying conditional WHERE clauses",
            icon: Code,
          },
          {
            step: "Sorting",
            code: "items = items.order(updated_at: :desc)",
            description: "Adding ORDER BY clause to query",
            icon: Code,
          },
          {
            step: "Database Query",
            code: "SELECT * FROM items WHERE user_id = ? ORDER BY updated_at DESC",
            description: "Executing optimized SQL query",
            icon: Database,
          },
          {
            step: "JSON Serialization",
            code: "render json: items",
            description: "Converting Active Record objects to JSON",
            icon: Server,
          },
        ];
      default:
        return [
          {
            step: "Rails Processing",
            code: "Processing request...",
            description: "Ruby on Rails is handling your request",
            icon: Activity,
          },
        ];
    }
  };

  return (
    <BackendActivityContext.Provider
      value={{ activities, currentActivity, addActivity }}>
      {children}
    </BackendActivityContext.Provider>
  );
};

const ActivityDetailDialog = ({ activity }) => {
  if (!activity) return null;

  const formatDuration = (startTime, endTime) => {
    if (!endTime) return "Running...";
    const duration = Math.round(((endTime - startTime) / 1000) * 100) / 100;
    return `${duration}s`;
  };

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] bg-white dark:bg-slate-900 border-primary/30 shadow-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <Terminal className="w-6 h-6 text-background" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-semibold">
                Rails Processing Details
              </span>
              <Badge
                variant="outline"
                className="bg-primary/20 border-primary/50 text-primary">
                {activity.operation.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          {activity.description} •{" "}
          {formatDuration(activity.startTime, activity.endTime)}
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="space-y-4">
          {activity.steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted =
              index < activity.currentStep || activity.status === "completed";
            const isActive =
              index === activity.currentStep && activity.status === "running";

            return (
              <Card
                key={index}
                className={`p-4 transition-all duration-300 border ${
                  isCompleted
                    ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                    : isActive
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-lg"
                    : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 opacity-60"
                }`}>
                <div className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isCompleted
                        ? "bg-green-600 text-white shadow-lg"
                        : isActive
                        ? "bg-primary text-primary-foreground animate-pulse shadow-lg"
                        : "bg-muted text-muted-foreground"
                    }`}>
                    {isCompleted ? "✓" : <Icon className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4
                        className={`font-semibold ${
                          isCompleted || isActive
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}>
                        {step.step}
                      </h4>
                      {isActive && (
                        <Badge
                          variant="default"
                          className="bg-primary/20 text-primary border-primary/30 animate-pulse">
                          Processing...
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3">
                      <code
                        className={`block text-sm bg-background/50 border rounded-lg p-3 font-mono transition-all ${
                          isCompleted || isActive
                            ? "border-primary/20 text-primary"
                            : "border-muted text-muted-foreground"
                        }`}>
                        {step.code}
                      </code>
                      <p
                        className={`text-sm leading-relaxed ${
                          isCompleted || isActive
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

const BackendMonitor = () => {
  const { activities, currentActivity } = useBackendActivity();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="border-border bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <Scroll className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Cpu className="w-4 h-4 text-primary" />
                  Rails Backend
                </CardTitle>
                <p className="text-xs text-muted-foreground italic">
                  Ruby on Rails • PostgreSQL • Active Record
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentActivity && (
                <Badge
                  variant="default"
                  className="bg-primary text-primary-foreground animate-pulse shadow-md">
                  <Zap className="w-3 h-3 mr-1" />
                  ACTIVE
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:bg-muted border border-border">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <CardContent className="pt-0">
              {/* Current Activity */}
              {currentActivity && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-medium text-foreground">
                      Current Operation
                    </h4>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <ActivityDetailDialog activity={currentActivity} />
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    {currentActivity.steps.slice(0, 3).map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index === currentActivity.currentStep;
                      const isCompleted = index < currentActivity.currentStep;

                      return (
                        <div
                          key={index}
                          className={`flex items-start gap-2 p-2 rounded-lg text-xs transition-all border ${
                            isActive
                              ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-sm"
                              : isCompleted
                              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                              : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 opacity-50"
                          }`}>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? "bg-green-600 text-white shadow-sm"
                                : isActive
                                ? "bg-primary text-primary-foreground animate-pulse shadow-sm"
                                : "bg-muted text-muted-foreground"
                            }`}>
                            {isCompleted ? "✓" : <Icon className="w-3 h-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{step.step}</div>
                            <code className="block text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1 mt-1 font-mono text-primary overflow-hidden">
                              {step.code}
                            </code>
                          </div>
                        </div>
                      );
                    })}
                    {currentActivity.steps.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center py-1">
                        +{currentActivity.steps.length - 3} more steps... (click
                        View Details)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activity History */}
              {activities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Activities
                  </h4>
                  <ScrollArea className="h-32">
                    <div className="space-y-1">
                      {activities.map((activity) => (
                        <Dialog key={activity.id}>
                          <DialogTrigger asChild>
                            <div className="flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors hover:bg-primary/5 border border-transparent hover:border-primary/20">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full shadow-sm ${
                                    activity.status === "completed"
                                      ? "bg-green-600"
                                      : activity.status === "running"
                                      ? "bg-primary animate-pulse"
                                      : "bg-muted"
                                  }`}
                                />
                                <span className="font-medium capitalize">
                                  {activity.operation.replace("_", " ")}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="h-4 px-1 text-xs bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                                  {activity.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {activity.endTime
                                  ? `${
                                      Math.round(
                                        ((activity.endTime -
                                          activity.startTime) /
                                          1000) *
                                          100
                                      ) / 100
                                    }s`
                                  : "Running..."}
                              </div>
                            </div>
                          </DialogTrigger>
                          <ActivityDetailDialog activity={activity} />
                        </Dialog>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {activities.length === 0 && !currentActivity && (
                <div className="text-center py-6 text-muted-foreground text-sm rounded-lg border border-slate-200 dark:border-slate-700">
                  <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50 text-primary" />
                  <p>Rails Backend Idle</p>
                  <p className="text-xs mt-1">
                    Interact with the system to see backend processing!
                  </p>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default BackendMonitor;
