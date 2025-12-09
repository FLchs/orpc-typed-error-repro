import { implement } from "@orpc/server";
import { routerContract } from "@repro/contract";

const os = implement(routerContract);

let todos = [
  {
    id: 1,
    description: "It is probably a mess !",
    title: "Clean my code !",
  },
  { id: 2, title: "Buy milk", description: "" },
];

const list = os.todo.list.handler(() => {
  return todos;
});

const remove = os.todo.remove.handler(({ input }) => {
  todos = todos.filter((t) => t.id !== input.id);
  return { ok: true };
});

const removeWithError = os.todo.removeWithError.handler(({ input }) => {
  todos = todos.filter((t) => t.id !== input.id);
  return { ok: true };
});

export const router = os.router({
  todo: {
    list,
    remove,
    removeWithError,
  },
});
