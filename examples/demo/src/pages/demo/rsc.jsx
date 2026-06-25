import { Head, Suspense, signal, effect } from "vanilla-bean";

function ServerOrigin() {
  "use server";
  const data = signal(null);

  effect(async () => {
    data(await (await fetch("https://httpbingo.org/get")).json());
  });

  return (
    <p>
      your origin, resolved on the server: <code>{data?.origin}</code>
    </p>
  );
}

export default function RscDemo() {
  return (
    <Fragment>
      <Head>
        <title>use server</title>
      </Head>
      <h3>"use server" component</h3>
      <p class="hint">
        Fetched + rendered on the server, <strong>streamed</strong> in after the shell, adopted with no client re-fetch.
      </p>
      <Suspense fallback={() => <p class="text-zinc-400">resolving on the server…</p>}>
        <ServerOrigin />
      </Suspense>
    </Fragment>
  );
}
