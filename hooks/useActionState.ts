import { useState, useTransition } from 'react';

/**
 * Will be replaced in React 19
 */
const useActionState = <State, Payload>(
  action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
): [state: Awaited<State>, dispatch: (payload: Payload) => void, isPending: boolean] => {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState(initialState);

  return [
    state,
    async (payload: Payload) => {
      startTransition(async () => {
        const newState = await action(state, payload);
        setState(newState);
      });
    },
    isPending,
  ];
};

export default useActionState;
