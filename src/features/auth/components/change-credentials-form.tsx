'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
    createChangeCredentialsSchema,
    type ChangeCredentialsFormValues,
} from '../shared/schemas/change-credentials.schema';

import type { ChangeCredentialsPayload } from '../api/auth.api';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  onSubmit: (values: ChangeCredentialsPayload) => void;
  isPending?: boolean;
}

export function ChangeCredentialsForm({
  onSubmit,
  isPending = false,
}: Props) {
  const t = useTranslations('auth.changeCredentials');

  const formId = useId();

  const schema = useMemo(
    () =>
      createChangeCredentialsSchema({
        usernameInvalid: t('validation.usernameInvalid'),
        passwordMin: t('validation.passwordMin'),
        passwordMax: t('validation.passwordMax'),
        confirmPasswordMismatch: t(
          'validation.confirmPasswordMismatch',
        ),
        passwordComplexity: t('validation.passwordComplexity'),
      }),
    [t],
  );

  const form = useForm<ChangeCredentialsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = form.handleSubmit(
    ({ username, password }) => {
      onSubmit({
        username,
        password,
      });
    },
  );

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>

        <p className="text-sm leading-6 text-muted-foreground">
          {t('description')}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New username */}
          <div className="space-y-2">
            <Label htmlFor={`${formId}-username`}>
              {t('username')}
            </Label>

            <Input
              id={`${formId}-username`}
              autoComplete="username"
              autoFocus
              dir="ltr"
              placeholder={t('usernamePlaceholder')}
              aria-invalid={!!form.formState.errors.username}
              disabled={isPending}
              {...form.register('username')}
            />

            {form.formState.errors.username?.message && (
              <p className="text-xs text-destructive">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          {/* New password */}
          <div className="space-y-2">
            <Label htmlFor={`${formId}-password`}>
              {t('password')}
            </Label>

            <Input
              id={`${formId}-password`}
              type="password"
              autoComplete="new-password"
              dir="ltr"
              placeholder={t('passwordPlaceholder')}
              aria-invalid={!!form.formState.errors.password}
              disabled={isPending}
              {...form.register('password')}
            />

            {form.formState.errors.password?.message && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm new password */}
          <div className="space-y-2">
            <Label htmlFor={`${formId}-confirm-password`}>
              {t('confirmPassword')}
            </Label>

            <Input
              id={`${formId}-confirm-password`}
              type="password"
              autoComplete="new-password"
              dir="ltr"
              placeholder={t('confirmPasswordPlaceholder')}
              aria-invalid={
                !!form.formState.errors.confirmPassword
              }
              disabled={isPending}
              {...form.register('confirmPassword')}
            />

            {form.formState.errors.confirmPassword?.message && (
              <p className="text-xs text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}