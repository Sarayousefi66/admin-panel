
'use client';

import Image from 'next/image';

import {
  ChevronDown,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useLogout } from '@/features/auth/hooks/use-logout';

import { useUIStore } from '@/store/ui-store';

import { Link } from '@/i18n/navigation';

import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  const { data, isLoading } = useCurrentUser();
  const { mutate: logout } = useLogout();

  const t = useTranslations('navbar');
  const locale = useLocale();

  const isRtl = locale === 'fa';
  const direction = isRtl ? 'rtl' : 'ltr';

  const toggleSidebar = useUIStore(
    (state) => state.toggleSidebar,
  );

  const toggleMobileSidebar = useUIStore(
    (state) => state.toggleMobileSidebar,
  );

  const handleSidebarToggle = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  };

  if (isLoading) {
    return (
      <header
        dir={direction}
        className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-card/95 px-3 backdrop-blur sm:px-5 lg:px-7"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSidebarToggle}
            aria-label={t('toggleSidebar')}
            title={t('toggleSidebar')}
            className="size-9 shrink-0 rounded-lg"
          >
            <Menu className="size-4" />
          </Button>

          <div className="space-y-1.5">
            <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <span className="sr-only">{t('loading')}</span>

        <div className="flex shrink-0 items-center gap-2">
          <div className="size-9 animate-pulse rounded-lg bg-muted" />
          <div className="size-9 animate-pulse rounded-lg bg-muted" />
        </div>
      </header>
    );
  }

  const user = data?.user;

  const displayName =
    [user?.firstName, user?.lastName]
      .filter((part) => Boolean(part?.trim()))
      .join(' ') ||
    user?.name?.trim() ||
    'User';

  // Dynamic assigned roles are the source of truth.
  // Do not fall back to the legacy user.role field.
  const assignedRoles = user?.roles ?? [];

  const firstInitial = user?.firstName?.trim().charAt(0) ?? '';
  const lastInitial = user?.lastName?.trim().charAt(0) ?? '';

  const avatarInitials = (
    `${firstInitial}${lastInitial}` ||
    displayName.charAt(0) ||
    'U'
  ).toLocaleUpperCase(locale);

  return (
    <header
      dir={direction}
      className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-card/95 px-3 backdrop-blur sm:px-5 lg:px-7"
    >
      {/* Welcome section */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleSidebarToggle}
          aria-label={t('toggleSidebar')}
          title={t('toggleSidebar')}
          className="size-9 shrink-0 rounded-lg border-border bg-background p-0 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
        >
          <Menu className="size-4" />
        </Button>

        <div className="min-w-0">
          <p className="truncate text-[11px] leading-4 text-muted-foreground">
            {t('welcomeBack')}
          </p>

          <h1 className="truncate text-sm font-semibold leading-5 tracking-tight text-foreground">
            {t('hello', { name: displayName })}
          </h1>
        </div>
      </div>

      {/* Navbar actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <div className="flex items-center gap-0.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        {/* Profile dropdown */}
        <DropdownMenu dir={direction}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={displayName}
              className="group flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 text-xs font-semibold text-primary ring-2 ring-transparent transition-all group-hover:ring-primary/15">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={displayName}
                    width={36}
                    height={36}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  avatarInitials
                )}
              </span>

              <span className="hidden max-w-32 truncate text-start text-xs font-medium text-foreground sm:block">
                {displayName}
              </span>

              <ChevronDown className="hidden size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align={isRtl ? 'start' : 'end'}
            sideOffset={10}
            className="w-72 rounded-xl border-border/80 bg-popover p-1.5 shadow-xl shadow-black/10"
          >
            {/* User information */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 text-sm font-semibold text-primary">
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={displayName}
                      width={44}
                      height={44}
                      unoptimized
                      className="size-full object-cover"
                    />
                  ) : (
                    avatarInitials
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {displayName}
                  </p>

                  {user?.email && (
                    <p
                      dir="ltr"
                      className="mt-1 truncate text-start text-xs text-muted-foreground"
                    >
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Assigned roles */}
              <div className="mt-3 border-t border-border/70 pt-3">
                <div className="mb-2 flex items-center gap-1.5 text-muted-foreground">
                  <ShieldCheck className="size-3.5 shrink-0" />
                  <span className="text-[11px] font-medium">
                    {t('assignedRoles')}
                  </span>
                </div>

                {assignedRoles.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {assignedRoles.map((role) => (
                      <span
                        key={role.id}
                        title={role.slug}
                        className="inline-flex max-w-full items-center rounded-md border border-primary/15 bg-primary/5 px-2 py-1 text-[11px] font-medium text-foreground"
                      >
                        <span className="truncate">
                          {role.name || role.slug}
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-md border border-dashed border-border px-2.5 py-2 text-xs text-muted-foreground">
                    {t('noAssignedRoles')}
                  </p>
                )}
              </div>
            </div>

            <DropdownMenuSeparator className="my-1.5" />

            {/* Profile link */}
            {user?.id && (
              <DropdownMenuItem
                asChild
                className="min-h-10 cursor-pointer gap-2.5 rounded-lg px-3 text-sm"
              >
                <Link href={`/users/${user.id}`}>
                  <UserRound className="size-4 shrink-0 text-muted-foreground" />
                  <span>{t('profile')}</span>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator className="my-1.5" />

            {/* Logout */}
            <DropdownMenuItem
              onClick={() => logout(undefined)}
              className="min-h-10 cursor-pointer gap-2.5 rounded-lg px-3 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="size-4 shrink-0" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
