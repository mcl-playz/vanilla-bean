import { signal, useTransition } from "vanilla-bean";

export default function TransitionDemo() {
  const [isPending, start] = useTransition();
  const tab = signal("home");

  const select = (name) =>
    start(async () => {
      await new Promise((r) => setTimeout(r, 600));
      tab = name;
    });

  return (
    <div class="p-4">
      <h3>useTransition</h3>
      <div class="flex gap-2">
        <button onClick={() => select("home")}>Home</button>
        <button onClick={() => select("about")}>About</button>
      </div>
      <p>{isPending ? "loading…" : "tab: " + tab}</p>
    </div>
  );
}
