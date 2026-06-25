import { signal } from "vanilla-bean";

export default function Time() {
  const now = signal(new Date().toLocaleTimeString());
  setInterval(() => now(new Date().toLocaleTimeString()), 1000);
  return <strong>{now}</strong>;
}
