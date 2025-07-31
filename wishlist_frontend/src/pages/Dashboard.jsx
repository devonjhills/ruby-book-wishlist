import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { itemsAPI } from "../services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useBackendActivity } from "../contexts/BackendActivityContext";
import RailsTeachingPanel from "../components/RailsTeachingPanel";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    want_to_read: 0,
    currently_reading: 0,
    avg_rating: 0,
    total_rated: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showEducationalPanels, setShowEducationalPanels] = useState(false);
  const { addActivity } = useBackendActivity();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Trigger backend activity for educational purposes
      addActivity(
        "load_dashboard",
        "Loading dashboard data with optimized queries",
      );

      // Show educational panels
      setShowEducationalPanels(true);

      // Use enhanced API with debug info
      const response = await itemsAPI.getItems({
        sort: "updated_at",
        per_page: 10,
        include_count: "true",
        debug: "true", // Request debug information
      });

      const responseData = response.data || {};
      const items = Array.isArray(responseData.items)
        ? responseData.items
        : Array.isArray(responseData)
          ? responseData
          : [];
      const serverStats = responseData.stats || {};
      const debugData = responseData.debug_info || null;

      // Store debug information for educational display
      setDebugInfo(debugData);

      // Filter out any invalid items
      const validItems = items.filter((item) => item && item.id && item.title);

      // Use server-provided stats if available, otherwise calculate
      setStats({
        total: serverStats.total || validItems.length,
        completed:
          serverStats.completed ||
          validItems.filter((item) => item.status === "completed").length,
        want_to_read:
          serverStats.want_to_read ||
          validItems.filter((item) => item.status === "want_to_read").length,
        currently_reading:
          serverStats.currently_reading ||
          validItems.filter((item) => item.status === "currently_reading")
            .length,
        avg_rating: serverStats.avg_rating || 0,
        total_rated:
          serverStats.total_rated ||
          validItems.filter((item) => item.rating).length,
      });

      setRecentItems(validItems.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Set default values on error
      setStats({
        total: 0,
        completed: 0,
        want_to_read: 0,
        currently_reading: 0,
        avg_rating: 0,
        total_rated: 0,
      });
      setRecentItems([]);
      setDebugInfo(null);
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
        <h1 className="library-heading text-4xl mb-2">Dashboard</h1>
        <p className="typography-body-large text-muted-foreground">
          Overview of your book collection
        </p>
      </div>

      {/* Educational Toggle */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Library Statistics</h2>
          <p className="text-muted-foreground">
            Real-time data from your Rails backend
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowEducationalPanels(!showEducationalPanels)}
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          {showEducationalPanels
            ? "📚 Hide Rails Deep Dive"
            : "📚 Rails Deep Dive"}
        </Button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-600 mb-1">
                  Total Books
                </h3>
                <p className="text-3xl font-bold text-blue-700">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                📚
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-yellow-600 mb-1">
                  Want to Read
                </h3>
                <p className="text-3xl font-bold text-yellow-700">
                  {stats.want_to_read}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center text-white text-xl">
                🔖
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-orange-600 mb-1">
                  Currently Reading
                </h3>
                <p className="text-3xl font-bold text-orange-700">
                  {stats.currently_reading}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white text-xl">
                📖
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-600 mb-1">
                  Completed
                </h3>
                <p className="text-3xl font-bold text-green-700">
                  {stats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl">
                ✅
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reading Progress & Rating Stats */}
      {(stats.avg_rating > 0 || stats.total_rated > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.avg_rating > 0 && (
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-purple-600 mb-1">
                      Average Rating
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-purple-700">
                        {stats.avg_rating}
                      </p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${star <= Math.floor(stats.avg_rating) ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
                    ⭐
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {stats.total_rated > 0 && (
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-indigo-600 mb-1">
                      Books Rated
                    </h3>
                    <p className="text-3xl font-bold text-indigo-700">
                      {stats.total_rated}
                    </p>
                    <p className="text-xs text-indigo-500 mt-1">
                      {stats.total > 0
                        ? Math.round((stats.total_rated / stats.total) * 100)
                        : 0}
                      % of collection
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                    📊
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recent Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Books</CardTitle>
          <p className="text-sm text-muted-foreground">Your latest additions</p>
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
              {recentItems
                .filter((item) => item && item.id)
                .map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 hover:bg-accent/5 transition-colors"
                  >
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
                          {item.title || "Untitled Book"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.status
                              ? item.status.replace("_", " ")
                              : "Unknown"}
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

      {/* Unified Rails Teaching Panel */}
      <RailsTeachingPanel
        debugInfo={debugInfo}
        isVisible={showEducationalPanels}
        onToggle={() => setShowEducationalPanels(false)}
      />
    </div>
  );
};

export default Dashboard;
