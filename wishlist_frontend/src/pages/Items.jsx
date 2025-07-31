import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BookOpen, Filter, Plus, Library, Scroll } from 'lucide-react';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    sort: 'updated_at',
  });

  useEffect(() => {
    fetchItems();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchItems = async () => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      if (filters.sort) params.sort = filters.sort;

      const response = await itemsAPI.getItems(params);
      
      // Handle both old and new API response formats
      const itemsData = response.data?.items || response.data || [];
      setItems(Array.isArray(itemsData) ? itemsData : []);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleItemUpdate = (updatedItem) => {
    setItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const handleItemDelete = (deletedItemId) => {
    setItems(prev => prev.filter(item => item.id !== deletedItemId));
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-foreground warm-glow">
            <Library className="w-10 h-10 text-primary " />
            My Collection
          </h1>
          <p className="text-muted-foreground italic">
            Manage your personal book collection and reading progress
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground candlelight-glow book-hover">
          <Link to="/add-item" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Book
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8 gothic-gradient parchment-effect deep-library-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <Filter className="w-5 h-5 text-primary " />
            Filters
          </CardTitle>
          <p className="text-sm text-muted-foreground italic">
            Filter and sort your book collection
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Reading Status
              </label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="border-border hover:border-primary/50 focus:border-primary aged-paper">
                  <SelectValue placeholder="All Reading Statuses" />
                </SelectTrigger>
                <SelectContent className="gothic-gradient border-border">
                  <SelectItem value="all">All Books</SelectItem>
                  <SelectItem value="want_to_read">📚 Want to Read</SelectItem>
                  <SelectItem value="currently_reading">📖 Currently Reading</SelectItem>
                  <SelectItem value="completed">✅ Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Sort Order
              </label>
              <Select value={filters.sort} onValueChange={(value) => handleFilterChange('sort', value)}>
                <SelectTrigger className="border-border hover:border-primary/50 focus:border-primary aged-paper">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent className="gothic-gradient border-border">
                  <SelectItem value="updated_at">⏰ Recently Updated</SelectItem>
                  <SelectItem value="created_at">🆕 Recently Added</SelectItem>
                  <SelectItem value="title">🔤 Title (A-Z)</SelectItem>
                  <SelectItem value="rating">⭐ Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      {items.length === 0 ? (
        <Card className="text-center py-16 gothic-gradient parchment-effect deep-library-shadow">
          <CardContent>
            <div className="mb-8">
              <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto flex items-center justify-center text-4xl border-2 border-primary/30 candlelight-glow">
                📚
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground warm-glow">Your Library Awaits</h3>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto italic">
              No books found with the current filters. Start building your personal collection by adding your first book.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground candlelight-glow book-hover">
              <Link to="/add-item" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Book
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onUpdate={handleItemUpdate}
              onDelete={handleItemDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Items;