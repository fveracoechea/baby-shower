import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { router } from "../rpc/$router";
import { createMiddleware } from "hono/factory";

const rpcHandler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const orpcHandlerMiddleware = createMiddleware(async (c, next) => {
  const rpcResult = await rpcHandler.handle(c.req.raw, {
    context: { reqHeaders: c.req.raw.headers },
    prefix: "/rpc",
  });

  if (rpcResult.matched) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }

  await next();
});
