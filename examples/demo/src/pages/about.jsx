"use static";

import { Head } from "vanilla-bean";

export default () => (
  <Fragment>
    <Head>
      <title>about</title>
    </Head>
    <p>
      This page is marked <code>"use static"</code>. It's prerendered at build and the client adopts the server DOM
      rather than re-rendering it.
    </p>
  </Fragment>
);
