
import { z } from 'zod';

import { createPasswordSchema } from '@/shared/schemas/password.schema';

interface UserValidationMessages {
  firstNameMin: string;
  lastNameMin: string;
  emailInvalid: string;
  ageMin: string;
  usernameInvalid: string;
  passwordMin: string;
  passwordMax: string;
  passwordComplexity: string;
}

export function createUserProfileFormSchema(
  messages: Pick<
    UserValidationMessages,
    'firstNameMin' | 'lastNameMin' | 'emailInvalid' | 'ageMin'
  >,
) {
  return z.object({
    firstName: z.string().trim().min(2, messages.firstNameMin),

    lastName: z.string().trim().min(2, messages.lastNameMin),

    email: z.email({
      error: messages.emailInvalid,
    }),

    age: z.number().min(18, messages.ageMin),
  });
}

export function createUserFormSchema(messages: UserValidationMessages) {
  return createUserProfileFormSchema(messages).extend({
    username: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9._-]{3,32}$/, messages.usernameInvalid),

    password: createPasswordSchema({
      passwordMin: messages.passwordMin,
      passwordMax: messages.passwordMax,
      passwordComplexity: messages.passwordComplexity,
    }),
  });
}

export type UserProfileFormValues = z.infer<
  ReturnType<typeof createUserProfileFormSchema>
>;

export type CreateUserFormValues = z.infer<
  ReturnType<typeof createUserFormSchema>
>;

export type UserFormValues = UserProfileFormValues;
