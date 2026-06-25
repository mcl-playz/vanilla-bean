import { Head } from "vanilla-bean";

export default ({ params }) => (
  <Fragment>
    <Head>
      <title>blog: {params.slug.join("/")}</title>
    </Head>
    <h1 class="text-xl">/{params.slug.join("/")}</h1>
  </Fragment>
);
