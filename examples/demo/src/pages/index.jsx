import { Button } from "../components/button";
import { Head, signal, navigate } from "vanilla-bean";

export default function Home({ query }) {
  const local = signal(0);
  const name = signal(query.name ?? "");

  const onName = (e) => {
    name = e.target.value;
    navigate.params.set("name", name || null);
  };

  return (
    <Fragment>
      <Head>
        <title>home</title>
      </Head>
      <h1 class="text-xl">Hello, {name || "world"}</h1>
      <div class="flex flex-col gap-y-4 items-start">
        <input value={name} onBlur={onName} placeholder="your name" class="outline-none border-b" />

        <div class="flex gap-x-3">
          <Button onClick={() => local++}>page-local count: {local}</Button>
          {name && <Button onClick={() => navigate(`/users/${name}`)}>goto /users/{name}</Button>}
        </div>
      </div>
    </Fragment>
  );
}
