import { Head, signal, For } from "vanilla-bean";
import { Button } from "../../components/button";

export default function WsDemo() {
  const log = signal([]);
  const text = signal("");
  let socket = null;

  if (!import.meta.env.SSR) {
    socket = new WebSocket(`ws://${location.host}/api/echo`);
    socket.onmessage = (e) => log([...log(), e.data]);
    socket.onclose = () => log([...log(), "● closed"]);
  }

  const send = () => {
    if (text() && socket?.readyState === 1) {
      socket.send(text());
      text("");
    }
  };

  return (
    <Fragment>
      <Head>
        <title>websocket</title>
      </Head>
      <h3>websocket</h3>
      <p>
        Live socket to <code>/api/echo</code> (a <code>*.ws.js</code> route).
      </p>
      <div class="flex gap-2">
        <input
          value={text}
          onInput={(e) => text(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="say something…"
          class="border-b outline-none"
        />
        <Button onClick={send}>send</Button>
      </div>
      <For each={() => log()} as="ul" class="mt-2 text-sm">
        {(m) => <li>{m}</li>}
      </For>
    </Fragment>
  );
}
