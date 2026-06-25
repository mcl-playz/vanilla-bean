import { Head } from "vanilla-bean";

async function ServerOrigin() {
  "use server";
  const data = await (await fetch("https://httpbingo.org/get")).json();

  return (
    <p>
      your origin, resolved on the server: <code>{data.origin}</code>
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
        Fetched + rendered on the server with a plain <code>async</code> component, <strong>streamed</strong> in after
        the shell, adopted with no client re-fetch.
      </p>
      <ServerOrigin />
    </Fragment>
  );
}
