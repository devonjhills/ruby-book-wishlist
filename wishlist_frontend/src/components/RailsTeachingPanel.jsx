import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Database,
  Layers,
  Zap,
  Clock,
  Hash,
  Server,
  Code,
  BarChart3,
  BookOpen,
  Eye,
  TrendingUp,
  Timer,
  Activity,
} from "lucide-react";

const RailsTeachingPanel = ({ debugInfo, isVisible = false, onToggle }) => {
  const [expandedSections, setExpandedSections] = useState(new Set());

  if (!isVisible) return null;

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Rails process steps data
  const railsProcessSteps = [
    {
      id: "routing",
      step: "Route Resolution",
      code: "GET /api/items → ItemsController#index",
      description: "Rails router matches URL to controller action",
      icon: Server,
      details:
        "The Rails router analyzes the HTTP method and URL path against routes defined in config/routes.rb, determining which controller action should handle this request.",
    },
    {
      id: "middleware",
      step: "Middleware Stack",
      code: "ActionDispatch::MiddlewareStack.build",
      description: "Request passes through Rails middleware layers",
      icon: Layers,
      details:
        "Rails processes the request through middleware: CORS, JWT authentication, request logging, and session management.",
    },
    {
      id: "controller",
      step: "Controller Processing",
      code: "before_action :require_authentication",
      description: "Controller validates authentication and processes request",
      icon: Code,
      details:
        "Rails instantiates the controller, runs before_action callbacks for authentication, and executes the main action.",
    },
    {
      id: "database",
      step: "Database Query",
      code: "Item.advanced_search_for_user(user_id, params)",
      description: "Active Record builds and executes optimized SQL",
      icon: Database,
      details:
        "Rails uses Active Record to generate optimized SQL queries with proper indexing, caching, and security measures.",
    },
    {
      id: "response",
      step: "JSON Response",
      code: "render json: { items: items, stats: stats }",
      description: "Rails serializes data and sends HTTP response",
      icon: Activity,
      details:
        "Rails converts Active Record objects to JSON, sets appropriate headers, and sends the response back to the client.",
    },
  ];

  // Middleware stack data
  const middlewareStack = [
    {
      name: "Rack::Cors",
      purpose: "CORS Security",
      description: "Handles cross-origin requests for API access",
    },
    {
      name: "ActionDispatch::RequestId",
      purpose: "Request Tracking",
      description: "Generates unique request IDs for logging",
    },
    {
      name: "ActionDispatch::RemoteIp",
      purpose: "IP Detection",
      description: "Determines real client IP behind proxies",
    },
    {
      name: "JWT Authentication",
      purpose: "API Security",
      description: "Validates JWT tokens for authenticated requests",
    },
    {
      name: "ActionDispatch::Routing",
      purpose: "URL Routing",
      description: "Maps URLs to controller actions",
    },
  ];

  const getPerformanceRating = (duration) => {
    if (duration < 1)
      return { rating: "Excellent", color: "text-green-600", icon: "🚀" };
    if (duration < 10)
      return { rating: "Good", color: "text-blue-600", icon: "⚡" };
    if (duration < 50)
      return { rating: "Fair", color: "text-yellow-600", icon: "⚠️" };
    return { rating: "Slow", color: "text-red-600", icon: "🐌" };
  };

  const formatSqlQuery = (sql) => {
    return sql
      .replace(
        /\b(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|INSERT|UPDATE|DELETE|SET|VALUES)\b/gi,
        "\n$1",
      )
      .replace(/\bAND\b/gi, "\n  AND")
      .replace(/\bOR\b/gi, "\n  OR")
      .trim();
  };

  const totalDuration =
    debugInfo?.sql_queries?.reduce((sum, q) => sum + q.duration_ms, 0) || 0;
  const avgDuration = debugInfo?.sql_queries?.length
    ? totalDuration / debugInfo.sql_queries.length
    : 0;

  return (
    <Card className="mt-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl font-bold">
                  Rails Framework Deep Dive
                </span>
                <Badge
                  variant="outline"
                  className="bg-primary/10 border-primary/30 text-primary"
                >
                  Educational Mode
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Interactive exploration of Ruby on Rails architecture, database
                optimization, and web development patterns
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onToggle}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            Hide Analysis
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="process" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="process" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Rails Process
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Database & SQL
            </TabsTrigger>
            <TabsTrigger value="middleware" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Middleware
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Rails Process Tab */}
          <TabsContent value="process" className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Rails Request Processing Pipeline
              </h3>
              <p className="text-sm text-muted-foreground">
                Follow the journey of an HTTP request through the Rails
                framework, from URL routing to JSON response.
              </p>
            </div>

            <div className="space-y-3">
              {railsProcessSteps.map((step, index) => {
                const Icon = step.icon;
                const isExpanded = expandedSections.has(step.id);

                return (
                  <Card key={step.id} className="border-border">
                    <Collapsible>
                      <CollapsibleTrigger
                        className="w-full"
                        onClick={() => toggleSection(step.id)}
                      >
                        <div className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{step.step}</h4>
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {step.description}
                              </p>
                              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block font-mono text-primary">
                                {step.code}
                              </code>
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-4 pb-4 border-t bg-accent/5">
                          <div className="mt-3">
                            <h5 className="text-sm font-semibold text-primary mb-2">
                              💎 Framework Deep Dive:
                            </h5>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.details}
                            </p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Database & SQL Tab */}
          <TabsContent value="database" className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Database Performance Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time SQL query monitoring, performance metrics, and
                database optimization insights.
              </p>
            </div>

            {debugInfo && (
              <>
                {/* Performance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Timer className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Total Time</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {debugInfo.query_duration_ms?.toFixed(1) ||
                          totalDuration.toFixed(1)}
                        ms
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Avg Query</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {avgDuration.toFixed(1)}ms
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Queries</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {debugInfo.sql_queries_count || 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Index Usage */}
                {debugInfo.indexes_used &&
                  debugInfo.indexes_used.length > 0 && (
                    <Card className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Hash className="w-4 h-4 text-blue-600" />
                          Database Indexes Used
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {debugInfo.indexes_used.map((index, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-blue-50 border-blue-200 text-blue-700"
                            >
                              {index.replace("index_items_on_", "")}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* SQL Queries */}
                {debugInfo.sql_queries && debugInfo.sql_queries.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        SQL Queries Executed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="max-h-96">
                        <div className="space-y-3">
                          {debugInfo.sql_queries.map((query, index) => {
                            const performance = getPerformanceRating(
                              query.duration_ms,
                            );
                            const isExpanded = expandedSections.has(
                              `query-${index}`,
                            );

                            return (
                              <Card key={index} className="border">
                                <Collapsible>
                                  <CollapsibleTrigger
                                    className="w-full"
                                    onClick={() =>
                                      toggleSection(`query-${index}`)
                                    }
                                  >
                                    <div className="p-3 hover:bg-muted/50 transition-colors">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {query.type || "SQL"}
                                          </Badge>
                                          <span className="text-sm">
                                            Query #{index + 1}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`text-sm font-medium ${performance.color}`}
                                          >
                                            {performance.icon}{" "}
                                            {query.duration_ms.toFixed(2)}ms
                                          </span>
                                          {isExpanded ? (
                                            <ChevronDown className="w-4 h-4" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4" />
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-left mt-2">
                                        <code className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded block font-mono">
                                          {query.sql.substring(0, 100)}...
                                        </code>
                                      </div>
                                    </div>
                                  </CollapsibleTrigger>

                                  <CollapsibleContent>
                                    <div className="border-t p-3 bg-slate-50 dark:bg-slate-900/50">
                                      <h5 className="text-sm font-semibold mb-2">
                                        Formatted SQL:
                                      </h5>
                                      <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded overflow-x-auto font-mono">
                                        {formatSqlQuery(query.sql)}
                                      </pre>
                                      <div className="mt-3 text-sm">
                                        <p>
                                          <strong>Performance:</strong>{" "}
                                          {performance.rating} (
                                          {query.duration_ms.toFixed(2)}ms)
                                        </p>
                                        <p>
                                          <strong>Type:</strong>{" "}
                                          {query.type || "Unknown"}
                                        </p>
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </Card>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Middleware Tab */}
          <TabsContent value="middleware" className="space-y-4">
            <div className="bg-purple-50 dark:bg-purple-950/50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Rails Middleware Stack
              </h3>
              <p className="text-sm text-muted-foreground">
                Understanding the middleware layers that process every HTTP
                request in Rails applications.
              </p>
            </div>

            <div className="space-y-3">
              {middlewareStack.map((middleware, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{middleware.name}</h4>
                          <Badge
                            variant="outline"
                            className="text-xs bg-purple-50 border-purple-200 text-purple-700"
                          >
                            {middleware.purpose}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {middleware.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950/50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Performance Insights
              </h3>
              <p className="text-sm text-muted-foreground">
                Learn about Rails performance optimization, caching strategies,
                and best practices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    🚀 Optimization Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <h5 className="font-medium mb-1">Database Indexing</h5>
                    <p className="text-muted-foreground">
                      Strategic indexes on user_id, status, and search fields
                      improve query performance by 10-100x.
                    </p>
                  </div>
                  <div className="text-sm">
                    <h5 className="font-medium mb-1">Active Record Caching</h5>
                    <p className="text-muted-foreground">
                      Rails.cache reduces database load for frequently accessed
                      data like dashboard statistics.
                    </p>
                  </div>
                  <div className="text-sm">
                    <h5 className="font-medium mb-1">N+1 Query Prevention</h5>
                    <p className="text-muted-foreground">
                      Using includes() prevents multiple database queries when
                      loading associated records.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    📚 Learning Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <h5 className="font-medium mb-1">Rails Guides</h5>
                    <p className="text-muted-foreground">
                      Official Rails documentation covers Active Record,
                      routing, and performance optimization.
                    </p>
                  </div>
                  <div className="text-sm">
                    <h5 className="font-medium mb-1">Database Design</h5>
                    <p className="text-muted-foreground">
                      Understanding indexes, constraints, and query optimization
                      for PostgreSQL.
                    </p>
                  </div>
                  <div className="text-sm">
                    <h5 className="font-medium mb-1">
                      Security Best Practices
                    </h5>
                    <p className="text-muted-foreground">
                      JWT authentication, parameter filtering, and CORS
                      configuration for API security.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RailsTeachingPanel;
