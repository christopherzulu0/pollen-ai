'use client';

import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          {item.current ? (
            <span className="text-primary font-medium">{item.label}</span>
          ) : (
            <a href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
              {item.label}
            </a>
          )}
        </div>
      ))}
    </nav>
  );
}
