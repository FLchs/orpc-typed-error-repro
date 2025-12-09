import { Hono } from "hono";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { router } from "./router";
import { cors } from "hono/cors";
const app = new Hono();
import * as z from "zod";
import { onError, ORPCError, ValidationError } from "@orpc/server";

const handler = new OpenAPIHandler(router, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],

  clientInterceptors: [
    onError((error) => {
      if (
        error instanceof ORPCError &&
        error.code === "BAD_REQUEST" &&
        error.cause instanceof ValidationError
      ) {
        // If you only use Zod you can safely cast to ZodIssue[]
        const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

        throw new ORPCError("INPUT_VALIDATION_FAILED", {
          status: 422,
          message: z.prettifyError(zodError),
          data: z.flattenError(zodError),
          cause: error.cause,
        });
      }
    }),
  ],

  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

app.use(
  "/*",
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS", "DELETE"],
    credentials: true,
    origin: process.env.CORS_ORIGIN || "",
  }),
);

app.use("/*", async (c, next) => {
  const apiResult = await handler.handle(c.req.raw, {
    prefix: "/api",
  });

  if (apiResult.matched) {
    return c.newResponse(apiResult.response.body, apiResult.response);
  }

  await next();
});

export default app;
