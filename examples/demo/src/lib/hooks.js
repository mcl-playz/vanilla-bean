import { signal, onCleanup } from "vanilla-bean";

export function useGreeting(name) {
  onCleanup(() => {});
  return signal("hi " + name);
}
