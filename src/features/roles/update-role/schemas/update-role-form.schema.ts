import { z } from "zod";

interface Messages {
  nameMin: string;
  nameMax: string;
  descriptionMax: string;
}

export function updateRoleFormSchema(messages: Messages) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, messages.nameMin)
      .max(80, messages.nameMax),

    description: z
      .string()
      .trim()
      .max(500, messages.descriptionMax),
  });
}

export type UpdateRoleFormValues = z.infer<
  ReturnType<typeof updateRoleFormSchema>
>;