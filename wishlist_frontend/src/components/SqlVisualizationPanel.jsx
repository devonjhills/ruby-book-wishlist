import React, { useState } from 'react';
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
  DialogTrigger,
} from "./ui/dialog";
import {
  Database,
  Clock,
  Zap,
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronRight,
  Search,
  Hash,
  BarChart3,
  Timer
} from "lucide-react";

const SqlVisualizationPanel = ({ debugInfo, operation, isVisible = true }) => {
  const [expandedQueries, setExpandedQueries] = useState(new Set());
  const [showExplainPlan, setShowExplainPlan] = useState(false);

  if (!isVisible || !debugInfo) return null;

  const toggleQueryExpansion = (index) => {
    const newExpanded = new Set(expandedQueries);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQueries(newExpanded);
  };

  const getQueryTypeColor = (type) => {
    switch (type) {
      case 'SELECT': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'INSERT': return 'bg-green-100 text-green-800 border-green-200';
      case 'UPDATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceRating = (duration) => {
    if (duration < 1) return { rating: 'Excellent', color: 'text-green-600', icon: '🚀' };
    if (duration < 10) return { rating: 'Good', color: 'text-blue-600', icon: '⚡' };
    if (duration < 50) return { rating: 'Fair', color: 'text-yellow-600', icon: '⚠️' };
    return { rating: 'Slow', color: 'text-red-600', icon: '🐌' };
  };

  const formatSqlQuery = (sql) => {
    // Basic SQL formatting for readability
    return sql
      .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|INSERT|UPDATE|DELETE|SET|VALUES)\b/gi, '\n$1')
      .replace(/\bAND\b/gi, '\n  AND')
      .replace(/\bOR\b/gi, '\n  OR')
      .trim();
  };

  const totalDuration = debugInfo.sql_queries?.reduce((sum, q) => sum + q.duration_ms, 0) || 0;
  const avgDuration = debugInfo.sql_queries?.length ? totalDuration / debugInfo.sql_queries.length : 0;

  return (
    <div className="fixed bottom-4 left-4 z-30 w-96 max-h-[80vh] hidden lg:block">
      <Card className="border-border bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Database Performance
                </CardTitle>
                <p className="text-xs text-muted-foreground italic">
                  PostgreSQL • Active Record • Query Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                {debugInfo.sql_queries_count || 0} queries
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Performance Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium">Total Time</span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {debugInfo.query_duration_ms?.toFixed(1) || totalDuration.toFixed(1)}ms
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium">Avg Query</span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {avgDuration.toFixed(1)}ms
              </div>
            </div>
          </div>

          {/* Cache Status */}
          {debugInfo.cache_hits && debugInfo.cache_hits.length > 0 && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Cache Optimization</span>
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">
                Cache hits: {debugInfo.cache_hits.join(', ')}
              </div>
            </div>
          )}

          {/* Index Usage */}
          {debugInfo.indexes_used && debugInfo.indexes_used.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Database Indexes</span>
              </div>
              <div className="space-y-1">
                {debugInfo.indexes_used.map((index, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-blue-100 border-blue-300 text-blue-700 mr-1">
                    {index.replace('index_items_on_', '')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* SQL Queries */}
          {debugInfo.sql_queries && debugInfo.sql_queries.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium">SQL Queries Executed</span>
              </div>
              
              <ScrollArea className="max-h-64">
                <div className="space-y-2">
                  {debugInfo.sql_queries.map((query, index) => {
                    const performance = getPerformanceRating(query.duration_ms);
                    const isExpanded = expandedQueries.has(index);
                    
                    return (
                      <div key={index} className="border rounded-lg bg-white dark:bg-slate-800">
                        <div 
                          className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => toggleQueryExpansion(index)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {isExpanded ? 
                                <ChevronDown className="w-4 h-4 text-slate-400" /> : 
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              }
                              <Badge className={`px-2 py-1 text-xs ${getQueryTypeColor(query.type)}`}>
                                {query.type || 'QUERY'}
                              </Badge>
                              <span className="text-xs text-slate-500">Query #{index + 1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-medium ${performance.color}`}>
                                {performance.icon} {query.duration_ms.toFixed(2)}ms
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-700 rounded p-2 truncate">
                            {query.sql.substring(0, 80)}...
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="border-t bg-slate-50 dark:bg-slate-800 p-3">
                            <div className="space-y-3">
                              <div>
                                <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                  📊 Formatted SQL Query:
                                </h5>
                                <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded overflow-x-auto font-mono">
                                  {formatSqlQuery(query.sql)}
                                </pre>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="font-medium text-slate-600 dark:text-slate-400">Performance:</span>
                                  <div className={`font-bold ${performance.color}`}>
                                    {performance.rating} ({query.duration_ms.toFixed(2)}ms)
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-slate-600 dark:text-slate-400">Query Type:</span>
                                  <div className="font-bold">{query.type || 'Unknown'}</div>
                                </div>
                              </div>
                              
                              {/* Educational Tips */}
                              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-2">
                                <h6 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">
                                  💡 Rails Learning Tip:
                                </h6>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                  {query.type === 'SELECT' && 'This SELECT query uses Active Record to fetch data. Notice how Rails converts your Ruby code to optimized SQL.'}
                                  {query.type === 'INSERT' && 'This INSERT query was generated by Active Record when saving a new model instance. Rails handles SQL generation and parameter binding automatically.'}
                                  {query.type === 'UPDATE' && 'This UPDATE query shows how Rails handles model updates with proper WHERE clauses for security and optimistic locking.'}
                                  {query.type === 'DELETE' && 'This DELETE query demonstrates Rails\' approach to record deletion with proper scoping and constraints.'}
                                  {!query.type && 'This query shows Rails\' database interaction layer in action, converting Ruby operations to SQL.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Educational Footer */}
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                Database Performance Insights
              </span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              This panel shows real-time database performance for educational purposes. 
              Rails Active Record optimizes queries using indexes, caching, and prepared statements. 
              Fast queries (&lt;10ms) indicate good database design and proper indexing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SqlVisualizationPanel;