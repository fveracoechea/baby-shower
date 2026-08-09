import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

import type { RPCClient } from "../rpc/$router";

export { getIssueMessage, parseFormData } from "@orpc/openapi-client/helpers";
export { safe } from "@orpc/client";

const link = new RPCLink({
  url: () => new URL("/rpc", globalThis.location.origin),
  // Resolve fetch per call so tests can stub globalThis.fetch after import.
  fetch: (request, init) => globalThis.fetch(request, init),
});

export const $: RPCClient = createORPCClient(link);
