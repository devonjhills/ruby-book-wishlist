import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Shield,
  Globe,
  Lock,
  FileText,
  Clock,
  Zap,
  Filter,
  ChevronDown,
  ChevronRight,
  Layers,
  ArrowDown,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const MiddlewareVisualization = ({ isVisible = false, requestPath = '/', httpMethod = 'GET' }) => {
  const [currentMiddleware, setCurrentMiddleware] = useState(-1);
  const [expandedMiddleware, setExpandedMiddleware] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  const middlewareStack = [
    {
      name: 'Rack::Sendfile',
      icon: FileText,
      purpose: 'File Serving',
      description: 'Handles X-Sendfile headers for efficient static file serving',
      execution_time: '0.1ms',
      status: 'passed',
      details: {
        what_it_does: 'Enables web servers like Nginx to serve static files directly, bypassing Rails for better performance',
        when_active: 'When serving static assets, downloads, or file uploads',
        configuration: 'config.action_dispatch.x_sendfile_header = "X-Sendfile"',
        security_note: 'Prevents Rails from blocking while serving large files'
      }
    },
    {
      name: 'ActionDispatch::Static',
      icon: Globe,
      purpose: 'Static Files',
      description: 'Serves static assets from public/ directory',
      execution_time: '0.2ms',
      status: 'passed',
      details: {
        what_it_does: 'Serves CSS, JS, images, and other static files directly without hitting Rails controllers',
        when_active: 'For requests to /assets/, /images/, /javascripts/, /stylesheets/, etc.',
        configuration: 'config.serve_static_assets = true (in production: false)',
        performance_tip: 'In production, let Nginx/Apache serve static files instead'
      }
    },
    {
      name: 'Rack::Lock',
      icon: Lock,
      purpose: 'Thread Safety',
      description: 'Ensures thread-safe execution in development mode',
      execution_time: '0.1ms',
      status: 'passed',
      details: {
        what_it_does: 'Prevents multiple threads from executing Rails code simultaneously',
        when_active: 'Only in development mode with threaded servers',
        configuration: 'config.allow_concurrency = false (development)',
        production_note: 'Disabled in production for better performance'
      }
    },
    {
      name: 'ActionDispatch::RequestId',
      icon: FileText,
      purpose: 'Request Tracking',
      description: 'Generates unique request IDs for logging and debugging',
      execution_time: '0.3ms',
      status: 'passed',
      details: {
        what_it_does: 'Creates a unique UUID for each request, available as request.uuid',
        when_active: 'For every HTTP request to help trace logs and errors',
        configuration: 'Automatically enabled, adds X-Request-Id header',
        debugging_tip: 'Use request ID to correlate logs across multiple services'
      }
    },
    {
      name: 'Rack::Cors',
      icon: Shield,
      purpose: 'CORS Security',
      description: 'Handles Cross-Origin Resource Sharing for API requests',
      execution_time: '0.5ms',
      status: requestPath.startsWith('/api') ? 'active' : 'passed',
      details: {
        what_it_does: 'Manages CORS headers to allow/deny cross-origin requests from browsers',
        when_active: 'For all requests, especially important for API endpoints',
        configuration: 'config/initializers/cors.rb - defines allowed origins, methods, headers',
        security_note: 'Prevents unauthorized websites from making requests to your API'
      }
    },
    {
      name: 'ActionDispatch::RemoteIp',
      icon: Globe,
      purpose: 'IP Detection',
      description: 'Determines real client IP address behind proxies',
      execution_time: '0.2ms',
      status: 'passed',
      details: {
        what_it_does: 'Extracts real client IP from X-Forwarded-For, X-Real-IP headers',
        when_active: 'When app is behind load balancers, CDNs, or reverse proxies',
        configuration: 'config.action_dispatch.trusted_proxies',
        security_importance: 'Critical for rate limiting, logging, and geo-location features'
      }
    },
    {
      name: 'ActionDispatch::Executor',
      icon: Zap,
      purpose: 'Code Execution',
      description: 'Manages code reloading and callbacks around request execution',
      execution_time: '0.4ms',
      status: 'active',
      details: {
        what_it_does: 'Handles code reloading in development, manages to_prepare and to_complete callbacks',
        when_active: 'Wraps every request to ensure fresh code in development',
        configuration: 'config.reload_classes_only_on_change = true',
        development_feature: 'Enables hot code reloading without server restart'
      }
    },
    {
      name: 'ActionDispatch::Cookies',
      icon: FileText,
      purpose: 'Cookie Management',
      description: 'Handles HTTP cookies parsing and setting',
      execution_time: '0.3ms',
      status: 'passed',
      details: {
        what_it_does: 'Parses incoming cookies and provides interface for setting new ones',
        when_active: 'For requests with cookies or when setting cookies in response',
        configuration: 'config.session_store, config.cookies_same_site_protection',
        security_features: 'Automatic signing, encryption, and SameSite protection'
      }
    },
    {
      name: 'ActionDispatch::Session::CookieStore',
      icon: Lock,
      purpose: 'Session Storage',
      description: 'Manages user sessions via encrypted cookies',
      execution_time: '0.6ms',
      status: 'passed',
      details: {
        what_it_does: 'Stores session data in encrypted, signed cookies sent to client',
        when_active: 'When using session data (flash messages, user login state, etc.)',
        configuration: 'config.session_store :cookie_store',
        security_note: 'Sessions are encrypted with secret_key_base, limited to 4KB'
      }
    },
    {
      name: 'JWT Authentication Middleware',
      icon: Shield,
      purpose: 'API Authentication',
      description: 'Validates JWT tokens for API authentication',
      execution_time: '1.2ms',
      status: requestPath.startsWith('/api') ? 'active' : 'skipped',
      details: {
        what_it_does: 'Extracts and validates JWT tokens from Authorization header',
        when_active: 'For API requests requiring authentication',
        configuration: 'Custom middleware in app/controllers/application_controller.rb',
        security_features: 'Token expiration, signature validation, user context setting'
      }
    },
    {
      name: 'ActionDispatch::Flash',
      icon: AlertCircle,
      purpose: 'Flash Messages',
      description: 'Manages temporary messages between requests',
      execution_time: '0.2ms',
      status: 'passed',
      details: {
        what_it_does: 'Stores temporary messages (success, error, notice) in session',
        when_active: 'When using redirect_to with flash messages',
        configuration: 'Available automatically, accessed via flash[:notice], flash[:alert]',
        use_cases: 'Form submission feedback, error messages, success notifications'
      }
    },
    {
      name: 'ActionDispatch::Routing',
      icon: Filter,
      purpose: 'URL Routing',
      description: 'Matches URLs to controller actions',
      execution_time: '0.8ms',
      status: 'active',
      details: {
        what_it_does: 'Parses URL path and determines which controller#action should handle request',
        when_active: 'For every request to find the appropriate route',
        configuration: 'config/routes.rb defines all application routes',
        optimization: 'Routes are compiled into efficient regex patterns for fast matching'
      }
    }
  ];

  const toggleMiddlewareExpansion = (index) => {
    const newExpanded = new Set(expandedMiddleware);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedMiddleware(newExpanded);
  };

  useEffect(() => {
    if (isVisible && !isAnimating) {
      setIsAnimating(true);
      setCurrentMiddleware(0);
      
      const timer = setInterval(() => {
        setCurrentMiddleware(prev => {
          if (prev >= middlewareStack.length - 1) {
            clearInterval(timer);
            setTimeout(() => setIsAnimating(false), 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 400);

      return () => clearInterval(timer);
    }
  }, [isVisible, middlewareStack.length, isAnimating]);

  if (!isVisible) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-500 text-white';
      case 'passed': return 'bg-green-500 text-white';
      case 'skipped': return 'bg-gray-400 text-white';
      default: return 'bg-gray-300 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Zap className="w-3 h-3" />;
      case 'passed': return <CheckCircle className="w-3 h-3" />;
      case 'skipped': return <Clock className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="fixed top-4 left-4 z-20 w-80 max-h-[90vh] hidden lg:block">
      <Card className="border-border bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Filter className="w-4 h-4 text-purple-600" />
                  Middleware Stack
                </CardTitle>
                <p className="text-xs text-muted-foreground italic">
                  {httpMethod} {requestPath} • Request Processing Pipeline
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
              {middlewareStack.length} layers
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-3">
              {middlewareStack.map((middleware, index) => {
                const Icon = middleware.icon;
                const isActive = index <= currentMiddleware;
                const isCurrent = index === currentMiddleware && isAnimating;
                const isExpanded = expandedMiddleware.has(index);

                return (
                  <div key={index} className="relative">
                    {/* Connection line */}
                    {index < middlewareStack.length - 1 && (
                      <div className="absolute left-4 top-12 w-0.5 h-8 bg-gradient-to-b from-purple-300 to-purple-100 dark:from-purple-600 dark:to-purple-800" />
                    )}
                    
                    <div
                      className={`border rounded-lg transition-all duration-500 cursor-pointer ${
                        isActive
                          ? 'border-purple-300 bg-purple-50 dark:bg-purple-950/30'
                          : 'border-border bg-muted/30'
                      } ${isCurrent ? 'shadow-lg ring-2 ring-purple-400' : ''}`}
                      onClick={() => toggleMiddlewareExpansion(index)}
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isActive ? getStatusColor(middleware.status) : 'bg-muted text-muted-foreground'
                          } ${isCurrent ? 'animate-pulse' : ''}`}>
                            {isActive ? getStatusIcon(middleware.status) : <Icon className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-medium text-sm ${
                                isActive ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {middleware.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {middleware.purpose}
                                </Badge>
                                {isExpanded ? 
                                  <ChevronDown className="w-4 h-4 text-slate-400" /> : 
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                }
                              </div>
                            </div>
                            <p className={`text-xs mt-1 ${
                              isActive ? 'text-muted-foreground' : 'text-muted-foreground/70'
                            }`}>
                              {middleware.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`text-xs font-mono ${
                                isActive ? 'text-blue-600' : 'text-muted-foreground'
                              }`}>
                                {middleware.execution_time}
                              </span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  middleware.status === 'active' ? 'bg-blue-100 border-blue-300 text-blue-700' :
                                  middleware.status === 'passed' ? 'bg-green-100 border-green-300 text-green-700' :
                                  'bg-gray-100 border-gray-300 text-gray-600'
                                }`}
                              >
                                {middleware.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t bg-white/50 dark:bg-slate-800/50 p-3">
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-xs font-semibold text-purple-600 mb-1">🔧 What it does:</h5>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {middleware.details.what_it_does}
                              </p>
                            </div>
                            
                            <div>
                              <h5 className="text-xs font-semibold text-blue-600 mb-1">⚡ When active:</h5>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {middleware.details.when_active}
                              </p>
                            </div>
                            
                            <div>
                              <h5 className="text-xs font-semibold text-green-600 mb-1">⚙️ Configuration:</h5>
                              <code className="text-xs bg-slate-900 text-green-400 p-2 rounded block font-mono">
                                {middleware.details.configuration}
                              </code>
                            </div>
                            
                            {middleware.details.security_note && (
                              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded p-2">
                                <h5 className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">🔒 Security Note:</h5>
                                <p className="text-xs text-yellow-600 dark:text-yellow-400 leading-relaxed">
                                  {middleware.details.security_note}
                                </p>
                              </div>
                            )}
                            
                            {middleware.details.performance_tip && (
                              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-2">
                                <h5 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">🚀 Performance Tip:</h5>
                                <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                                  {middleware.details.performance_tip}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Educational Footer */}
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                Rails Middleware Pipeline
              </span>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
              Middleware processes requests in order (top to bottom) and responses in reverse order. 
              Each layer can modify the request, short-circuit processing, or add response headers. 
              This architecture provides security, logging, caching, and request preprocessing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiddlewareVisualization;