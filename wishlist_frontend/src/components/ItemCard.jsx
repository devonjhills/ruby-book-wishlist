import { useState } from "react";
import { itemsAPI } from "../services/api";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Edit3,
  Trash2,
  Save,
  X,
  Star,
  BookOpen,
  User,
  Calendar,
  Eye,
  ExternalLink,
} from "lucide-react";

const ItemCard = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: item.status,
    rating: item.rating || "",
    description: item.description || "",
    notes: item.notes || "",
  });
  const [loading, setLoading] = useState(false);

  const getBriefSynopsis = (description) => {
    if (!description) return null;

    // Split into sentences and take first 1-2 sentences, max 150 chars
    const sentences = description
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);

    if (sentences.length === 0) return null;

    let synopsis = sentences[0].trim();

    // If first sentence is very short and we have a second sentence, include it
    if (synopsis.length < 50 && sentences.length > 1) {
      synopsis += ". " + sentences[1].trim();
    }

    // Truncate if still too long
    if (synopsis.length > 150) {
      synopsis = synopsis.substring(0, 147) + "...";
    } else if (synopsis.length > 0 && !synopsis.match(/[.!?]$/)) {
      synopsis += "...";
    }

    return synopsis;
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await itemsAPI.updateItem(item.id, {
        status: newStatus,
      });
      onUpdate(response.data);
    } catch (error) {
      console.error("Failed to update item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.updateItem(item.id, editData);
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this book from your collection?",
      )
    ) {
      try {
        setLoading(true);
        await itemsAPI.deleteItem(item.id);
        onDelete(item.id);
      } catch (error) {
        console.error("Failed to delete item:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      want_to_read: {
        label: "Want to Read",
        icon: "📚",
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        bgClass: "bg-blue-50 dark:bg-blue-950/30",
      },
      currently_reading: {
        label: "Currently Reading",
        icon: "📖",
        className: "bg-green-500/20 text-green-400 border-green-500/30",
        bgClass: "bg-green-50 dark:bg-green-950/30",
      },
      completed: {
        label: "Completed",
        icon: "✅",
        className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        bgClass: "bg-purple-50 dark:bg-purple-950/30",
      },
    };

    return (
      statusMap[status] || {
        label: "Unknown",
        icon: "❓",
        className: "bg-muted text-muted-foreground border-muted",
        bgClass: "bg-slate-50 dark:bg-slate-900/50",
      }
    );
  };

  const statusConfig = getStatusConfig(item.status);

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card
      className={`group border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/40 overflow-hidden ${statusConfig.bgClass}`}
    >
      {/* Book Cover or Placeholder */}
      <div className="relative h-48 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        {item.cover_image_url ? (
          <img
            src={item.cover_image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700/50">
            <BookOpen className="w-16 h-16 text-primary/50" />
          </div>
        )}

        {/* Status Badge Overlay */}
        <div className="absolute top-3 left-3">
          <Badge
            className={`${statusConfig.className} shadow-lg backdrop-blur-sm border`}
          >
            <span className="mr-1">{statusConfig.icon}</span>
            {statusConfig.label}
          </Badge>
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="bg-background/90 backdrop-blur-sm hover:bg-muted border border-border"
                disabled={loading}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-foreground font-bold">
                      {item.title || "Untitled Book"}
                    </h2>
                    {item.author_or_director && (
                      <p className="text-sm text-muted-foreground">
                        by {item.author_or_director}
                      </p>
                    )}
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Book Cover and Basic Info */}
                <div className="flex gap-6">
                  <div className="w-32 h-48 flex-shrink-0">
                    {item.cover_image_url ? (
                      <img
                        src={item.cover_image_url}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg border border-border"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Status Badge */}
                    <div>
                      <Badge className={`${statusConfig.className} shadow-md`}>
                        <span className="mr-1">{statusConfig.icon}</span>
                        {statusConfig.label}
                      </Badge>
                    </div>

                    {/* Rating */}
                    {item.rating && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                          Rating
                        </h4>
                        <div className="flex items-center gap-2">
                          {renderStars(item.rating)}
                          <span className="text-sm text-muted-foreground">
                            ({item.rating}/5 stars)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Publication Year */}
                    {item.release_year && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                          Published
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {item.release_year}
                        </div>
                      </div>
                    )}

                    {/* Genre */}
                    {item.genre && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                          Genre
                        </h4>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 border-primary/30 text-primary"
                        >
                          {item.genre}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Personal Notes */}
                {item.notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      My Notes
                    </h4>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <p className="text-sm text-foreground">{item.notes}</p>
                    </div>
                  </div>
                )}

                {/* External Link */}
                {item.external_id && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      More Information
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://openlibrary.org${item.external_id}`,
                          "_blank",
                        )
                      }
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Open Library
                    </Button>
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Added:</span>{" "}
                      {new Date(
                        item.created_at || Date.now(),
                      ).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {new Date(
                        item.updated_at || Date.now(),
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-background/90 backdrop-blur-sm hover:bg-muted border border-border"
            disabled={loading}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="bg-background/90 backdrop-blur-sm hover:bg-red-500 hover:text-white border border-border"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {!isEditing ? (
          <>
            {/* Book Title and Author */}
            <div>
              <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                {item.title || "Untitled Book"}
              </h3>
              {item.author_or_director && (
                <p className="text-muted-foreground text-sm flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {item.author_or_director}
                </p>
              )}
            </div>

            {/* Rating and Year */}
            <div className="flex items-center justify-between">
              {item.rating && (
                <div className="flex items-center gap-2">
                  {renderStars(item.rating)}
                  <span className="text-sm text-muted-foreground">
                    ({item.rating}/5)
                  </span>
                </div>
              )}
              {item.release_year && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {item.release_year}
                </div>
              )}
            </div>

            {/* Genre */}
            {item.genre && (
              <Badge
                variant="outline"
                className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
              >
                {item.genre}
              </Badge>
            )}

            {/* Brief Synopsis */}
            {getBriefSynopsis(item.description) && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {getBriefSynopsis(item.description)}
              </p>
            )}

            {/* Notes */}
            {item.notes && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-sm text-foreground font-medium mb-1">
                  Personal Notes:
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.notes}
                </p>
              </div>
            )}

            {/* Quick Status Changer */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <Select
                value={item.status}
                onValueChange={handleStatusChange}
                disabled={loading}
              >
                <SelectTrigger className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="want_to_read">📚 Want to Read</SelectItem>
                  <SelectItem value="currently_reading">
                    📖 Currently Reading
                  </SelectItem>
                  <SelectItem value="completed">✅ Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          /* Edit Mode */
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={editData.status}
                onValueChange={(value) =>
                  setEditData({ ...editData, status: value })
                }
              >
                <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="want_to_read">📚 Want to Read</SelectItem>
                  <SelectItem value="currently_reading">
                    📖 Currently Reading
                  </SelectItem>
                  <SelectItem value="completed">✅ Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Rating (1-5)
              </label>
              <Select
                value={editData.rating.toString()}
                onValueChange={(value) =>
                  setEditData({ ...editData, rating: parseInt(value) || "" })
                }
              >
                <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Select rating..." />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="0">No Rating</SelectItem>
                  <SelectItem value="1">⭐ 1 Star</SelectItem>
                  <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Personal Notes
              </label>
              <textarea
                value={editData.notes}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                className="w-full p-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                rows={3}
                placeholder="Add your thoughts about this book..."
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemCard;
