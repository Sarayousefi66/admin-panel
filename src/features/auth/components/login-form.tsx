
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';

import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useLogin } from '../hooks/use-login';

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const t = useTranslations('auth.login');
  const locale = useLocale();

  const isRtl = locale === 'fa';
  const direction = isRtl ? 'rtl' : 'ltr';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({
      username,
      password,
    });
  };

  return (
    <Card
      dir={direction}
      className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[24px] border border-border/70 bg-card/90 shadow-[0_20px_60px_-32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
    >
      {/* Header */}
      <CardHeader className="shrink-0 px-6 pb-7 pt-8 sm:px-9 sm:pb-8 sm:pt-9">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <ShieldCheck
              className="size-7"
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0 space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
              {t('title')}
            </CardTitle>

            <div className="h-1 w-10 rounded-full bg-primary/70" />
          </div>
        </div>
      </CardHeader>

      {/* Form */}
      <CardContent className="flex flex-1 flex-col justify-center px-6 pb-8 sm:px-9 sm:pb-9">
        <form
          dir={direction}
          onSubmit={handleSubmit}
          className="w-full space-y-5"
          aria-busy={isPending}
        >
          {/* Username */}
          <div className="space-y-2.5">
            <Label
              htmlFor="username"
              className="block text-start text-sm font-semibold text-foreground"
            >
              {t('username')}
            </Label>

            <div className="group relative w-full">
              <UserRound className="pointer-events-none absolute start-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

              <Input
                id="username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                dir={direction}
                placeholder={t('usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 w-full rounded-xl border-border/80 bg-background/70 ps-11 pe-3 text-start shadow-none transition-all placeholder:text-start placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2.5">
            <Label
              htmlFor="password"
              className="block text-start text-sm font-semibold text-foreground"
            >
              {t('password')}
            </Label>

            <div className="group relative w-full">
              <LockKeyhole className="pointer-events-none absolute start-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                dir={direction}
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-xl border-border/80 bg-background/70 ps-11 pe-3 text-start shadow-none transition-all placeholder:text-start placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10"
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            dir={direction}
            disabled={isPending}
            className="mt-3 flex h-12 w-full flex-row items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold leading-none shadow-lg shadow-primary/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20"
          >
            {isPending ? (
              <>
                <span className="inline-flex items-center leading-none">
                  {t('submitting')}
                </span>

                <LoaderCircle className="block size-[18px] shrink-0 animate-spin" />
              </>
            ) : (
              <>
                <span className="inline-flex items-center leading-none">
                  {t('submit')}
                </span>

                {isRtl ? (
                  <ArrowLeft className="block size-[18px] shrink-0" />
                ) : (
                  <ArrowRight className="block size-[18px] shrink-0" />
                )}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
