
'use client';

import { LayoutDashboard } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { navigation } from '@/config/navigation';
import { usePermission } from '@/features/auth/hooks/use-permission';
import { Link, usePathname } from '@/i18n/navigation';
import { useUIStore } from '@/store/ui-store';

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const isSidebarOpen = useUIStore(
    (state) => state.isSidebarOpen,
  );

  const isMobileSidebarOpen = useUIStore(
    (state) => state.isMobileSidebarOpen,
  );

  const setMobileSidebar = useUIStore(
    (state) => state.setMobileSidebar,
  );

  const { canAccess } = usePermission();

  const renderNavigation = (isCollapsed: boolean) =>
    navigation.map((item) => {
      if (!canAccess(item.permission)) {
        return null;
      }

      const Icon = item.icon;
      const label = t(item.labelKey);

      const isActive =
        pathname === item.href ||
        (item.href !== '/' &&
          pathname.startsWith(`${item.href}/`));

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileSidebar(false)}
          aria-label={label}
          aria-current={isActive ? 'page' : undefined}
          title={isCollapsed ? label : undefined}
          className={`
            group relative flex min-h-11 w-full
            items-center rounded-xl text-[13px] font-medium
            transition-all duration-200
            ${
              isCollapsed
                ? 'justify-center px-0'
                : 'gap-3 px-3'
            }
            ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:inset-y-2 before:start-0 before:w-[3px] before:rounded-e-full before:bg-sidebar-primary'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'
            }
          `}
        >
          <Icon
            aria-hidden="true"
            className={`
              size-[18px] shrink-0 transition-colors duration-200
              ${
                isActive
                  ? 'text-sidebar-primary'
                  : 'text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground'
              }
            `}
          />

          {!isCollapsed && (
            <span className="min-w-0 flex-1 truncate">
              {label}
            </span>
          )}
        </Link>
      );
    });

  const renderSidebarContent = (isCollapsed: boolean) => (
    <>
      {/* Sidebar header */}
      <div
        className={`
          flex h-16 shrink-0 items-center border-b border-sidebar-border
          transition-all duration-200
          ${
            isCollapsed
              ? 'justify-center px-2'
              : 'gap-3 px-5'
          }
        `}
      >
        <div
          title={isCollapsed ? 'Dashboard UI' : undefined}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary/15 text-sidebar-primary"
        >
          <LayoutDashboard className="size-[19px]" />
        </div>

        {!isCollapsed && (
          <h2 className="min-w-0 truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
            Dashboard UI
          </h2>
        )}
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className={`
          flex min-h-0 flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto py-5
          ${
            isCollapsed
              ? 'items-center px-2'
              : 'px-3'
          }
        `}
      >
        {renderNavigation(isCollapsed)}
      </nav>

      {/* Sidebar footer */}
      {!isCollapsed && (
        <div className="shrink-0 border-t border-sidebar-border px-5 py-3">
          <p className="text-[10px] font-medium tracking-wide text-sidebar-foreground/40">
            Dashboard UI
          </p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        aria-label="Desktop sidebar"
        className={`
          sticky top-0 hidden h-svh shrink-0 flex-col overflow-hidden
          bg-sidebar text-sidebar-foreground
          transition-[width] duration-200 ease-in-out
          md:flex
          ${
            isSidebarOpen
              ? 'w-[248px]'
              : 'w-[72px]'
          }
        `}
      >
        {renderSidebarContent(!isSidebarOpen)}
      </aside>

      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileSidebar(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/45 backdrop-blur-[2px] md:hidden"
          />

          {/* Mobile sidebar */}
          <aside
            aria-label="Mobile sidebar"
            className="fixed inset-y-0 start-0 z-50 flex h-svh w-[min(18rem,85vw)] flex-col overflow-hidden bg-sidebar text-sidebar-foreground shadow-xl md:hidden"
          >
            {renderSidebarContent(false)}
          </aside>
        </>
      )}
    </>
  );
}
