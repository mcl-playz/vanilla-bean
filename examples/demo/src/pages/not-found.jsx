"use client";

import { Button } from "../components/button";
import { navigate, useLocation, Head } from "vanilla-bean";

export default () => (
  <Fragment>
    <Head>
      <title>not found</title>
    </Head>
    <p>
      nothing lives at <code>{useLocation().path}</code>.
    </p>
    <Button onClick={() => navigate("/")}>go home</Button>
  </Fragment>
);
