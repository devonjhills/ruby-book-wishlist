import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { BookOpen, Library, Plus, LogOut, User, Gem } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-background/95 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-md candlelight-glow">
                  <Gem className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="ruby-title text-2xl md:text-3xl">
                    Ruby Library
                  </h1>
                  <p className="typography-caption text-muted-foreground italic font-normal">
                    Code & Knowledge Collection
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-primary/30"
                >
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-primary/30"
                >
                  <Link to="/items" className="flex items-center gap-2">
                    <Library className="w-4 h-4" />
                    Collection
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow"
                >
                  <Link to="/add-item" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Book
                  </Link>
                </Button>
                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 text-muted-foreground border border-transparent hover:border-red-200 dark:hover:border-red-800"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-primary/30"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow"
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
