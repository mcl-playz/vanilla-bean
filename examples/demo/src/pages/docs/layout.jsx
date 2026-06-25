import { cn } from "cnfast";

const links = [
  { href: "/docs", label: "intro" },
  { href: "/docs/guide/install", label: "install" },
  { href: "/docs/guide/routing", label: "routing" },
  { href: "/docs/api/streaming", label: "streaming" },
];

const Link = ({ href, label }) => (
  <a
    href={href}
    class={cn("hover:underline", "text-zinc-600 hover:text-zinc-900", "dark:text-zinc-400 dark:hover:text-zinc-100")}
  >
    {label}
  </a>
);

export default ({ children }) => (
  <section class="flex gap-6">
    <nav class="flex w-32 shrink-0 flex-col gap-1 border-r border-white/10 pr-4 text-sm">{links.map(Link)}</nav>
    <div class="flex-1">{children}</div>
  </section>
);
