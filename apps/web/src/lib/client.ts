import type { JsonifiedClient } from "@orpc/openapi-client";
import type { ContractRouterClient } from "@orpc/contract";
import { createORPCClient, onError } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { routerContract } from "@repro/contract";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const link = new OpenAPILink(routerContract, {
  url: "http://localhost:3000/api",
  fetch: (request, init) => {
    return globalThis.fetch(request, {
      ...init,
      credentials: "include", // Include cookies for cross-origin requests
    });
  },
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const client: JsonifiedClient<ContractRouterClient<typeof routerContract>> = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
