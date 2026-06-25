import { Head } from "vanilla-bean";
import { Button } from "../components/button";

export default ({ error, reset }) => (
  <Fragment>
    <Head>
      <title>error</title>
    </Head>
    <h1 class="text-xl mb-4">something broke</h1>
    <div class="flex flex-col gap-y-2 items-start">
      <pre>{String(error?.message ?? error)}</pre>
      <Button onClick={reset}>try again</Button>
    </div>
  </Fragment>
);
