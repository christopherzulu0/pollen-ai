'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Bell, Sun, Moon, Command, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, usePathname } from 'next/navigation';
import { SignedOut, SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { CommandPalette } from './command-palette';
import { MegaMenu } from './menus';
import { useTheme } from 'next-themes';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Groups', href: '/Groups' },
  { label: 'Blog', href: '/blog' },
  { label: 'KYC Submissions', href: '/kyc/submit' },
  { label: 'Contact', href: '/contact' },
];

const NOTIFICATIONS = [
  { id: 1, message: 'New message from admin', time: '5m ago' },
  { id: 2, message: 'Your application was approved', time: '1h ago' },
  { id: 3, message: 'System maintenance scheduled', time: '2h ago' },
];

export function AdvancedNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { theme, setTheme } = useTheme();

  // Hydration fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get user role
  useEffect(() => {
    if (isLoaded && user?.organizationMemberships?.length > 0) {
      const primaryOrg = user.organizationMemberships[0];
      setUserRole(primaryOrg?.role);
    }
  }, [isLoaded, user]);

  // Scroll listener with passive flag for performance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleGetStarted = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  const handleDashboardClick = useCallback(() => {
    if (userRole === 'org:admin' || userRole === 'admin') {
      router.push('/Super-user');
    } else if (userRole === 'org:member' || userRole === 'member') {
      router.push('/dashboard');
    }
  }, [userRole, router]);

  const isAuthorized = useMemo(
    () =>
      userRole === 'org:admin' ||
      userRole === 'admin' ||
      userRole === 'org:member' ||
      userRole === 'member',
    [userRole]
  );

  const isAdmin = useMemo(
    () => userRole === 'org:admin' || userRole === 'admin',
    [userRole]
  );

  // Generate breadcrumbs from pathname
  const breadcrumbs = useMemo(() => {
    const paths = pathname.split('/').filter(Boolean);
    const items = [{ label: 'Home', href: '/', current: pathname === '/' }];

    paths.forEach((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
      items.push({
        label,
        href,
        current: pathname === href,
      });
    });

    return items;
  }, [pathname]);

  // Dynamic classes based on scroll position
  const scrolledClasses = isScrolled
    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800'
    : 'bg-gradient-to-b from-[#003366]/90 to-transparent';

  const textClasses = isScrolled
    ? 'text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-[#00CC66] transition-colors'
    : 'text-white/90 hover:text-white transition-colors';

  return (
    <>
      <CommandPalette open={showCommandPalette} onOpenChange={setShowCommandPalette} />

      <header
        className={`sticky top-0 z-[100] w-full transition-all duration-300 ${scrolledClasses}`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumbs - Hidden on mobile, visible on tablet and above */}
          {pathname !== '/' && (
            <div className="hidden sm:block py-2 border-b border-white/10">
              <nav className="flex items-center gap-1 text-xs" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center gap-1">
                    {index > 0 && (
                      <ChevronRight
                        className={`w-3 h-3 ${
                          isScrolled ? 'text-gray-400' : 'text-white/50'
                        }`}
                      />
                    )}
                    {crumb.current ? (
                      <span
                        className={`font-semibold ${
                          isScrolled
                            ? 'text-[#003366] dark:text-[#00CC66]'
                            : 'text-white'
                        }`}
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className={`transition-colors ${
                          isScrolled
                            ? 'text-gray-600 dark:text-gray-400 hover:text-[#003366] dark:hover:text-[#00CC66]'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          )}

          <div className="flex h-20 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003366] to-[#00CC66] flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-[#00CC66]/40 transition-all duration-300">
                  P
                </div>
                <span
                  className={`text-2xl font-bold transition-colors duration-300 ${
                    isScrolled ? 'text-[#003366] dark:text-white' : 'text-white'
                  }`}
                >
                  Pollen
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${textClasses}`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Mega Menu Component */}
              <MegaMenu isScrolled={isScrolled} textClasses={textClasses} />
            </nav>

            {/* Right Controls Section */}
            <div className="hidden lg:flex items-center gap-2 lg:gap-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isScrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'text-white/80 hover:bg-white/10'
                }`}
                aria-label="Search"
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative p-2 rounded-full transition-all duration-200 ${
                      isScrolled
                        ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                    aria-label="Notifications"
                    title="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  {NOTIFICATIONS.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className="flex flex-col gap-1 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{notif.time}</p>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isScrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'text-white/80 hover:bg-white/10'
                }`}
                aria-label="Toggle theme"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Command Palette Trigger */}
              <button
                onClick={() => setShowCommandPalette(true)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all duration-200 ${
                  isScrolled
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Open command palette"
              >
                <Command className="h-4 w-4" />
                <span className="hidden sm:inline">⌘K</span>
              </button>

              {/* Authentication Buttons */}
              {isMounted && isLoaded ? (
                <>
                  <SignedOut>
                    <Button
                      onClick={handleGetStarted}
                      className="bg-[#00CC66] hover:bg-[#00BB55] text-white rounded-full transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg hover:shadow-[#00CC66]/40 font-semibold"
                    >
                      Get Started
                    </Button>
                  </SignedOut>

                  <SignedIn>
                    {isAuthorized ? (
                      <Button
                        onClick={handleDashboardClick}
                        className={`${
                          isScrolled
                            ? 'bg-[#4C4EFB] hover:bg-[#4C4EFB]/90 text-white'
                            : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                        } rounded-full transition-all duration-300 font-semibold shadow-lg`}
                      >
                        {isAdmin ? '📊 Admin' : '📈 Dashboard'}
                      </Button>
                    ) : (
                      <Button
                        className={`${
                          isScrolled
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-yellow-400/80 hover:bg-yellow-500/90 text-white backdrop-blur-sm'
                        } rounded-full transition-all duration-300 font-semibold shadow-lg`}
                      >
                        🔐 Request Access
                      </Button>
                    )}

                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: 'h-10 w-10 rounded-full ring-2 ring-[#00CC66]/20 hover:ring-[#00CC66]/40 transition-all',
                        },
                      }}
                      showName={false}
                    />
                  </SignedIn>
                </>
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-white'
                }`}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
                className={`transition-colors ${isScrolled ? 'text-[#003366] dark:text-white' : 'text-white'}`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Search Bar Expanded */}
          {isSearchOpen && (
            <div className="pb-4 border-t border-white/10 animate-slide-down">
              <div className="flex items-center gap-2 mt-3">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed left-0 right-0 top-20 bg-gradient-to-br from-[#003366] to-[#002244] dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 z-50 p-4 overflow-y-auto max-h-[calc(100vh-80px)] animate-slide-down">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium p-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-b border-white/10 py-2" />

            {isMounted && isLoaded ? (
              <>
                <SignedOut>
                  <Button
                    onClick={handleGetStarted}
                    className="bg-[#00CC66] hover:bg-[#00BB55] text-white w-full rounded-xl py-6 text-lg shadow-lg mt-4 font-semibold"
                  >
                    Get Started
                  </Button>
                </SignedOut>

                <SignedIn>
                  {isAuthorized ? (
                    <Button
                      onClick={() => {
                        handleDashboardClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-[#4C4EFB] hover:bg-[#4C4EFB]/90 text-white rounded-xl py-3 font-bold text-base transition-all duration-300 shadow-lg"
                    >
                      {isAdmin ? '📊 Admin Dashboard' : '📈 Dashboard'}
                    </Button>
                  ) : (
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl py-3 font-bold text-base transition-all duration-300 shadow-lg">
                      🔐 Request Access
                    </Button>
                  )}

                  <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-xl mt-4">
                    <span className="font-medium text-gray-900 dark:text-white">Account</span>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: 'h-10 w-10 rounded-full ring-2 ring-[#00CC66]/20',
                        },
                      }}
                      showName={false}
                    />
                  </div>
                </SignedIn>
              </>
            ) : (
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            )}
          </nav>
        </div>
      )}
    </>
  );
}
