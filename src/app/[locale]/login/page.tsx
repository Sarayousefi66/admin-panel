
import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { LoginForm } from '@/features/auth/components/login-form';
import { LanguageSwitcher } from '@/shared/components/layout/language-switcher';
import { ThemeToggle } from '@/shared/components/layout/theme-toggle';

function LoginVisualPanel() {
  const t = useTranslations('auth.login');

  return (
    <section
      aria-hidden="true"
      className="relative hidden h-full min-h-0 flex-col overflow-hidden rounded-[24px] bg-gradient-to-br from-primary via-primary to-primary/80 p-6 text-primary-foreground shadow-xl shadow-primary/10 xl:flex"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -end-32 -top-36 size-[420px] rounded-full bg-white/[0.09] blur-[80px]" />

        <div className="absolute -bottom-40 -start-32 size-[420px] rounded-full bg-black/[0.08] blur-[90px]" />

        <div className="absolute -end-16 bottom-16 h-72 w-72 rotate-12 rounded-[64px] border border-white/10 bg-white/[0.035]" />

        <div className="absolute end-14 bottom-28 h-52 w-52 -rotate-6 rounded-[48px] border border-white/15 bg-white/[0.06] backdrop-blur-sm" />
      </div>

      {/* Brand */}
      <div className="relative z-10 flex shrink-0 items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl border border-white/15 bg-white/15 shadow-lg backdrop-blur-md">
          <LayoutDashboard className="size-5" />
        </div>

        <div>
          <p className="text-base font-bold tracking-tight">
            {t('panelTitle')}
          </p>

          <p className="mt-0.5 text-[10px] font-medium tracking-[0.18em] text-white/65">
            {t('panelEyebrow')}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center py-5">
        <div className="max-w-[390px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <ShieldCheck className="size-3.5" />

            <span className="text-[11px] font-medium">
              {t('workspaceBadge')}
            </span>
          </div>

          <h1 className="text-lg font-bold leading-[1.7] tracking-tight sm:text-xl">
            {t('panelHeadline')}
          </h1>

          <p className="mt-3 max-w-[340px] text-xs leading-6 text-white/75">
            {t('panelDescription')}
          </p>
        </div>

        {/* Abstract visual */}
        <div className="relative mt-6 flex min-h-0 flex-1 items-center justify-center">
          <div className="relative grid size-[190px] shrink-0 place-items-center">
            <div className="absolute inset-0 rotate-12 rounded-[48px] border border-white/20 bg-white/[0.07] shadow-2xl shadow-black/10" />

            <div className="absolute inset-[22px] -rotate-6 rounded-[40px] border border-white/20 bg-white/[0.09] backdrop-blur-md" />

            <div className="relative grid size-[100px] place-items-center rounded-[28px] border border-white/25 bg-white/[0.16] shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl">
              <div className="absolute inset-1 rounded-[23px] border border-white/10" />

              <ShieldCheck
                className="relative size-12"
                strokeWidth={1.5}
              />
            </div>

            {/* Floating icons */}
            <div className="absolute -start-5 top-7 grid size-11 place-items-center rounded-xl border border-white/20 bg-white/15 shadow-xl backdrop-blur-xl">
              <Users className="size-5" />
            </div>

            <div className="absolute -end-5 bottom-7 grid size-11 place-items-center rounded-xl border border-white/20 bg-white/15 shadow-xl backdrop-blur-xl">
              <Package className="size-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature labels */}
      <div className="relative z-10 flex shrink-0 flex-wrap items-center gap-2 border-t border-white/15 pt-4">
        {[
          {
            icon: Users,
            label: t('usersFeature'),
          },
          {
            icon: Package,
            label: t('productsFeature'),
          },
          {
            icon: ShieldCheck,
            label: t('permissionsFeature'),
          },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.07] px-3 py-1.5"
          >
            <Icon className="size-3.5 text-white/80" />

            <span className="text-[11px] font-medium text-white/85">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LoginPage() {
  const locale = useLocale();
  const t = useTranslations('auth.login');

  const isRtl = locale === 'fa';

  return (
    <main
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative min-h-svh overflow-hidden bg-background"
    >
      {/* Subtle page background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -end-40 -top-48 size-[500px] rounded-full bg-primary/[0.045] blur-3xl" />

        <div className="absolute -bottom-48 -start-40 size-[500px] rounded-full bg-primary/[0.035] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex h-[76px] w-full max-w-[1120px] items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <LayoutDashboard className="size-[18px]" />
          </div>

          <span className="text-sm font-bold tracking-tight text-foreground sm:text-base">
            {t('panelTitle')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Main panels */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-76px)] w-full max-w-[1120px] items-center px-4 py-7 sm:px-8">
        <div className="grid w-full grid-cols-1 items-stretch gap-5 xl:h-[520px] xl:grid-cols-2 xl:gap-6">
          <LoginVisualPanel />

          <div className="h-full min-h-0 w-full">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
