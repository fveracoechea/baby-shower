import * as z from "zod";
import type { ValidationTargets } from "hono";
import { zValidator } from "@hono/zod-validator";

export const zodValidator = <T extends z.ZodSchema, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(z.flattenError(result.error), 400 as const);
    }
  });
