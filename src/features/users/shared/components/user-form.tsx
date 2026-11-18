
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';

import {
  createUserFormSchema,
  createUserProfileFormSchema,
  type CreateUserFormValues,
  type UserProfileFormValues,
} from '../schemas/user-form.schema';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type CommonProps = {
  isLoading?: boolean;
  initialValues?: Partial<CreateUserFormValues>;
  title?: string;
  description?: string;
  submitLabel?: string;
  fullWidth?: boolean;
  variant?: 'card' | 'dialog';
};

type CreateUserFormProps = CommonProps & {
  mode?: 'create';
  onSubmit: (values: CreateUserFormValues) => void;
};

type EditUserFormProps = CommonProps & {
  mode: 'edit';
  onSubmit: (values: UserProfileFormValues) => void;
};

type Props = CreateUserFormProps | EditUserFormProps;

export function UserForm(props: Props) {
  const {
    isLoading = false,
    initialValues,
    title,
    description,
    submitLabel,
    fullWidth = false,
    variant = 'card',
  } = props;

  const mode = props.mode ?? 'create';
  const isCreateMode = mode === 'create';

  const t = useTranslations('users.form');
  const validationT = useTranslations('users.validation');

  const formId = useId();
  const isDialog = variant === 'dialog';

  const schema = useMemo(() => {
    const profileMessages = {
      firstNameMin: validationT('firstNameMin'),
      lastNameMin: validationT('lastNameMin'),
      emailInvalid: validationT('emailInvalid'),
      ageMin: validationT('ageMin'),
    };

    if (!isCreateMode) {
      return createUserProfileFormSchema(profileMessages);
    }

    return createUserFormSchema({
      ...profileMessages,
      usernameInvalid: validationT('usernameInvalid'),
      passwordMin: validationT('passwordMin'),
      passwordMax: validationT('passwordMax'),
      passwordComplexity: validationT('passwordComplexity'),
    });
  }, [isCreateMode, validationT]);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<CreateUserFormValues>,
    shouldUnregister: true,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 18,
      ...(isCreateMode
        ? {
            username: '',
            password: '',
          }
        : {}),
    },
  });

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    const profileValues = {
      firstName: initialValues.firstName ?? '',
      lastName: initialValues.lastName ?? '',
      email: initialValues.email ?? '',
      age: initialValues.age ?? 18,
    };

    if (isCreateMode) {
      form.reset({
        ...profileValues,
        username: initialValues.username ?? '',
        password: '',
      });
      return;
    }

    form.reset(profileValues);
  }, [initialValues, form, isCreateMode]);

  const handleFormSubmit = form.handleSubmit((values) => {
    if (props.mode === 'edit') {
      props.onSubmit({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        age: values.age,
      });

      return;
    }

    props.onSubmit(values);
  });

  const fieldWrapperClassName = isDialog
    ? 'flex min-w-0 flex-col gap-2.5'
    : 'min-w-0 space-y-1';

  const labelClassName = 'text-xs font-medium text-foreground';

  const fieldClassName = isDialog
    ? 'h-10 w-full rounded-lg border-input bg-background shadow-none'
    : undefined;

  const renderError = (message?: string) => {
    if (!message) {
      return null;
    }

    return (
      <p className="break-words text-xs text-destructive">
        {message}
      </p>
    );
  };

  const formContent = (
    <form
      onSubmit={handleFormSubmit}
      className={
        isDialog
          ? 'grid w-full min-w-0 grid-cols-1 gap-x-4 gap-y-5 px-6 pb-6 sm:grid-cols-2 sm:px-7'
          : `mt-5 grid w-full min-w-0 grid-cols-1 gap-4 ${
              fullWidth ? 'sm:grid-cols-2' : 'max-w-md'
            }`
      }
    >
      {/* First name */}
      <div className={fieldWrapperClassName}>
        {isDialog && (
          <label
            htmlFor={`${formId}-first-name`}
            className={labelClassName}
          >
            {t('firstName')}
          </label>
        )}

        <Input
          id={`${formId}-first-name`}
          placeholder={t('firstName')}
          aria-label={t('firstName')}
          aria-invalid={!!form.formState.errors.firstName}
          className={fieldClassName}
          autoComplete="given-name"
          {...form.register('firstName')}
        />

        {renderError(form.formState.errors.firstName?.message)}
      </div>

      {/* Last name */}
      <div className={fieldWrapperClassName}>
        {isDialog && (
          <label
            htmlFor={`${formId}-last-name`}
            className={labelClassName}
          >
            {t('lastName')}
          </label>
        )}

        <Input
          id={`${formId}-last-name`}
          placeholder={t('lastName')}
          aria-label={t('lastName')}
          aria-invalid={!!form.formState.errors.lastName}
          className={fieldClassName}
          autoComplete="family-name"
          {...form.register('lastName')}
        />

        {renderError(form.formState.errors.lastName?.message)}
      </div>

      {/* Email */}
      <div
        className={
          isDialog
            ? `${fieldWrapperClassName} sm:col-span-2`
            : fieldWrapperClassName
        }
      >
        {isDialog && (
          <label
            htmlFor={`${formId}-email`}
            className={labelClassName}
          >
            {t('email')}
          </label>
        )}

        <Input
          id={`${formId}-email`}
          type="email"
          placeholder={t('email')}
          aria-label={t('email')}
          aria-invalid={!!form.formState.errors.email}
          className={fieldClassName}
          autoComplete="email"
          {...form.register('email')}
        />

        {renderError(form.formState.errors.email?.message)}
      </div>

      {/* Age */}
      <div className={fieldWrapperClassName}>
        {isDialog && (
          <label
            htmlFor={`${formId}-age`}
            className={labelClassName}
          >
            {t('age')}
          </label>
        )}

        <Input
          id={`${formId}-age`}
          type="number"
          placeholder={t('age')}
          aria-label={t('age')}
          aria-invalid={!!form.formState.errors.age}
          className={fieldClassName}
          {...form.register('age', {
            valueAsNumber: true,
          })}
        />

        {renderError(form.formState.errors.age?.message)}
      </div>

      {/* Login credentials: create mode only */}
      {isCreateMode && (
        <>
          {/* Username */}
          <div className={fieldWrapperClassName}>
            {isDialog && (
              <label
                htmlFor={`${formId}-username`}
                className={labelClassName}
              >
                {t('username')}
              </label>
            )}

            <Input
              id={`${formId}-username`}
              type="text"
              placeholder={t('username')}
              aria-label={t('username')}
              aria-invalid={!!form.formState.errors.username}
              className={fieldClassName}
              autoComplete="username"
              dir="ltr"
              {...form.register('username')}
            />

            {renderError(form.formState.errors.username?.message)}
          </div>

          {/* Initial password */}
          <div className={fieldWrapperClassName}>
            {isDialog && (
              <label
                htmlFor={`${formId}-password`}
                className={labelClassName}
              >
                {t('initialPassword')}
              </label>
            )}

            <Input
              id={`${formId}-password`}
              type="password"
              placeholder={t('initialPassword')}
              aria-label={t('initialPassword')}
              aria-invalid={!!form.formState.errors.password}
              className={fieldClassName}
              autoComplete="new-password"
              dir="ltr"
              {...form.register('password')}
            />

            {renderError(form.formState.errors.password?.message)}
          </div>
        </>
      )}

      {/* Submit */}
      <div
        className={
          isDialog
            ? 'flex justify-end border-t border-border pt-4 sm:col-span-2'
            : fullWidth
              ? 'sm:col-span-2 sm:flex sm:justify-end'
              : ''
        }
      >
        <Button
          type="submit"
          disabled={isLoading}
          className={
            isDialog
              ? 'h-9 w-full min-w-32 rounded-lg px-5 text-xs sm:w-auto'
              : fullWidth
                ? 'w-full sm:w-auto'
                : 'w-full'
          }
        >
          {isLoading
            ? t('saving')
            : (submitLabel ??
              (mode === 'edit' ? t('update') : t('create')))}
        </Button>
      </div>
    </form>
  );

  if (isDialog) {
    return <div className="w-full min-w-0">{formContent}</div>;
  }

  return (
    <Card
      className={`w-full min-w-0 p-4 sm:p-6 ${
        fullWidth ? 'max-w-none' : 'max-w-2xl'
      }`}
    >
      <div className="min-w-0 space-y-1">
        <h2 className="text-lg font-bold sm:text-xl">
          {title ?? (mode === 'edit' ? t('editTitle') : t('createTitle'))}
        </h2>

        <p className="text-sm text-muted-foreground">
          {description ?? t('manageDescription')}
        </p>
      </div>

      {formContent}
    </Card>
  );
}
