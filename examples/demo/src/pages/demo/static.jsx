import { Head } from "vanilla-bean";

// runs ONCE at build time with real fetch, with result is baked into the page
async function loadUUID() {
  "use static";

  const res = await fetch("https://httpbingo.org/uuid");
  return res.json();
}

const StaticDemo = () => (
  <div>
    <Head>
      <title>static demo</title>
      <meta name="description" content="'use static' demo" />
    </Head>
    <h3 class="text-lg">build-time data</h3>
    <p>
      <code>{loadUUID().uuid}</code> was fetched at build via a <code>"use static"</code> function.
    </p>
  </div>
);

export default StaticDemo;
