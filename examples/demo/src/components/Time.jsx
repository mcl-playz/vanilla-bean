import { signal } from "vanilla-bean";

export default function Time() {
  "use client";
  const now = signal(new Date().toLocaleTimeString());
  setInterval(() => now(new Date().toLocaleTimeString()), 1000);
  return <strong>{now}</strong>;
}

Time.fallback = () => <strong class="invisible">00:00:00 __</strong>;
