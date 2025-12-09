import { oc } from "@orpc/contract";
import { errors } from "./errors";
import * as z from "zod/v4";

const todosSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
  }),
);

const list = oc
  .route({
    method: "GET",
    path: "/",
  })
  .errors(errors)
  .output(todosSchema);

const remove = oc
  .route({
    method: "DELETE",
    path: "/{id}",
  })
  .input(
    z.object({
      id: z.coerce.number<Number>(),
    }),
  )
  .errors(errors);

const removeWithError = oc
  .route({
    method: "DELETE",
    path: "/error/{id}",
  })
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .errors(errors);

export const todoContract = {
  list,
  remove,
  removeWithError,
};
