'use client';

import { useTranslations } from 'next-intl';

import { UserForm } from '@/features/users/shared/components/user-form';
import type { CreateUserFormValues } from '@/features/users/shared/schemas/user-form.schema';
import { getErrorMessage } from '@/shared/lib/api-error';
import { appToast } from '@/shared/lib/toast';

import { useCreateUser } from '../hooks/use-create-user';

interface Props {
  onCreated: () => void;
  variant?: 'card' | 'dialog';
}

export default function CreateUserForm({
  onCreated,
  variant = 'card',
}: Props) {
  const createUser = useCreateUser();

  const t = useTranslations('users.notifications');
  const errorT = useTranslations('errors');

  const handleSubmit = async (values: CreateUserFormValues) => {
    try {
      await createUser.mutateAsync(values);

      // Close the dialog only after successful creation.
      onCreated();

      appToast.success(t('created'));
    } catch (error) {
      appToast.error(getErrorMessage(error, errorT));
    }
  };

  return (
    <UserForm
      mode="create"
      variant={variant}
      isLoading={createUser.isPending}
      onSubmit={handleSubmit}
    />
  );
}