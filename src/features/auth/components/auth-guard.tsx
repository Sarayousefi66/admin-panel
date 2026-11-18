
'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { hasPermission } from '@/shared/lib/permissions';

import { useCurrentUser } from '../hooks/use-current-user';

function AuthLoadingScreen() {
  const t = useTranslations('common');

  return (
    <div
      role="status"
      aria-busy="true"
      className="flex min-h-svh w-full flex-col items-center justify-center gap-5 bg-background"
    >
      <div className="relative grid size-16 place-items-center">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-primary/10 border-t-primary border-e-primary/50" />

        {/* Inner rotating ring */}
        <div className="absolute inset-2 animate-[spin_1.5s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-primary/40 border-s-primary/30" />

        {/* Center glow */}
        <div className="size-3 rounded-full bg-primary shadow-[0_0_16px_4px] shadow-primary/30" />
      </div>

      <span className="text-sm font-medium tracking-wide text-muted-foreground">
        {t('loading')}
      </span>

      <span className="sr-only">{t('loading')}</span>
    </div>
  );
}

export function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading } = useCurrentUser();

  const isLoginPage = pathname === '/login';
  const isChangeCredentialsPage =
    pathname === '/change-credentials';
  const isDashboardPage = pathname === '/';

  const user = data?.user;
  const hasUser = Boolean(user);
  const userId = user?.id;

  const mustChangeCredentials =
    data?.mustChangeCredentials === true;

  const canViewDashboard = hasPermission(
    user,
    'dashboard.view',
  );

  const canViewProducts = hasPermission(
    user,
    'products.view',
  );

  const defaultPath = canViewDashboard
    ? '/'
    : canViewProducts
      ? '/products'
      : userId
        ? `/users/${userId}`
        : '/login';

  const shouldRedirectFromDashboard =
    hasUser &&
    !mustChangeCredentials &&
    isDashboardPage &&
    !canViewDashboard;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!hasUser) {
      if (!isLoginPage) {
        router.replace('/login');
      }

      return;
    }

    if (mustChangeCredentials) {
      if (!isChangeCredentialsPage) {
        router.replace('/change-credentials');
      }

      return;
    }

    if (isLoginPage || isChangeCredentialsPage) {
      router.replace(defaultPath);
      return;
    }

    if (shouldRedirectFromDashboard) {
      router.replace(defaultPath);
    }
  }, [
    defaultPath,
    hasUser,
    isChangeCredentialsPage,
    isLoginPage,
    isLoading,
    mustChangeCredentials,
    router,
    shouldRedirectFromDashboard,
  ]);

  const mustRedirect =
    (!hasUser && !isLoginPage) ||
    (hasUser &&
      mustChangeCredentials &&
      !isChangeCredentialsPage) ||
    (hasUser &&
      !mustChangeCredentials &&
      (isLoginPage || isChangeCredentialsPage)) ||
    shouldRedirectFromDashboard;

  if (isLoading || mustRedirect) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
