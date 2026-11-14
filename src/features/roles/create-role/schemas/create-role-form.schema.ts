import { z } from "zod";

interface Messages {
  nameMin: string;
  nameMax: string;
  slugRequired: string;
  slugFormat: string;
  slugMax: string;
  descriptionMax: string;
}

export function createRoleFormSchema(messages: Messages) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, messages.nameMin)
      .max(80, messages.nameMax),

    slug: z
      .string()
      .trim()
      .min(1, messages.slugRequired)
      .max(60, messages.slugMax)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, messages.slugFormat),

    description: z
      .string()
      .trim()
      .max(500, messages.descriptionMax),
  });
}

export type CreateRoleFormValues = z.infer<
  ReturnType<typeof createRoleFormSchema>
>;