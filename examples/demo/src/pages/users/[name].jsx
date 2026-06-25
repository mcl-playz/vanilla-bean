import { Head } from "vanilla-bean";

export default ({ params }) => (
  <Fragment>
    <Head>
      <title>user {params.name}</title>
    </Head>
    <h1 class="text-xl">user name: {params.name}</h1>
  </Fragment>
);
