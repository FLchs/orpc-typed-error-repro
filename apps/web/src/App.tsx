import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "./lib/client";
import { isDefinedError } from "@orpc/client";

function App() {
  const queryClient = useQueryClient();
  const { data } = useQuery(orpc.todo.list.queryOptions());
  const { mutate: remove } = useMutation(
    orpc.todo.remove.mutationOptions({
      onError: (error) => {
        if (isDefinedError(error) && error.code === "INPUT_VALIDATION_FAILED") {
          console.log(error, "is typed");
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.todo.list.key() });
      },
    }),
  );
  const { mutate: removeWithError } = useMutation(
    orpc.todo.removeWithError.mutationOptions({
      onError: (error) => {
        //  typescript: Property 'code' does not exist on type 'never'. [2339]
        if (isDefinedError(error) && error.code === "INPUT_VALIDATION_FAILED") {
          console.log(error, "is typed");
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.todo.list.key() });
      },
    }),
  );

  return (
    <>
      <ul>
        {data?.map((todo) => {
          return (
            <li>
              {todo.title}
              <p>{todo.description}</p>
              <button onClick={() => remove({ id: todo.id })}>Delete</button>
              <br />
              <br />
              <button onClick={() => removeWithError({ id: todo.id })}>Delete (with error)</button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
