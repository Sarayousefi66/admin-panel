'use client';

import { ChangeCredentialsForm } from '@/features/auth/components/change-credentials-form';
import { useChangeCredentials } from '@/features/auth/hooks/use-change-credentials';

import { LanguageSwitcher } from '@/shared/components/layout/language-switcher';
import { ThemeToggle } from '@/shared/components/layout/theme-toggle';

export default function ChangeCredentialsPage() {
  const changeCredentials = useChangeCredentials();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 flex justify-end gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <ChangeCredentialsForm
        isPending={changeCredentials.isPending}
        onSubmit={(values) =>
          changeCredentials.mutate(values)
        }
      />
    </main>
  );
}