
import { z } from 'zod';

import { createPasswordSchema } from '@/shared/schemas/password.schema';

interface ChangeCredentialsValidationMessages {
  usernameInvalid: string;
  passwordMin: string;
  passwordMax: string;
  passwordComplexity: string;
  confirmPasswordMismatch: string;
}

export function createChangeCredentialsSchema(
  messages: ChangeCredentialsValidationMessages,
) {
  return z
    .object({
      username: z
        .string()
        .trim()
        .regex(
          /^[a-zA-Z0-9._-]{3,32}$/,
          messages.usernameInvalid,
        ),

      password: createPasswordSchema({
        passwordMin: messages.passwordMin,
        passwordMax: messages.passwordMax,
        passwordComplexity: messages.passwordComplexity,
      }),

      confirmPassword: z.string(),
    })
    .refine(
      (values) => values.password === values.confirmPassword,
      {
        message: messages.confirmPasswordMismatch,
        path: ['confirmPassword'],
      },
    );
}

export type ChangeCredentialsFormValues = z.infer<
  ReturnType<typeof createChangeCredentialsSchema>
>;
