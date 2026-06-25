export function open(ws) {
  ws.send("connected");
}

export function message(ws, data) {
  ws.send("echo: " + data);
}

export function close() {}
