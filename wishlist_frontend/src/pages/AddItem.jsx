import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI, searchAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { BookOpen, Info, Star, Calendar, User, Hash, Globe, Tag, Eye, Plus } from 'lucide-react';

const AddItem = () => {
  const [activeTab, setActiveTab] = useState('search');
  const itemType = 'book';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [manualForm, setManualForm] = useState({
    title: '',
    author_or_director: '',
    genre: '',
    release_year: '',
    cover_image_url: '',
    description: '',
    status: 'want_to_read',
    notes: '',
  });

  const navigate = useNavigate();

  // Detailed Book Info Modal Component
  const BookDetailModal = ({ book }) => {
    return (
      <DialogContent className="max-w-4xl max-h-[90vh] gothic-gradient deep-library-shadow">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center candlelight-glow">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="warm-glow text-foreground">{book.title}</span>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Detailed information about this book
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="md:col-span-1">
              {book.cover_image_url ? (
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full max-w-sm mx-auto rounded-lg book-spine-shadow"
                />
              ) : (
                <div className="w-full max-w-sm mx-auto aspect-[2/3] bg-muted rounded-lg flex items-center justify-center text-6xl parchment-effect">
                  📚
                </div>
              )}
            </div>
            
            {/* Book Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground warm-glow">Book Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {book.author_or_director && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary " />
                      <span className="text-sm text-muted-foreground">Author:</span>
                      <span className="text-sm text-foreground">{book.author_or_director}</span>
                    </div>
                  )}
                  {book.release_year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary " />
                      <span className="text-sm text-muted-foreground">Published:</span>
                      <span className="text-sm text-foreground">{book.release_year}</span>
                    </div>
                  )}
                  {book.page_count && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary " />
                      <span className="text-sm text-muted-foreground">Pages:</span>
                      <span className="text-sm text-foreground">{book.page_count}</span>
                    </div>
                  )}
                  {book.publisher && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary " />
                      <span className="text-sm text-muted-foreground">Publisher:</span>
                      <span className="text-sm text-foreground">{book.publisher}</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-primary " />
                      <span className="text-sm text-muted-foreground">ISBN:</span>
                      <span className="text-sm text-foreground font-mono">{book.isbn}</span>
                    </div>
                  )}
                  {book.language && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary " />
                      <span className="text-sm text-muted-foreground">Language:</span>
                      <span className="text-sm text-foreground">{book.language}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ratings */}
              {(book.average_rating || book.rating_count) && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground warm-glow">Ratings</h3>
                  <div className="flex items-center gap-4">
                    {book.average_rating && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary " />
                        <span className="text-sm text-foreground">{book.average_rating.toFixed(1)} stars</span>
                      </div>
                    )}
                    {book.rating_count && (
                      <Badge variant="outline" className="bg-muted/20 border-primary/30">
                        {book.rating_count} ratings
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Subjects/Genres */}
              {book.subjects && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground warm-glow">Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.subjects.split(', ').map((subject, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/20 border-primary/30 text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {book.description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground warm-glow">Description</h3>
                  <div className="aged-paper p-4 rounded-lg border border-border">
                    <p className="text-sm text-foreground leading-relaxed">{book.description}</p>
                  </div>
                </div>
              )}

              {/* First Sentence */}
              {book.first_sentence && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground warm-glow">Opening Line</h3>
                  <div className="aged-paper p-4 rounded-lg border border-border">
                    <p className="text-sm text-foreground italic">"{book.first_sentence}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    
    try {
      const response = await searchAPI.searchBooks(searchQuery);
      
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFromSearch = async (result) => {
    const defaultStatus = 'want_to_read';
    
    const itemData = {
      ...result,
      item_type: itemType,
      status: defaultStatus,
    };

    try {
      setLoading(true);
      setError('');
      
      await itemsAPI.createItem(itemData);
      navigate('/items');
    } catch (error) {
      console.error('Failed to add item:', error);
      if (error.response?.status === 409) {
        setError('This book is already in your collection');
      } else {
        setError('Failed to add book. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    const itemData = {
      ...manualForm,
      item_type: itemType,
      release_year: manualForm.release_year ? parseInt(manualForm.release_year) : null,
    };

    try {
      setLoading(true);
      
      await itemsAPI.createItem(itemData);
      navigate('/items');
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 warm-glow">
          Add New Book
        </h1>
        <p className="text-muted-foreground italic">
          Discover and add books to your personal library
        </p>
        {error && (
          <div className="mt-4 p-3 bg-destructive/20 border border-destructive/30 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
      </div>


      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <Button
            onClick={() => setActiveTab('search')}
            variant={activeTab === 'search' ? 'default' : 'outline'}
            className={`px-6 py-3 font-medium transition-all duration-200 ${
              activeTab === 'search'
                ? 'bg-primary text-primary-foreground candlelight-glow book-hover'
                : 'hover:bg-muted/30 border-border'
            }`}
          >
            🔍 Search & Add
          </Button>
          <Button
            onClick={() => setActiveTab('manual')}
            variant={activeTab === 'manual' ? 'default' : 'outline'}
            className={`px-6 py-3 font-medium transition-all duration-200 ${
              activeTab === 'manual'
                ? 'bg-primary text-primary-foreground candlelight-glow book-hover'
                : 'hover:bg-muted/30 border-border'
            }`}
          >
            ✏️ Add Manually
          </Button>
        </div>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <Card className="gothic-gradient parchment-effect deep-library-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground warm-glow flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary " />
              Search Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for books..."
                className="flex-1 px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent aged-paper transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={searching}
                className="bg-primary hover:bg-primary/90 text-primary-foreground candlelight-glow book-hover"
              >
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-muted-foreground text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Search Results
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {searchResults.map((result, index) => (
                    <Card key={index} className="aged-paper border-border book-hover transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          {result.cover_image_url ? (
                            <img
                              src={result.cover_image_url}
                              alt={result.title}
                              className="w-16 h-20 object-cover rounded-lg book-spine-shadow flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 parchment-effect">
                              <BookOpen className="w-6 h-6 text-primary " />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground text-sm mb-1">{result.title}</h3>
                            {result.author_or_director && (
                              <p className="text-xs text-muted-foreground mb-1">by {result.author_or_director}</p>
                            )}
                            {result.release_year && (
                              <p className="text-xs text-muted-foreground mb-2">{result.release_year}</p>
                            )}
                            {result.description && (
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{result.description.substring(0, 100)}...</p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Button
                                onClick={() => handleAddFromSearch(result)}
                                disabled={loading}
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground candlelight-glow text-xs"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add to Library
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs border-border hover:bg-muted/30"
                                  >
                                    <Info className="w-3 h-3 mr-1" />
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <BookDetailModal book={result} />
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual Tab */}
      {activeTab === 'manual' && (
        <div className="card">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground">
              Manual Entry
            </h3>
            <p className="text-muted-foreground400 text-sm mt-1">
              Enter item details manually
            </p>
          </div>
          
          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.title}
                  onChange={(e) => setManualForm({...manualForm, title: e.target.value})}
                  className="input"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground300 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={manualForm.author_or_director}
                  onChange={(e) => setManualForm({...manualForm, author_or_director: e.target.value})}
                  className="input"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground300 mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  value={manualForm.genre}
                  onChange={(e) => setManualForm({...manualForm, genre: e.target.value})}
                  className="input"
                  placeholder="Enter genre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground300 mb-2">
                  Release Year
                </label>
                <input
                  type="number"
                  value={manualForm.release_year}
                  onChange={(e) => setManualForm({...manualForm, release_year: e.target.value})}
                  className="input"
                  placeholder="2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground300 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={manualForm.cover_image_url}
                  onChange={(e) => setManualForm({...manualForm, cover_image_url: e.target.value})}
                  className="input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground300 mb-2">
                  Status
                </label>
                <select
                  value={manualForm.status}
                  onChange={(e) => setManualForm({...manualForm, status: e.target.value})}
                  className="input"
                >
                    <option value="want_to_read">Want to Read</option>
                    <option value="currently_reading">Currently Reading</option>
                    <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground300 mb-2">
                Description
              </label>
              <textarea
                value={manualForm.description}
                onChange={(e) => setManualForm({...manualForm, description: e.target.value})}
                rows={3}
                className="input resize-none"
                placeholder="Enter book description or synopsis..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground300 mb-2">
                Notes
              </label>
              <textarea
                value={manualForm.notes}
                onChange={(e) => setManualForm({...manualForm, notes: e.target.value})}
                rows={3}
                className="input resize-none"
                placeholder="Add your thoughts about this book..."
              />
            </div>

            <div className="flex space-x-4 pt-6 border-t border-border">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Adding...' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/items')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AddItem;