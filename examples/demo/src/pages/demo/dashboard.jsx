"use server";

import { cookies } from "vanilla-bean";

export default function Dashboard() {
  const user = cookies().get("session");

  return (
    <div class="p-4">
      <h3 class="text-lg">dashboard</h3>
      <p>
        secret content, guarded by <code>middleware.js</code> before render. hi <strong>{user}</strong>
      </p>
    </div>
  );
}
