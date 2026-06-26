import { signal, effect } from "vanilla-bean";
import { useGreeting } from "../../lib/hooks";
import Pill from "../../components/Pill.jsx";

const total = signal(100); // (1) module-level signal

let runs = 0;
function useRuns() {
  // (2) same-file lowercase hook that uses ctx (effect)
  effect(() => void runs++);
  return "ran";
}

function Badge({ label }) {
  return <b>{label}</b>;
}

const tags = [{ text: "alpha" }, { text: "beta" }, { text: "gamma" }];

export default function Patterns() {
  const hook = useRuns(); // (2) same-file hook
  const greeting = useGreeting("ada"); // (5) cross-file hook + (6) returned signal
  const direct = Badge({ label: "called directly" }); // (4) direct component call

  return (
    <div class="space-y-1">
      <h3 class="text-lg">compiler patterns</h3>
      <p>1. module-level signal: {total}</p>
      <p>2. same-file hook: {hook}</p>
      <p>4. direct component call: {direct}</p>
      <p>5+6. cross-file hook returning a signal: {greeting}</p>
      <p>3. imported component, point-free:</p>
      <ul class="flex gap-1">{tags.map(Pill)}</ul>
    </div>
  );
}
