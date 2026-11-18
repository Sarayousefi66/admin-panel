
import { z } from 'zod';

import {
    PASSWORD_COMPLEXITY_PATTERN,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
} from '@/shared/lib/password-policy';

interface PasswordValidationMessages {
  passwordMin: string;
  passwordMax: string;
  passwordComplexity: string;
}

export function createPasswordSchema(
  messages: PasswordValidationMessages,
) {
  return z
    .string()
    .min(PASSWORD_MIN_LENGTH, messages.passwordMin)
    .max(PASSWORD_MAX_LENGTH, messages.passwordMax)
    .regex(
      PASSWORD_COMPLEXITY_PATTERN,
      messages.passwordComplexity,
    );
}
