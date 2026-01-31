'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { Settings, LogOut } from 'lucide-react'; // Import Settings and LogOut components

interface MegaMenuCategory {
  title: string;
  items: { label: string; href: string }[];
}

const MEGA_MENU_DATA: MegaMenuCategory[] = [
  {
    title: 'Services',
    items: [
      { label: 'Services List', href: '/services' },
      // { label: 'Solar Equipment Form', href: '/solutions/enterprise' },
      // { label: 'For Startups', href: '/solutions/startups' },
    ],
  },
  {
    title: 'Kyc Verification',
    items: [
      { label: 'Solar Equipment', href: '/kyc/Solar' },
      { label: 'User Kyc', href: '/kyc/submit' },
      // { label: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Groups', href: '/Groups' },
      { label: 'Blog', href: '/blog' },
      // { label: 'Events', href: '/events' },
    ],
  },
];

interface MegaMenuProps {
  isScrolled: boolean;
  textClasses: string;
}

export function MegaMenu({ isScrolled, textClasses }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-colors ${textClasses}`}
      >
       Pages
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-screen max-w-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-8 animate-slide-down z-50">
          <div className="grid grid-cols-3 gap-8">
            {MEGA_MENU_DATA.map((category) => (
              <div key={category.title}>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                  {category.title}
                </h3>
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block text-gray-600 dark:text-gray-400 hover:text-[#003366] dark:hover:text-[#00CC66] transition-colors text-sm"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-card-border transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
          U
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-card-border rounded-lg shadow-xl overflow-hidden animate-slide-down z-50">
          <div className="px-4 py-3 border-b border-card-border">
            <div className="text-sm font-semibold text-foreground">User Profile</div>
            <div className="text-xs text-muted-foreground">user@example.com</div>
          </div>
          <div className="p-2 space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-card-border hover:text-primary rounded-md transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </a>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-card-border rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
