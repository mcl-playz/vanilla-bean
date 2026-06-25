import { Head } from "vanilla-bean";

export default function Docs({ params }) {
  const here = params.slug.length ? params.slug.join("/") : "(index)";

  return (
    <Fragment>
      <Head>
        <title>docs {here}</title>
      </Head>
      <h1 class="text-xl">doc page: {here}</h1>
    </Fragment>
  );
}
