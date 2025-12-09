import { oc } from "@orpc/contract";
import { todoContract } from "./todo";
export const routerContract = oc.router({ todo: todoContract });
