'use client';

import React from "react"

import { useEffect, useState, useCallback, useRef } from 'react';
import { Search, FileText, Users, BarChart3, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  href: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  {
    id: '1',
    label: 'Home',
    description: 'Go to homepage',
    category: 'Navigation',
    icon: <BarChart3 className="w-4 h-4" />,
    href: '/',
  },
  {
    id: '2',
    label: 'Dashboard',
    description: 'View your dashboard',
    category: 'Navigation',
    icon: <BarChart3 className="w-4 h-4" />,
    href: '/member',
  },
  {
    id: '3',
    label: 'Groups',
    description: 'Manage your groups',
    category: 'Navigation',
    icon: <Users className="w-4 h-4" />,
    href: '/Groups',
  },
  {
    id: '4',
    label: 'Blog',
    description: 'Read the latest posts',
    category: 'Navigation',
    icon: <FileText className="w-4 h-4" />,
    href: '/blog',
  },
  {
    id: '5',
    label: 'KYC Submissions',
    description: 'Submit KYC documents',
    category: 'Navigation',
    icon: <FileText className="w-4 h-4" />,
    href: '/kyc/submit',
  },
  {
    id: '6',
    label: 'About',
    description: 'Learn about Pollen',
    category: 'Information',
    icon: <Users className="w-4 h-4" />,
    href: '/about',
  },
  {
    id: '7',
    label: 'Contact',
    description: 'Get in touch with us',
    category: 'Information',
    icon: <Users className="w-4 h-4" />,
    href: '/contact',
  },
  {
    id: '6',
    label: 'KYC Submissions',
    description: 'Solor Equipment Form',
    category: 'Navigation',
    icon: <FileText className="w-4 h-4" />,
    href: '/kyc/submit',
  },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = COMMAND_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filtered.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filtered[selectedIndex]) {
            router.push(filtered[selectedIndex].href);
            onOpenChange(false);
            setSearch('');
          }
          break;
        case 'Escape':
          onOpenChange(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, search, selectedIndex, filtered, router, onOpenChange]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-start justify-center pt-16 animate-slide-down">
      <div className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
          />
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filtered.length > 0 ? (
            <div className="p-2">
              {filtered.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(item.href);
                    onOpenChange(false);
                  }}
                  className={`w-full px-3 py-2 rounded-md text-left transition-colors flex items-center gap-3 ${
                    index === selectedIndex
                      ? 'bg-[#003366]/10 text-[#003366] dark:bg-[#00CC66]/10 dark:text-[#00CC66]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="text-gray-400">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.description}</div>
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">{item.category}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No commands found.</p>
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>↑↓ Navigate</span>
          <span>⏎ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
