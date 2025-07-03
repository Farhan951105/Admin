import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Trophy, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  History,
  Bell,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { ModeToggle } from '../components/ModeToggle';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Tournaments', href: '/admin/tournaments', icon: Trophy },
    { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
    { name: 'Hand History', href: '/admin/hand-history', icon: History },
    { name: 'Send Notification', href: '/admin/send-notification', icon: Bell },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleSidebarToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSidebarOpen(!sidebarOpen);
    
    // Reset animation flag after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleSidebarClose = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSidebarOpen(false);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleSidebarClose}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r border-border shadow-xl lg:hidden transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground animate-fade-in-up">Admin Panel</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSidebarClose}
            className="hover:bg-accent transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto sidebar-nav">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 nav-item-hover ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground shadow-md nav-item-active'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
                }`}
                onClick={handleSidebarClose}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fade-in-up 0.6s ease-out forwards'
                }}
              >
                <Icon className={`mr-3 h-4 w-4 transition-transform duration-200 ${
                  isActive(item.href) ? 'scale-110 icon-pulse' : 'group-hover:scale-110'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r border-border shadow-lg">
          <div className="flex h-16 items-center px-4 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto sidebar-nav">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 nav-item-hover ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground shadow-md nav-item-active'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fade-in-up 0.5s ease-out forwards'
                  }}
                >
                  <Icon className={`mr-3 h-4 w-4 transition-transform duration-200 ${
                    isActive(item.href) ? 'scale-110 icon-pulse' : 'group-hover:scale-110'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 animate-fade-in-up">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-accent transition-colors duration-200"
            onClick={handleSidebarToggle}
            disabled={isAnimating}
          >
            {isAnimating ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-accent transition-colors duration-200">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl} alt={user?.firstName} />
                      <AvatarFallback>{user?.firstName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.firstName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="hover:bg-accent transition-colors duration-200">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 animate-fade-in-up">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 