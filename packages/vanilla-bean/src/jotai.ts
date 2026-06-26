import { makeSignal, onCleanup, type Ctx } from "vanilla-bean";
import { getDefaultStore, type Atom, type WritableAtom } from "jotai/vanilla";

type Store = ReturnType<typeof getDefaultStore>;

export function useAtomValue<T>(ctx: Ctx, atom: Atom<T>, store: Store = getDefaultStore()): () => T {
  const value = makeSignal<T>(store.get(atom));
  if (!import.meta.env?.SSR)
    onCleanup(
      ctx,
      store.sub(atom, () => value(ctx, store.get(atom))),
    );
  return () => value(ctx) as T;
}

export function useSetAtom<A extends unknown[], R>(
  _ctx: Ctx,
  atom: WritableAtom<unknown, A, R>,
  store: Store = getDefaultStore(),
): (...args: A) => R {
  return (...args: A) => store.set(atom, ...args);
}

export function useAtom<T, A extends unknown[], R>(
  ctx: Ctx,
  atom: WritableAtom<T, A, R>,
  store: Store = getDefaultStore(),
): [() => T, (...args: A) => R] {
  return [useAtomValue(ctx, atom, store), useSetAtom(ctx, atom, store)];
}
