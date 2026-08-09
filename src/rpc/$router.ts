import { os, type RouterClient } from "@orpc/server";
import * as z from "zod";

const RSVPFormSchema = z.object({
  name: z.string().trim().min(1),
  attending: z.stringbool(),
  plusOne: z.stringbool().default(false),
  plusOneName: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().trim().min(1).optional(),
  ),
  theory: z.enum(["girl", "boy"]).optional(),
});

export const router = {
  rsvp: os
    .meta({ method: "post" })
    .input(RSVPFormSchema)
    .handler(async ({ input }) => {
      return { ok: true, input };
    }),
};

export type RPCClient = RouterClient<typeof router>;
