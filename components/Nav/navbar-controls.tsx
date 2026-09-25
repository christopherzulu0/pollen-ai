'use client';

import { Search, Bell, Moon, Sun } from 'lucide-react';
import { useCallback, useState } from 'react';

export function SearchBar() {
  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-card-bg border border-card-border rounded-lg hover:border-primary/50 transition-colors flex-1 max-w-xs">
      <Search className="w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search..."
        className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
      />
    </div>
  );
}

export function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationCount = 3;

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-card-border rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />
        )}
      </button>

      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-card-border rounded-lg shadow-xl p-4 animate-slide-down z-50">
          <h3 className="font-semibold text-foreground mb-3">Notifications</h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-card-bg border border-card-border rounded-md hover:border-primary/50 transition-colors cursor-pointer">
                <div className="text-sm font-medium text-foreground">Notification {i}</div>
                <div className="text-xs text-muted-foreground">A few seconds ago</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 text-muted-foreground hover:text-foreground hover:bg-card-border rounded-lg transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
