import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await itemsAPI.getItems({ sort: 'created_at' });
      const items = Array.isArray(response.data) ? response.data : [];
      
      // Filter out any invalid items
      const validItems = items.filter(item => item && item.id && item.title);
      
      setStats({
        total: validItems.length,
        completed: validItems.filter(item => item.status === 'completed').length,
      });
      
      setRecentItems(validItems.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set default values on error
      setStats({ total: 0, completed: 0 });
      setRecentItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your book collection
        </p>
      </div>
        
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Total Books
                </h3>
                <p className="text-3xl font-bold">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xl">
                📚
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Completed
                </h3>
                <p className="text-3xl font-bold text-green-500">
                  {stats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl">
                ✓
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Books</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your latest additions
          </p>
        </CardHeader>
        <CardContent>
          {!recentItems || recentItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center text-muted-foreground text-2xl">
                  📝
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                No books yet. Start building your collection!
              </p>
              <Button asChild>
                <Link to="/add-item">Add First Book</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentItems.filter(item => item && item.id).map((item) => (
                <Card key={item.id} className="p-4 hover:bg-accent/5 transition-colors">
                  <div className="flex items-center space-x-4">
                    {item.cover_image_url ? (
                      <img
                        src={item.cover_image_url}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground text-lg">
                          📖
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {item.title || 'Untitled Book'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.status ? item.status.replace('_', ' ') : 'Unknown'}
                        </Badge>
                      </div>
                      {item.author_or_director && (
                        <p className="text-xs text-primary mt-1">
                          by {item.author_or_director}
                        </p>
                      )}
                    </div>
                    {item.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm">{item.rating}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              <div className="pt-6 border-t text-center">
                <Button variant="link" asChild>
                  <Link to="/items">View all books →</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;