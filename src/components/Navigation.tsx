import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Focus, Camera, BarChart3, Menu, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Focus className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">CivicGuard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link 
              to="/report" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/report" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Report Billboard
            </Link>
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Authority Dashboard
            </Link>
            <Link 
              to="/community" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/community" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Community
            </Link>
            <Link 
              to="/my-reports" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/my-reports" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              My Reports
            </Link>
            <Link 
              to="/risk-scoring" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/risk-scoring" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              AI Risk Assessment
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-md transition-all duration-300 hover:bg-secondary text-muted-foreground hover:text-foreground"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-500 hover:rotate-45 text-yellow-500" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-500 hover:-rotate-12 text-primary" />
              )}
            </Button>
            <Button variant="default" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              AR Scan
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-md transition-all duration-300 hover:bg-secondary text-muted-foreground hover:text-foreground"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-primary" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link 
              to="/" 
              className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/report" 
              className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Report Billboard
            </Link>
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Authority Dashboard
            </Link>
            <Link 
              to="/community" 
              className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
            <Link 
              to="/my-reports" 
              className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              My Reports
            </Link>
            <Link 
              to="/risk-scoring" 
              className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Risk Assessment
            </Link>
            <Button variant="default" size="sm" className="ml-3 mt-2">
              <Camera className="h-4 w-4 mr-2" />
              AR Scan
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;