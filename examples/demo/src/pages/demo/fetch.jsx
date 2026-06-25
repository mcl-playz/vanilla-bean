import { Head, Suspense, ErrorBoundary, signal, effect } from "vanilla-bean";

function Origin() {
  const data = signal(null);

  effect(async () => {
    const req = await fetch("https://httpbingo.org/get");
    data = await req.json();
  });

  return <div onClick={() => alert("your origin: " + data?.origin)}>origin: {data?.origin}</div>;
}

function Boom() {
  throw new Error("render failed on purpose");
}

export default () => (
  <Fragment>
    <Head>
      <title>fetch</title>
      <meta name="description" content="Suspense (loading/error) + ErrorBoundary." />
    </Head>

    <Suspense
      fallback={({ error }) =>
        error ? <p class="text-red-500">failed: {error.message}</p> : <p class="text-zinc-400">loading…</p>
      }
    >
      <Origin />
    </Suspense>
    <ErrorBoundary fallback={(err) => <p class="text-red-500">caught: {err.message}</p>}>
      <Boom />
    </ErrorBoundary>
  </Fragment>
);
