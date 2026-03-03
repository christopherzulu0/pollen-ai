'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Command, ChevronRight, ChevronDown, Mic, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter, usePathname } from 'next/navigation';
import { SignedOut, SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { CommandPalette } from './command-palette';
import { MegaMenu } from './menus';
import { useTheme } from 'next-themes';
import { PollenLogo } from '../shared/pollen-logo';
import { VoiceNavigator } from '@/components/voice/voice-navigator';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  // { label: 'Services', href: '/services' },
  // { label: 'Groups', href: '/Groups' },
  // { label: 'Blog', href: '/blog' },
  // { label: 'KYC Submissions', href: '/kyc/submit' },
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
  const { language, languages, isTranslating, handleLanguageChange } = useLanguage();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isHomePage = pathname === '/';

  const handleVoiceClick = useCallback(() => {
    const voiceButton = document.querySelector(
      '[aria-label="Start voice navigation"], [aria-label="Stop listening"]',
    ) as HTMLButtonElement | null;
    if (voiceButton) {
      voiceButton.click();
    }
  }, []);

  // Hydration fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get user role
  useEffect(() => {
    if (isLoaded && user?.organizationMemberships && user.organizationMemberships.length > 0) {
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
      router.push('/member');
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

  // Support and pricing pages have light background - use light navbar styling from the start
  const isLightPage =
    pathname.startsWith('/support') || pathname.startsWith('/pricing');
  const useLightNavbar = isScrolled || isLightPage;

  // Dynamic classes based on scroll position (and page background for support)
  const scrolledClasses = useLightNavbar
    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800'
    : 'bg-gradient-to-b from-[#003366]/90 to-transparent';

  const textClasses = useLightNavbar
    ? 'text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-[#00CC66] transition-colors'
    : 'text-white/90 hover:text-white transition-colors';

  return (
    <>
      <CommandPalette open={showCommandPalette} onOpenChange={setShowCommandPalette} />

      <header
        className={`sticky top-0 z-100 w-full transition-all duration-300 ${scrolledClasses}`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumbs - Hidden on mobile, visible on tablet and above */}
          {pathname !== '/' && (
            <div className={`hidden sm:block py-2 border-b ${useLightNavbar ? 'border-gray-200 dark:border-gray-800' : 'border-white/10'}`}>
              <nav className="flex items-center gap-1 text-xs" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center gap-1">
                    {index > 0 && (
                      <ChevronRight
                        className={`w-3 h-3 ${useLightNavbar ? 'text-gray-400' : 'text-white/50'
                          }`}
                      />
                    )}
                    {crumb.current ? (
                      <span
                        className={`font-semibold ${useLightNavbar
                          ? 'text-[#003366] dark:text-[#00CC66]'
                          : 'text-white'
                          }`}
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className={`transition-colors ${useLightNavbar
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
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <PollenLogo size={42} className="group-hover:scale-110 transition-transform duration-300 " />
                <span
                  className={`text-2xl font-black tracking-tight transition-colors duration-300 ${useLightNavbar ? 'text-gray-900 dark:text-white' : 'text-white'
                    }`}
                >
                  Pollen<span className="text-[#4C4EFB]">AI</span>
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
              <MegaMenu isScrolled={useLightNavbar} textClasses={textClasses} />
            </nav>

            {/* Right Controls Section */}
            <div className="hidden lg:flex items-center gap-2 lg:gap-4">
              {isMounted && (
                <TooltipProvider delayDuration={200}>
                  {/* Voice Navigator Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`relative rounded-full h-10 w-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                          useLightNavbar ? '' : 'hover:brightness-110'
                        }`}
                        onClick={handleVoiceClick}
                      >
                        <Mic className="h-4 w-4" />
                        <span className="sr-only">Voice Navigator</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="mt-2">
                      <p>Voice Navigator</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Language Switcher - only on home page, like BottomNavigator */}
                  {isHomePage && (
                    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`relative rounded-full h-10 px-3 bg-card/80 border border-border shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                                useLightNavbar
                                  ? 'text-gray-800 dark:text-gray-100'
                                  : 'text-white border-white/40 bg-white/10'
                              }`}
                            >
                              <Globe className="h-4 w-4 mr-1.5" />
                              <span className="text-xs font-semibold">
                                {languages.find((l) => l.code === language)?.name.substring(0, 3)}
                              </span>
                              {isTranslating ? (
                                <Loader2 className="h-3.5 w-3.5 ml-1.5 animate-spin text-primary" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5 ml-1.5 opacity-60" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="mt-2">
                          <p>Change Language</p>
                        </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent
                        align="end"
                        side="bottom"
                        className="w-44 bg-popover/95 backdrop-blur-xl border-border shadow-xl rounded-xl p-1 mt-2"
                      >
                        {languages.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`cursor-pointer rounded-lg px-3 py-2 transition-all duration-150 ${
                              language === lang.code
                                ? 'bg-primary/15 text-primary font-semibold'
                                : 'hover:bg-accent text-foreground font-medium'
                            }`}
                          >
                            {lang.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TooltipProvider>
              )}

              {/* Theme Toggle */}
              {/* <button
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
              </button> */}

              {/* Command Palette Trigger */}
              <button
                onClick={() => setShowCommandPalette(true)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all duration-200 ${useLightNavbar
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
                        className={`${useLightNavbar
                          ? 'bg-[#4C4EFB] hover:bg-[#4C4EFB]/90 text-white'
                          : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                          } rounded-full transition-all duration-300 font-semibold shadow-lg`}
                      >
                        {isAdmin ? '📊 Admin' : '📈 Dashboard'}
                      </Button>
                    ) : (
                      <Button
                        className={`${useLightNavbar
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

            {/* Mobile: Voice, Language, Search, Menu */}
            <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
              {isMounted && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="relative rounded-full h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white border-0 shadow-md hover:brightness-110"
                        onClick={handleVoiceClick}
                      >
                        <Mic className="h-4 w-4 sm:h-4 w-4" />
                        <span className="sr-only">Voice Navigator</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="mt-2">
                      <p>Voice Navigator</p>
                    </TooltipContent>
                  </Tooltip>
                  {isHomePage && (
                    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`rounded-full h-9 sm:h-10 px-2.5 sm:px-3 bg-card/80 border shadow-md ${
                                useLightNavbar
                                  ? 'text-gray-800 dark:text-gray-100 border-border'
                                  : 'text-white border-white/40 bg-white/10'
                              }`}
                            >
                              <Globe className="h-4 w-4 mr-1 sm:mr-1.5" />
                              <span className="text-xs font-semibold">
                                {languages.find((l) => l.code === language)?.name.substring(0, 3)}
                              </span>
                              {isTranslating ? (
                                <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1 animate-spin text-primary" />
                              ) : (
                                <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1 opacity-60" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="mt-2">
                          <p>Change Language</p>
                        </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent
                        align="end"
                        side="bottom"
                        className="w-44 bg-popover/95 backdrop-blur-xl border-border shadow-xl rounded-xl p-1 mt-2"
                      >
                        {languages.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`cursor-pointer rounded-lg px-3 py-2 transition-all duration-150 ${
                              language === lang.code
                                ? 'bg-primary/15 text-primary font-semibold'
                                : 'hover:bg-accent text-foreground font-medium'
                            }`}
                          >
                            {lang.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TooltipProvider>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
                className={`transition-colors ${useLightNavbar ? 'text-[#003366] dark:text-white' : 'text-white'}`}
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
        <div className="lg:hidden fixed left-0 right-0 top-20 bg-linear-to-br from-[#003366] to-[#002244] dark:bg-linear-to-br dark:from-gray-900 dark:to-gray-950 z-50 p-4 overflow-y-auto max-h-[calc(100vh-80px)] animate-slide-down">
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

      {/* Voice Navigator - hidden button, triggered from navbar */}
      <div className="voice-navigator-wrapper [&_button]:!hidden">
        <VoiceNavigator />
      </div>
    </>
  );
}

